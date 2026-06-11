#!/bin/sh

echo "==> Running Alembic migrations..."
alembic upgrade head
if [ $? -ne 0 ]; then
  echo "WARNING: Migrations failed — starting server anyway"
fi

echo "==> Starting server on port ${PORT:-8000}..."
exec uvicorn src.main:app --host 0.0.0.0 --port "${PORT:-8000}"
