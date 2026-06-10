import uuid
from datetime import datetime
from typing import Literal

from pydantic import BaseModel


class CategoryCreate(BaseModel):
    name: str
    color: str
    icon: str
    transaction_type: Literal["income", "expense"]


class CategoryUpdate(BaseModel):
    name: str | None = None
    color: str | None = None
    icon: str | None = None
    transaction_type: Literal["income", "expense"] | None = None


class CategoryOut(BaseModel):
    id: uuid.UUID
    name: str
    color: str
    icon: str
    transaction_type: str
    created_at: datetime

    model_config = {"from_attributes": True}
