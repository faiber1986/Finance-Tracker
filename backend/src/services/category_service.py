import uuid
from typing import Any

from fastapi import HTTPException, status
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.category import Category
from src.schemas.category import CategoryCreate, CategoryUpdate

DEFAULT_CATEGORIES: list[dict[str, Any]] = [
    # Income
    {"name": "Activos",           "color": "#10b981", "icon": "TrendingUp",  "transaction_type": "income"},
    {"name": "Pasivos",           "color": "#6366f1", "icon": "PiggyBank",   "transaction_type": "income"},
    # Expense
    {"name": "Casa",              "color": "#8b5cf6", "icon": "Home",        "transaction_type": "expense"},
    {"name": "Servicios Públicos","color": "#f59e0b", "icon": "Zap",         "transaction_type": "expense"},
    {"name": "Carro",             "color": "#64748b", "icon": "Car",         "transaction_type": "expense"},
    {"name": "Diversión",         "color": "#ec4899", "icon": "Music",       "transaction_type": "expense"},
    {"name": "Mercado",           "color": "#ef4444", "icon": "ShoppingCart","transaction_type": "expense"},
    {"name": "Alimentación",      "color": "#f97316", "icon": "Utensils",    "transaction_type": "expense"},
    {"name": "Bebidas",           "color": "#14b8a6", "icon": "Coffee",      "transaction_type": "expense"},
    {"name": "Personales",        "color": "#3b82f6", "icon": "Heart",       "transaction_type": "expense"},
    {"name": "Compras",           "color": "#0ea5e9", "icon": "Gift",        "transaction_type": "expense"},
    {"name": "Pagos Bancarios",   "color": "#6366f1", "icon": "CreditCard",  "transaction_type": "expense"},
    {"name": "Impuesto",          "color": "#78716c", "icon": "Briefcase",   "transaction_type": "expense"},
    {"name": "Transporte",        "color": "#10b981", "icon": "Plane",       "transaction_type": "expense"},
    {"name": "Otros",             "color": "#64748b", "icon": "Book",        "transaction_type": "expense"},
]


async def seed_default_categories(session: AsyncSession, user_id: uuid.UUID) -> None:
    rows = [{"id": uuid.uuid4(), "user_id": user_id, **cat} for cat in DEFAULT_CATEGORIES]
    stmt = pg_insert(Category).values(rows).on_conflict_do_nothing(
        index_elements=["user_id", "name"]
    )
    await session.execute(stmt)
    await session.commit()


async def list_categories(session: AsyncSession, user_id: uuid.UUID) -> list[Category]:
    result = await session.execute(Category.select_by_user(user_id))
    return list(result.scalars().all())


async def get_category(session: AsyncSession, category_id: uuid.UUID, user_id: uuid.UUID) -> Category:
    cat = await session.get(Category, category_id)
    if not cat or cat.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    return cat


async def create_category(session: AsyncSession, user_id: uuid.UUID, data: CategoryCreate) -> Category:
    cat = Category(user_id=user_id, **data.model_dump())
    session.add(cat)
    try:
        await session.commit()
    except Exception:
        await session.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Category name already exists")
    return cat


async def update_category(
    session: AsyncSession, category_id: uuid.UUID, user_id: uuid.UUID, data: CategoryUpdate
) -> Category:
    cat = await get_category(session, category_id, user_id)
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(cat, field, value)
    await session.commit()
    return cat


async def delete_category(session: AsyncSession, category_id: uuid.UUID, user_id: uuid.UUID) -> None:
    cat = await get_category(session, category_id, user_id)
    await session.delete(cat)
    await session.commit()
