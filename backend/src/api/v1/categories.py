import uuid

from fastapi import APIRouter, status

from src.api.deps import AsyncSessionDep, CurrentUser
from src.schemas.category import CategoryCreate, CategoryOut, CategoryUpdate
from src.services import category_service

router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("", response_model=list[CategoryOut])
async def list_categories(session: AsyncSessionDep, current_user: CurrentUser) -> list[CategoryOut]:
    cats = await category_service.list_categories(session, current_user.id)
    return [CategoryOut.model_validate(c) for c in cats]


@router.post("", response_model=CategoryOut, status_code=status.HTTP_201_CREATED)
async def create_category(
    data: CategoryCreate, session: AsyncSessionDep, current_user: CurrentUser
) -> CategoryOut:
    cat = await category_service.create_category(session, current_user.id, data)
    return CategoryOut.model_validate(cat)


@router.get("/{category_id}", response_model=CategoryOut)
async def get_category(
    category_id: uuid.UUID, session: AsyncSessionDep, current_user: CurrentUser
) -> CategoryOut:
    cat = await category_service.get_category(session, category_id, current_user.id)
    return CategoryOut.model_validate(cat)


@router.put("/{category_id}", response_model=CategoryOut)
async def update_category(
    category_id: uuid.UUID,
    data: CategoryUpdate,
    session: AsyncSessionDep,
    current_user: CurrentUser,
) -> CategoryOut:
    cat = await category_service.update_category(session, category_id, current_user.id, data)
    return CategoryOut.model_validate(cat)


@router.post("/seed-defaults", status_code=status.HTTP_204_NO_CONTENT)
async def seed_default_categories(session: AsyncSessionDep, current_user: CurrentUser) -> None:
    await category_service.seed_default_categories(session, current_user.id)


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(
    category_id: uuid.UUID, session: AsyncSessionDep, current_user: CurrentUser
) -> None:
    await category_service.delete_category(session, category_id, current_user.id)
