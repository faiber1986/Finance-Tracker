#!/bin/sh

echo "==> Running Alembic migrations..."
alembic upgrade head
if [ $? -ne 0 ]; then
  echo "WARNING: Migrations failed — starting server anyway"
fi

PORT="${PORT:-8000}"
echo "==> Starting server on port ${PORT}..."
exec uvicorn src.main:app --host 0.0.0.0 --port "${PORT}"
