import uuid
from datetime import date
from decimal import Decimal

from sqlalchemy import case, func, select, text
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.transaction import Transaction
from src.schemas.analytics import (
    BalanceHistoryPoint,
    CategoryExpensePoint,
    MonthlyComparisonPoint,
    SummaryOut,
)


async def get_summary(
    session: AsyncSession,
    user_id: uuid.UUID,
    start_date: date,
    end_date: date,
) -> SummaryOut:
    stmt = select(
        func.coalesce(
            func.sum(case((Transaction.transaction_type == "income", Transaction.amount), else_=0)),
            Decimal("0"),
        ).label("total_income"),
        func.coalesce(
            func.sum(case((Transaction.transaction_type == "expense", Transaction.amount), else_=0)),
            Decimal("0"),
        ).label("total_expenses"),
        func.count(Transaction.id).label("transaction_count"),
    ).where(
        Transaction.user_id == user_id,
        Transaction.date.between(start_date, end_date),
    )
    row = (await session.execute(stmt)).one()
    return SummaryOut(
        total_income=row.total_income,
        total_expenses=row.total_expenses,
        net_balance=row.total_income - row.total_expenses,
        transaction_count=row.transaction_count,
    )


async def get_balance_history(
    session: AsyncSession,
    user_id: uuid.UUID,
) -> list[BalanceHistoryPoint]:
    stmt = (
        select(
            func.date_trunc("month", Transaction.date).label("month"),
            func.coalesce(
                func.sum(case((Transaction.transaction_type == "income", Transaction.amount), else_=0)),
                0,
            ).label("income"),
            func.coalesce(
                func.sum(case((Transaction.transaction_type == "expense", Transaction.amount), else_=0)),
                0,
            ).label("expenses"),
        )
        .where(Transaction.user_id == user_id)
        .group_by(text("month"))
        .order_by(text("month"))
    )
    rows = (await session.execute(stmt)).all()
    return [
        BalanceHistoryPoint(
            month=row.month.strftime("%b %Y"),
            income=float(row.income),
            expenses=float(row.expenses),
            balance=float(row.income) - float(row.expenses),
        )
        for row in rows
    ]


async def get_expenses_by_category(
    session: AsyncSession,
    user_id: uuid.UUID,
    start_date: date,
    end_date: date,
) -> list[CategoryExpensePoint]:
    from src.models.category import Category

    stmt = (
        select(
            Category.name,
            Category.color,
            func.coalesce(func.sum(Transaction.amount), 0).label("amount"),
        )
        .join(Transaction, Transaction.category_id == Category.id, isouter=True)
        .where(
            Category.user_id == user_id,
            Category.transaction_type == "expense",
            Transaction.date.between(start_date, end_date),
            Transaction.transaction_type == "expense",
        )
        .group_by(Category.id)
        .order_by(text("amount DESC"))
    )
    rows = (await session.execute(stmt)).all()
    return [
        CategoryExpensePoint(name=row.name, amount=float(row.amount), color=row.color)
        for row in rows
    ]


async def get_monthly_comparison(
    session: AsyncSession,
    user_id: uuid.UUID,
) -> list[MonthlyComparisonPoint]:
    stmt = (
        select(
            func.date_trunc("month", Transaction.date).label("month"),
            func.coalesce(
                func.sum(case((Transaction.transaction_type == "income", Transaction.amount), else_=0)),
                0,
            ).label("income"),
            func.coalesce(
                func.sum(case((Transaction.transaction_type == "expense", Transaction.amount), else_=0)),
                0,
            ).label("expenses"),
        )
        .where(Transaction.user_id == user_id)
        .group_by(text("month"))
        .order_by(text("month"))
    )
    rows = (await session.execute(stmt)).all()
    return [
        MonthlyComparisonPoint(
            month=row.month.strftime("%b %Y"),
            income=float(row.income),
            expenses=float(row.expenses),
        )
        for row in rows
    ]
