from __future__ import annotations

import csv
import os
from datetime import datetime
from pathlib import Path
from tempfile import NamedTemporaryFile
from typing import Any, Dict, List, Optional

from fastapi import HTTPException

try:
    from .db import supabase
except ImportError:
    from db import supabase

TABLE_NAME = "Tarea"
CSV_HEADERS = ["id", "title", "description", "estado", "crateAt"]
CSV_PATH = Path(
    os.getenv("TASKS_CSV_PATH", Path(__file__).resolve().parent / "tasks_backup.csv")
)
_current_storage_mode = "supabase" if supabase is not None else "csv"


def _normalize_row(row: Dict[str, Any]) -> Dict[str, Any]:
    normalized = dict(row)
    if "crateAt" not in normalized:
        if "createdAt" in normalized:
            normalized["crateAt"] = normalized["createdAt"]
        elif "created_at" in normalized:
            normalized["crateAt"] = normalized["created_at"]
        else:
            normalized["crateAt"] = datetime.utcnow().isoformat()

    normalized["id"] = int(normalized["id"])
    normalized["description"] = normalized.get("description")
    return normalized


def _ensure_csv_exists() -> None:
    CSV_PATH.parent.mkdir(parents=True, exist_ok=True)
    if not CSV_PATH.exists():
        with CSV_PATH.open("w", newline="", encoding="utf-8") as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=CSV_HEADERS)
            writer.writeheader()


def _read_csv_rows() -> List[Dict[str, Any]]:
    _ensure_csv_exists()
    with CSV_PATH.open("r", newline="", encoding="utf-8") as csvfile:
        reader = csv.DictReader(csvfile)
        rows = []
        for row in reader:
            if not row:
                continue
            rows.append(_normalize_row(row))
        return rows


def _write_csv_rows(rows: List[Dict[str, Any]]) -> None:
    _ensure_csv_exists()
    with NamedTemporaryFile(
        "w",
        newline="",
        encoding="utf-8",
        delete=False,
        dir=str(CSV_PATH.parent),
    ) as tmpfile:
        writer = csv.DictWriter(tmpfile, fieldnames=CSV_HEADERS)
        writer.writeheader()
        for row in rows:
            normalized = _normalize_row(row)
            writer.writerow(
                {
                    "id": normalized["id"],
                    "title": normalized["title"],
                    "description": normalized.get("description") or "",
                    "estado": normalized["estado"],
                    "crateAt": normalized["crateAt"],
                }
            )
        temp_name = tmpfile.name

    os.replace(temp_name, CSV_PATH)


def _next_csv_id(rows: List[Dict[str, Any]]) -> int:
    if not rows:
        return 1
    return max(int(row["id"]) for row in rows) + 1


def _select_all_csv(estado: Optional[str] = None) -> List[Dict[str, Any]]:
    rows = _read_csv_rows()
    if estado:
        rows = [row for row in rows if row["estado"] == estado]
    return sorted(rows, key=lambda item: item["id"])


def _select_one_csv(tarea_id: int) -> Dict[str, Any]:
    for row in _read_csv_rows():
        if row["id"] == tarea_id:
            return row
    raise HTTPException(status_code=404, detail="Tarea no encontrada")


def _insert_csv(data: Dict[str, Any]) -> Dict[str, Any]:
    rows = _read_csv_rows()
    tarea = {
        "id": data.get("id") or _next_csv_id(rows),
        "title": data["title"],
        "description": data.get("description"),
        "estado": data["estado"],
        "crateAt": data.get("crateAt") or datetime.utcnow().isoformat(),
    }
    rows.append(tarea)
    _write_csv_rows(rows)
    return _normalize_row(tarea)


def _update_csv(tarea_id: int, data: Dict[str, Any]) -> Dict[str, Any]:
    rows = _read_csv_rows()
    updated = None

    for row in rows:
        if row["id"] == tarea_id:
            row.update(data)
            updated = _normalize_row(row)
            break

    if updated is None:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")

    _write_csv_rows(rows)
    return updated


def _delete_csv(tarea_id: int) -> Dict[str, int]:
    rows = _read_csv_rows()
    remaining = [row for row in rows if row["id"] != tarea_id]

    if len(remaining) == len(rows):
        raise HTTPException(status_code=404, detail="Tarea no encontrada")

    _write_csv_rows(remaining)
    return {"deleted": tarea_id}


def _supabase_available() -> bool:
    return supabase is not None


def _select_all_primary(estado: Optional[str] = None) -> List[Dict[str, Any]]:
    query = supabase.table(TABLE_NAME).select("*").order("id")
    if estado:
        query = query.eq("estado", estado)
    response = query.execute()
    data = response.data or []
    return [_normalize_row(item) for item in data]


def _select_one_primary(tarea_id: int) -> Dict[str, Any]:
    response = supabase.table(TABLE_NAME).select("*").eq("id", tarea_id).single().execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")
    return _normalize_row(response.data)


def _insert_primary(data: Dict[str, Any]) -> Dict[str, Any]:
    response = supabase.table(TABLE_NAME).insert(data).execute()
    if not response.data:
        raise HTTPException(status_code=400, detail="No se pudo crear la tarea")
    return _normalize_row(response.data[0])


def _update_primary(tarea_id: int, data: Dict[str, Any]) -> Dict[str, Any]:
    response = supabase.table(TABLE_NAME).update(data).eq("id", tarea_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")
    return _normalize_row(response.data[0])


def _delete_primary(tarea_id: int) -> Dict[str, int]:
    response = supabase.table(TABLE_NAME).delete().eq("id", tarea_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")
    return {"deleted": tarea_id}


def _run_with_fallback(primary_action, csv_action):
    global _current_storage_mode

    if not _supabase_available():
        _current_storage_mode = "csv"
        return csv_action()

    try:
        result = primary_action()
        _current_storage_mode = "supabase"
        return result
    except HTTPException:
        raise
    except Exception:
        _current_storage_mode = "csv"
        return csv_action()


def list_tasks(estado: Optional[str] = None) -> List[Dict[str, Any]]:
    return _run_with_fallback(
        lambda: _select_all_primary(estado),
        lambda: _select_all_csv(estado),
    )


def get_task(tarea_id: int) -> Dict[str, Any]:
    return _run_with_fallback(
        lambda: _select_one_primary(tarea_id),
        lambda: _select_one_csv(tarea_id),
    )


def create_task(data: Dict[str, Any]) -> Dict[str, Any]:
    return _run_with_fallback(
        lambda: _insert_primary(data),
        lambda: _insert_csv(data),
    )


def update_task(tarea_id: int, data: Dict[str, Any]) -> Dict[str, Any]:
    return _run_with_fallback(
        lambda: _update_primary(tarea_id, data),
        lambda: _update_csv(tarea_id, data),
    )


def delete_task(tarea_id: int) -> Dict[str, int]:
    return _run_with_fallback(
        lambda: _delete_primary(tarea_id),
        lambda: _delete_csv(tarea_id),
    )


def get_storage_mode() -> str:
    return _current_storage_mode
