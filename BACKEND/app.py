import os
from typing import List, Dict, Any

from fastapi import FastAPI, HTTPException, status
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware

from db import supabase
from models import TareaCreate, TareaOut, TareaUpdate

TABLE_NAME = "Tarea"

app = FastAPI(title="Gestor de Tareas API")

frontend_origins = os.getenv("FRONTEND_ORIGIN", "*")
origins = [origin.strip() for origin in frontend_origins.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["health"])
async def root():
    return {"message": "Gestor de Tareas API"}


@app.get("/health", tags=["health"])
async def health_check():
    return {"status": "ok"}


def _normalize_row(row: Dict[str, Any]) -> Dict[str, Any]:
    if "crateAt" not in row:
        if "createdAt" in row:
            row["crateAt"] = row["createdAt"]
        elif "created_at" in row:
            row["crateAt"] = row["created_at"]
    return row


def _select_all() -> List[dict]:
    response = supabase.table(TABLE_NAME).select("*").order("id").execute()
    data = response.data or []
    return [_normalize_row(item) for item in data]


def _select_one(tarea_id: int) -> dict:
    response = (
        supabase.table(TABLE_NAME).select("*").eq("id", tarea_id).single().execute()
    )
    if not response.data:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")
    return _normalize_row(response.data)


@app.get(
    "/tasks", response_model=List[TareaOut], response_model_by_alias=False, tags=["tareas"]
)
@app.get(
    "/tareas", response_model=List[TareaOut], response_model_by_alias=False, tags=["tareas"]
)
def listar_tareas():
    return _select_all()


@app.get(
    "/tasks/{tarea_id}",
    response_model=TareaOut,
    response_model_by_alias=False,
    tags=["tareas"],
)
@app.get(
    "/tareas/{tarea_id}",
    response_model=TareaOut,
    response_model_by_alias=False,
    tags=["tareas"],
)
def obtener_tarea(tarea_id: int):
    return _select_one(tarea_id)


@app.post(
    "/tasks",
    response_model=TareaOut,
    response_model_by_alias=False,
    status_code=status.HTTP_201_CREATED,
    tags=["tareas"],
)
@app.post(
    "/tareas",
    response_model=TareaOut,
    response_model_by_alias=False,
    status_code=status.HTTP_201_CREATED,
    tags=["tareas"],
)
def crear_tarea(tarea: TareaCreate):
    data = jsonable_encoder(
        tarea.model_dump(by_alias=True, exclude_none=True, exclude={"crateAt"})
    )
    response = supabase.table(TABLE_NAME).insert(data).execute()
    if not response.data:
        raise HTTPException(status_code=400, detail="No se pudo crear la tarea")
    return _normalize_row(response.data[0])


@app.put(
    "/tasks/{tarea_id}",
    response_model=TareaOut,
    response_model_by_alias=False,
    tags=["tareas"],
)
@app.put(
    "/tareas/{tarea_id}",
    response_model=TareaOut,
    response_model_by_alias=False,
    tags=["tareas"],
)
def actualizar_tarea(tarea_id: int, tarea: TareaUpdate):
    data = jsonable_encoder(
        tarea.model_dump(by_alias=True, exclude_none=True, exclude={"crateAt"})
    )
    if not data:
        raise HTTPException(
            status_code=400, detail="No hay campos para actualizar"
        )
    response = supabase.table(TABLE_NAME).update(data).eq("id", tarea_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")
    return _normalize_row(response.data[0])


@app.delete("/tasks/{tarea_id}", tags=["tareas"])
@app.delete("/tareas/{tarea_id}", tags=["tareas"])
def eliminar_tarea(tarea_id: int):
    response = supabase.table(TABLE_NAME).delete().eq("id", tarea_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")
    return {"deleted": tarea_id}
