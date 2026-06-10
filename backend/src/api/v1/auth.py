from fastapi import APIRouter, Depends, HTTPException, Response, status
from fastapi.security import OAuth2PasswordRequestForm

from src.api.deps import AsyncSessionDep, CurrentUser
from src.core.config import settings
from src.core.security import create_access_token
from src.schemas.auth import RegisterRequest, TokenResponse
from src.schemas.user import UserOut
from src.services import user_service

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def register(data: RegisterRequest, session: AsyncSessionDep) -> UserOut:
    user = await user_service.register(session, data)
    return UserOut.model_validate(user)


@router.post("/login", response_model=TokenResponse)
async def login(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: AsyncSessionDep = ...,
) -> TokenResponse:
    user = await user_service.authenticate(session, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    token = create_access_token({"sub": str(user.id)})
    response.set_cookie(
        key="access_token",
        value=f"Bearer {token}",
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite="lax",
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/",
    )
    return TokenResponse(message="Login successful")


@router.post("/logout", response_model=TokenResponse)
async def logout(response: Response) -> TokenResponse:
    response.delete_cookie(key="access_token", path="/")
    return TokenResponse(message="Logged out")


@router.get("/me", response_model=UserOut)
async def me(current_user: CurrentUser) -> UserOut:
    return UserOut.model_validate(current_user)
