import os
from typing import List

from fastapi import FastAPI, HTTPException, Query, status
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware

try:
    from .models import EstadoTarea, TareaCreate, TareaOut, TareaUpdate
    from .storage import (
        create_task,
        delete_task,
        get_storage_mode,
        get_task,
        list_tasks,
        update_task,
    )
except ImportError:
    from models import EstadoTarea, TareaCreate, TareaOut, TareaUpdate
    from storage import (
        create_task,
        delete_task,
        get_storage_mode,
        get_task,
        list_tasks,
        update_task,
    )

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
    return {"status": "ok", "storage": get_storage_mode()}


@app.get(
    "/tasks", response_model=List[TareaOut], response_model_by_alias=False, tags=["tareas"]
)
@app.get(
    "/tareas", response_model=List[TareaOut], response_model_by_alias=False, tags=["tareas"]
)
def listar_tareas(estado: EstadoTarea | None = Query(default=None)):
    return list_tasks(estado.value if estado else None)


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
    return get_task(tarea_id)


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
    return create_task(data)


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
    return update_task(tarea_id, data)


@app.delete("/tasks/{tarea_id}", tags=["tareas"])
@app.delete("/tareas/{tarea_id}", tags=["tareas"])
def eliminar_tarea(tarea_id: int):
    return delete_task(tarea_id)
