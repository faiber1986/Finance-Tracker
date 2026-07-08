# 💰 Finance Tracker

> 🇪🇸 ¿Prefieres leer esto en español? Consulta el **[README en Español](README.es.md)**.

A full-stack personal finance application for tracking income and expenses by category, featuring an interactive analytics dashboard, JWT authentication with HttpOnly cookies, and a fully dockerized development environment.

**Frontend:** Next.js 14 (App Router) · React 18 · Tailwind CSS · Tremor · Shadcn UI
**Backend:** Python 3.12 · FastAPI · SQLAlchemy 2.0 (async) · Alembic · Pydantic v2
**Database:** PostgreSQL 16 · **Infrastructure:** Docker Compose

---

## 📸 Screenshots

### Dashboard — Financial Overview
Interactive KPI cards (income, expenses, net balance, transaction count), historical balance area chart, and expenses-by-category bar chart built with Tremor.

![Dashboard](docs/screenshots/dashboard.png)

### Transactions
Full transaction management with date range, type, and category filters, plus inline edit and delete actions.

![Transactions](docs/screenshots/transactions.png)

### New Transaction
Create income or expense entries with amount, date, category, and optional notes through a validated modal form (React Hook Form + Zod).

![New Transaction](docs/screenshots/new-transaction.png)

### Categories
Organize your finances with custom income and expense categories, including one-click seeding of sensible defaults.

![Categories](docs/screenshots/categories.png)

---

## ✨ Features

- **Interactive analytics dashboard** — monthly KPIs, historical balance (AreaChart), expenses by category (BarChart), and recent activity.
- **Transaction management** — create, edit, delete, and filter transactions by date range, type (income/expense), and category.
- **Custom categories** — per-user income and expense categories with a default seeding endpoint.
- **Secure authentication** — OAuth2 password flow with JWTs stored strictly in `HttpOnly` cookies (never `localStorage`), protecting against XSS.
- **Dark / light mode** — theme toggle powered by `next-themes`.
- **Strict typing end to end** — Pydantic v2 schemas on the backend, TypeScript + Zod validation on the frontend.
- **Hot reload everywhere** — source folders are volume-mounted into the containers for instant feedback.

## 🏗️ Architecture

```
┌─────────────────┐       ┌──────────────────┐       ┌────────────────┐
│   Next.js 14     │ HTTP  │    FastAPI       │ async │  PostgreSQL 16 │
│   (App Router)   │ ────▶ │  (SQLAlchemy 2)  │ ────▶ │                │
│   Server Comps   │ :8000 │   Pydantic v2    │ :5432 │                │
└─────────────────┘       └──────────────────┘       └────────────────┘
      :3000                      Alembic migrations
```

- **Frontend** follows a **feature-driven structure**: routing lives in `src/app/`, while domain logic, components, and hooks live in `src/features/<domain>/` exported via barrel files. Data is fetched in **Server Components** and passed serialized to Tremor client components.
- **Backend** uses a modular, domain-driven `src/` layout: `api/` (routers), `core/` (config, security, database), `models/` (SQLAlchemy), `schemas/` (Pydantic), and `services/` (business logic and transaction coordination).

### Project structure

```
.
├── backend/
│   ├── alembic/                 # Database migrations
│   └── src/
│       ├── api/v1/              # Routers: auth, categories, transactions, analytics
│       ├── core/                # Settings, database engine, security (JWT)
│       ├── models/              # SQLAlchemy declarative models
│       ├── schemas/             # Pydantic v2 schemas
│       └── services/            # Business logic layer
├── frontend/
│   └── src/
│       ├── app/                 # Next.js App Router (routing only)
│       │   ├── (auth)/          # /login, /register
│       │   └── (dashboard)/     # /, /transactions, /categories
│       ├── components/ui/       # Shadcn UI primitives
│       ├── features/            # auth, dashboard, transactions, categories
│       └── lib/                 # API client, utilities
└── docker-compose.yml
```

## 🚀 Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/faiber1986/Finance-Tracker.git
   cd Finance-Tracker
   ```

2. **Configure environment variables**

   ```bash
   cp .env.example .env
   # Edit .env and set your own POSTGRES_PASSWORD and SECRET_KEY
   ```

3. **Build and start the stack**

   ```bash
   docker compose up --build
   ```

4. **Apply database migrations**

   ```bash
   docker compose exec backend alembic upgrade head
   ```

5. Open the app:

   | Service           | URL                            |
   | ----------------- | ------------------------------ |
   | Frontend          | http://localhost:3000          |
   | API               | http://localhost:8000          |
   | API Docs (Swagger)| http://localhost:8000/docs     |

   Register an account at http://localhost:3000/register and start tracking!

### Useful commands

```bash
# Run backend tests
docker compose exec backend pytest -v

# Generate a new migration
docker compose exec backend alembic revision --autogenerate -m "description"

# Apply migrations
docker compose exec backend alembic upgrade head
```

## 🔌 API Overview

All endpoints are prefixed with `/api/v1`. Authenticated routes read the JWT from the `HttpOnly` cookie.

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `POST` | `/auth/register` | Create a new account |
| `POST` | `/auth/login` | Log in (sets HttpOnly cookie) |
| `POST` | `/auth/logout` | Log out (clears cookie) |
| `GET`  | `/auth/me` | Current user profile |
| `GET/POST` | `/categories` | List / create categories |
| `GET/PUT/DELETE` | `/categories/{id}` | Retrieve / update / delete a category |
| `POST` | `/categories/seed-defaults` | Seed default categories |
| `GET/POST` | `/transactions` | List (with filters & pagination) / create |
| `GET/PUT/DELETE` | `/transactions/{id}` | Retrieve / update / delete a transaction |
| `GET`  | `/analytics/summary` | Income, expenses, net balance & count |
| `GET`  | `/analytics/balance-history` | Historical balance series |
| `GET`  | `/analytics/expenses-by-category` | Expense totals per category |
| `GET`  | `/analytics/income-vs-expenses` | Monthly income vs. expense comparison |

Interactive documentation is available at **http://localhost:8000/docs** (Swagger UI).

## 🔐 Security Notes

- JWTs are issued via an OAuth2 password flow and stored **only** in `HttpOnly`, `Secure` cookies — never in `localStorage`.
- Passwords are hashed with **bcrypt** (`passlib`).
- CORS is restricted to the configured frontend origin.

## 📄 License

This project is for personal / educational use.
