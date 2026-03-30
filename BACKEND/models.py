from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, AliasChoices


class EstadoTarea(str, Enum):
    COMPLETADO = "completado"
    PENDIENTE = "pendiente"
    FINALIZADO = "finalizado"


class TareaBase(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="ignore")

    title: str
    description: Optional[str] = None
    estado: EstadoTarea
    crateAt: datetime = Field(
        default_factory=datetime.utcnow,
        validation_alias=AliasChoices("crateAt", "createdAt", "created_at"),
        serialization_alias="crateAt",
    )


class TareaCreate(TareaBase):
    pass


class TareaUpdate(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="ignore")

    title: Optional[str] = None
    description: Optional[str] = None
    estado: Optional[EstadoTarea] = None
    crateAt: Optional[datetime] = Field(
        default=None,
        validation_alias=AliasChoices("crateAt", "createdAt", "created_at"),
        serialization_alias="crateAt",
    )


class TareaOut(TareaBase):
    id: int
