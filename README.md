# Fièrté

*No excuses. No participation trophies. Only output.*

Fièrté is a brutalist, ego-driven habit tracker inspired by Blue Lock. It doesn't coddle. It doesn't decorate. It is cold, precise, and demanding.

## Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, React Query
- **Backend:** FastAPI, Python 3.11, SQLAlchemy 2.0 (Async), Alembic, APScheduler
- **AI:** LangChain + Gemini 1.5 Flash
- **Database:** Supabase (PostgreSQL)
- **Cache:** Upstash (Redis)
- **Email:** Resend

## Local Development

### Prerequisites

- Docker and Docker Compose
- Gemini API Key
- Resend API Key

### Setup

1. Clone the repository.
2. Create `backend/.env` from `backend/.env.example` and fill in the values.
3. Create `frontend/.env.local` from `frontend/.env.local.example` and fill in the values.
4. Run with Docker Compose:
   ```bash
   docker-compose up --build
   ```
5. Run migrations:
   ```bash
   docker-compose exec backend alembic upgrade head
   ```

## Deployment

### Backend (Render)

1. Create a new **Web Service** on Render.
2. Connect your GitHub repository.
3. Set **Root Directory** to `backend`.
4. Set **Runtime** to `Python 3`.
5. **Build Command:** `pip install -r requirements.txt`
6. **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
7. Add all environment variables from `backend/.env.example`.

### Frontend (Vercel)

1. Create a new project on Vercel.
2. Connect your GitHub repository.
3. Set **Root Directory** to `frontend`.
4. **Framework Preset:** Next.js.
5. Add all environment variables from `frontend/.env.local.example`:
   - `NEXT_PUBLIC_API_URL`: Your Render backend URL.
   - `NEXT_PUBLIC_WS_URL`: Your Render backend WebSocket URL (`wss://...`).
   - `NEXTAUTH_URL`: Your Vercel frontend URL.
   - `NEXTAUTH_SECRET`: A long random string.

### Database Migrations (Production)

Once the backend is live on Render and connected to your production Supabase instance:

```bash
cd backend
# Set DATABASE_URL to your production Supabase URL in your local .env
alembic upgrade head
```

## Architecture

- **Heatmap:** Cache-aside pattern with Redis.
- **Nightly Worker:** Runs at 23:59 UTC to evaluate user performance and send roast/praise emails.
- **Progressive Overload:** Automatically increases habit targets after 7 consecutive PERFECT days.
- **WebSocket:** AI negotiation during onboarding to seal your habit contract.
