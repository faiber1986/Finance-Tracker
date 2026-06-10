from datetime import date, timedelta

from fastapi import APIRouter, Query

from src.api.deps import AsyncSessionDep, CurrentUser
from src.schemas.analytics import (
    BalanceHistoryPoint,
    CategoryExpensePoint,
    MonthlyComparisonPoint,
    SummaryOut,
)
from src.services import analytics_service

router = APIRouter(prefix="/analytics", tags=["analytics"])


def _default_dates() -> tuple[date, date]:
    today = date.today()
    return date(today.year, today.month, 1), today


@router.get("/summary", response_model=SummaryOut)
async def summary(
    session: AsyncSessionDep,
    current_user: CurrentUser,
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
) -> SummaryOut:
    sd, ed = _default_dates()
    return await analytics_service.get_summary(
        session, current_user.id, start_date or sd, end_date or ed
    )


@router.get("/balance-history", response_model=list[BalanceHistoryPoint])
async def balance_history(session: AsyncSessionDep, current_user: CurrentUser) -> list[BalanceHistoryPoint]:
    return await analytics_service.get_balance_history(session, current_user.id)


@router.get("/expenses-by-category", response_model=list[CategoryExpensePoint])
async def expenses_by_category(
    session: AsyncSessionDep,
    current_user: CurrentUser,
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
) -> list[CategoryExpensePoint]:
    sd, ed = _default_dates()
    return await analytics_service.get_expenses_by_category(
        session, current_user.id, start_date or sd, end_date or ed
    )


@router.get("/income-vs-expenses", response_model=list[MonthlyComparisonPoint])
async def income_vs_expenses(
    session: AsyncSessionDep, current_user: CurrentUser
) -> list[MonthlyComparisonPoint]:
    return await analytics_service.get_monthly_comparison(session, current_user.id)
