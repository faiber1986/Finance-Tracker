from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.security import hash_password, verify_password
from src.models.user import User
from src.schemas.auth import RegisterRequest
from src.services.category_service import seed_default_categories


async def register(session: AsyncSession, data: RegisterRequest) -> User:
    result = await session.execute(User.select_by_email(data.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    user = User(
        email=data.email,
        hashed_password=hash_password(data.password),
        full_name=data.full_name,
    )
    session.add(user)
    await session.commit()
    await seed_default_categories(session, user.id)
    return user


async def authenticate(session: AsyncSession, email: str, password: str) -> User | None:
    result = await session.execute(User.select_by_email(email))
    user = result.scalar_one_or_none()
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user
