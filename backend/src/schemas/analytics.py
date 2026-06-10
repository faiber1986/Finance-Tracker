from decimal import Decimal

from pydantic import BaseModel


class SummaryOut(BaseModel):
    total_income: Decimal
    total_expenses: Decimal
    net_balance: Decimal
    transaction_count: int


class BalanceHistoryPoint(BaseModel):
    month: str
    income: float
    expenses: float
    balance: float


class CategoryExpensePoint(BaseModel):
    name: str
    amount: float
    color: str


class MonthlyComparisonPoint(BaseModel):
    month: str
    income: float
    expenses: float
