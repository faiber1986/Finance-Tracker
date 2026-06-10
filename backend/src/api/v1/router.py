from fastapi import APIRouter

from src.api.v1 import auth, categories, transactions, analytics

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(categories.router)
api_router.include_router(transactions.router)
api_router.include_router(analytics.router)
