import uuid
from datetime import date

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.transaction import Transaction
from src.schemas.transaction import TransactionCreate, TransactionUpdate


async def list_transactions(
    session: AsyncSession,
    user_id: uuid.UUID,
    *,
    start_date: date | None = None,
    end_date: date | None = None,
    category_id: uuid.UUID | None = None,
    transaction_type: str | None = None,
    limit: int = 50,
    offset: int = 0,
) -> tuple[list[Transaction], int]:
    stmt = Transaction.select_by_user_filtered(
        user_id,
        start_date=start_date,
        end_date=end_date,
        category_id=category_id,
        transaction_type=transaction_type,
        limit=limit,
        offset=offset,
    )
    count_stmt = (
        select(func.count(Transaction.id))
        .where(Transaction.user_id == user_id)
    )
    if start_date:
        count_stmt = count_stmt.where(Transaction.date >= start_date)
    if end_date:
        count_stmt = count_stmt.where(Transaction.date <= end_date)
    if category_id:
        count_stmt = count_stmt.where(Transaction.category_id == category_id)
    if transaction_type:
        count_stmt = count_stmt.where(Transaction.transaction_type == transaction_type)

    items_result = await session.execute(stmt)
    count_result = await session.execute(count_stmt)
    return list(items_result.scalars().all()), count_result.scalar_one()


async def get_transaction(session: AsyncSession, tx_id: uuid.UUID, user_id: uuid.UUID) -> Transaction:
    tx = await session.get(Transaction, tx_id)
    if not tx or tx.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")
    return tx


async def create_transaction(session: AsyncSession, user_id: uuid.UUID, data: TransactionCreate) -> Transaction:
    tx = Transaction(user_id=user_id, **data.model_dump())
    session.add(tx)
    await session.commit()
    return tx


async def update_transaction(
    session: AsyncSession, tx_id: uuid.UUID, user_id: uuid.UUID, data: TransactionUpdate
) -> Transaction:
    tx = await get_transaction(session, tx_id, user_id)
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(tx, field, value)
    await session.commit()
    return tx


async def delete_transaction(session: AsyncSession, tx_id: uuid.UUID, user_id: uuid.UUID) -> None:
    tx = await get_transaction(session, tx_id, user_id)
    await session.delete(tx)
    await session.commit()
