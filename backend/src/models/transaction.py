import uuid
from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import Date, DateTime, ForeignKey, Numeric, String, func, select
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql.selectable import Select

from src.core.database import Base


class Transaction(Base):
    __tablename__ = "transactions"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    category_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("categories.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    transaction_type: Mapped[str] = mapped_column(String(10), nullable=False)
    description: Mapped[str | None] = mapped_column(String(500), nullable=True)
    date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    user: Mapped["User"] = relationship(back_populates="transactions")  # type: ignore[name-defined]
    category: Mapped["Category | None"] = relationship(  # type: ignore[name-defined]
        back_populates="transactions", lazy="selectin"
    )

    @classmethod
    def select_by_user_filtered(
        cls,
        user_id: uuid.UUID,
        *,
        start_date: date | None = None,
        end_date: date | None = None,
        category_id: uuid.UUID | None = None,
        transaction_type: str | None = None,
        limit: int = 100,
        offset: int = 0,
    ) -> Select:
        stmt = select(cls).where(cls.user_id == user_id)
        if start_date:
            stmt = stmt.where(cls.date >= start_date)
        if end_date:
            stmt = stmt.where(cls.date <= end_date)
        if category_id:
            stmt = stmt.where(cls.category_id == category_id)
        if transaction_type:
            stmt = stmt.where(cls.transaction_type == transaction_type)
        return stmt.order_by(cls.date.desc()).limit(limit).offset(offset)
