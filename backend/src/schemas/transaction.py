import uuid
from datetime import date as Date
from datetime import datetime
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, field_validator

from src.schemas.category import CategoryOut


class TransactionCreate(BaseModel):
    amount: Decimal
    transaction_type: Literal["income", "expense"]
    description: str | None = None
    date: Date
    category_id: uuid.UUID | None = None

    @field_validator("amount")
    @classmethod
    def amount_positive(cls, v: Decimal) -> Decimal:
        if v <= 0:
            raise ValueError("Amount must be positive")
        return v


class TransactionUpdate(BaseModel):
    amount: Decimal | None = None
    transaction_type: Literal["income", "expense"] | None = None
    description: str | None = None
    date: Date | None = None
    category_id: uuid.UUID | None = None


class TransactionOut(BaseModel):
    id: uuid.UUID
    amount: Decimal
    transaction_type: str
    description: str | None
    date: Date
    category: CategoryOut | None
    created_at: datetime

    model_config = {"from_attributes": True}


class TransactionListResponse(BaseModel):
    items: list[TransactionOut]
    total: int
