FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

COPY backend/alembic.ini .
COPY backend/alembic/ ./alembic/
COPY backend/src/ ./src/
COPY backend/start.sh .
RUN chmod +x start.sh && sed -i 's/\r//' start.sh

EXPOSE 8000

CMD ["./start.sh"]
