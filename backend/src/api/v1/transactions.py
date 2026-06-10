import uuid
from datetime import date

from fastapi import APIRouter, Query, status

from src.api.deps import AsyncSessionDep, CurrentUser
from src.schemas.transaction import TransactionCreate, TransactionListResponse, TransactionOut, TransactionUpdate
from src.services import transaction_service

router = APIRouter(prefix="/transactions", tags=["transactions"])


@router.get("", response_model=TransactionListResponse)
async def list_transactions(
    session: AsyncSessionDep,
    current_user: CurrentUser,
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
    category_id: uuid.UUID | None = Query(default=None),
    transaction_type: str | None = Query(default=None),
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
) -> TransactionListResponse:
    items, total = await transaction_service.list_transactions(
        session,
        current_user.id,
        start_date=start_date,
        end_date=end_date,
        category_id=category_id,
        transaction_type=transaction_type,
        limit=limit,
        offset=offset,
    )
    return TransactionListResponse(items=[TransactionOut.model_validate(t) for t in items], total=total)


@router.post("", response_model=TransactionOut, status_code=status.HTTP_201_CREATED)
async def create_transaction(
    data: TransactionCreate, session: AsyncSessionDep, current_user: CurrentUser
) -> TransactionOut:
    tx = await transaction_service.create_transaction(session, current_user.id, data)
    return TransactionOut.model_validate(tx)


@router.get("/{transaction_id}", response_model=TransactionOut)
async def get_transaction(
    transaction_id: uuid.UUID, session: AsyncSessionDep, current_user: CurrentUser
) -> TransactionOut:
    tx = await transaction_service.get_transaction(session, transaction_id, current_user.id)
    return TransactionOut.model_validate(tx)


@router.put("/{transaction_id}", response_model=TransactionOut)
async def update_transaction(
    transaction_id: uuid.UUID,
    data: TransactionUpdate,
    session: AsyncSessionDep,
    current_user: CurrentUser,
) -> TransactionOut:
    tx = await transaction_service.update_transaction(session, transaction_id, current_user.id, data)
    return TransactionOut.model_validate(tx)


@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_transaction(
    transaction_id: uuid.UUID, session: AsyncSessionDep, current_user: CurrentUser
) -> None:
    await transaction_service.delete_transaction(session, transaction_id, current_user.id)
