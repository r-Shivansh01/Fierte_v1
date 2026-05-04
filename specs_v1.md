# SPECS_OG.md — Fièrté: The Ego-Driven Habit Tracker

> **Directive for Gemini CLI:** This document is a complete, unambiguous specification. Build every file, every function, and every UI component exactly as described. Do not scaffold. Do not use placeholder comments. Every piece of code must be production-ready, functional, and deployable. If a decision is not explicitly stated, default to the simplest implementation that satisfies the described behavior.

---

## 0. Project Identity

| Key | Value |
|---|---|
| **Name** | Fièrté |
| **Tagline** | *No excuses. No participation trophies. Only output.* |
| **Inspiration** | Blue Lock — ruthless, ego-first performance philosophy |
| **Core Idea** | An AI habit tracker that acts as a demanding coach. It negotiates your habits, tracks them with cold precision, and destroys you when you fail. It rewards consistency not with badges, but with progressive overload. |
| **Aesthetic** | Brutalist. Deep blacks. Stark whites. Neon red accents. Typography-driven. Data-dense. No decoration. |

---

## 1. Tech Stack

### Frontend
| Tool | Version | Purpose |
|---|---|---|
| Next.js | 14+ (App Router) | Full-stack React framework |
| TypeScript | 5+ | Type safety |
| Tailwind CSS | 3+ | Utility-first styling |
| Framer Motion | latest | Micro-animations and page transitions |
| Recharts | latest | Heatmap and data visualizations |
| ShadCN/UI | latest | Headless accessible component primitives (unstyled, overridden fully) |
| Zustand | latest | Client-side state management |
| React Query (TanStack) | latest | Server state, caching, background refetching |
| next-auth | latest | Authentication (GitHub OAuth + Email/Password) |

### Backend
| Tool | Version | Purpose |
|---|---|---|
| Python | 3.11+ | Runtime |
| FastAPI | latest | REST API + WebSocket server |
| SQLAlchemy | 2.0+ (async) | ORM with async support |
| Alembic | latest | Database migrations |
| Pydantic | v2 | Request/response validation |
| APScheduler | latest | Nightly cron job (11:59 PM) |
| LangChain | latest | AI agent orchestration |
| google-generativeai | latest | Gemini API client (primary LLM) |
| redis | latest (redis-py with asyncio) | Caching layer |
| python-jose | latest | JWT token handling |
| passlib[bcrypt] | latest | Password hashing |
| python-dotenv | latest | Environment management |
| httpx | latest | Async HTTP client |
| resend | latest | Transactional email delivery (nightly evaluations) |

### Infrastructure & Services
| Service | Purpose | Free Tier |
|---|---|---|
| Supabase | Managed PostgreSQL | 500MB DB, unlimited API calls |
| Upstash | Serverless Redis | 10,000 commands/day |
| Vercel | Next.js frontend hosting | Free hobby plan |
| Render | FastAPI backend hosting | 750 hours/month |
| GitHub Actions | CI/CD pipeline | 2,000 minutes/month |
| Resend | Transactional email | 3,000 emails/month, 100/day free |

---

## 2. Repository Structure

```
fierté/
├── frontend/                        # Next.js App
│   ├── app/
│   │   ├── layout.tsx               # Root layout, fonts, global providers
│   │   ├── page.tsx                 # Landing / redirect logic
│   │   ├── globals.css              # Tailwind base + CSS variables
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx         # Login page
│   │   │   └── register/
│   │   │       └── page.tsx         # Register page
│   │   ├── onboarding/
│   │   │   └── page.tsx             # Blank Slate — AI Negotiation page
│   │   └── dashboard/
│   │       ├── page.tsx             # Arena Dashboard
│   │       ├── locker-room/
│   │       │   └── page.tsx         # AI Evaluation History page
│   │       └── settings/
│   │           └── page.tsx         # User settings / contract management
│   ├── components/
│   │   ├── ui/                      # Base ShadCN primitives (re-exported)
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   ├── onboarding/
│   │   │   ├── GoalInput.tsx        # Single brutalist text input
│   │   │   ├── HabitNegotiation.tsx # Shows AI-returned habits for review
│   │   │   └── ContractSeal.tsx     # Final confirmation animation
│   │   ├── dashboard/
│   │   │   ├── HabitCard.tsx        # Individual habit + heatmap
│   │   │   ├── HeatmapGrid.tsx      # 365-day GitHub-style heatmap
│   │   │   ├── StreakCounter.tsx    # Current streak display
│   │   │   ├── LogHabitButton.tsx   # Mark today's habit as done
│   │   │   ├── PerformanceStats.tsx # Completion rate, all-time, weekly
│   │   │   └── DifficultyBadge.tsx  # Shows current progressive level
│   │   └── locker-room/
│   │       ├── EvaluationCard.tsx   # Single night's AI verdict card
│   │       └── RoastDisplay.tsx     # Harsh critique display component
│   ├── lib/
│   │   ├── api.ts                   # Axios/fetch wrapper with auth headers
│   │   ├── auth.ts                  # next-auth config
│   │   ├── hooks/
│   │   │   ├── useHabits.ts         # React Query hooks for habit data
│   │   │   ├── useHeatmap.ts        # Heatmap data hook
│   │   │   └── useEvaluations.ts    # Locker room data hook
│   │   ├── store/
│   │   │   └── onboardingStore.ts   # Zustand store for negotiation state
│   │   └── types.ts                 # Shared TypeScript types/interfaces
│   ├── public/
│   │   └── fonts/                   # Self-hosted fonts
│   ├── .env.local.example
│   ├── next.config.js
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── backend/                         # FastAPI App
│   ├── app/
│   │   ├── main.py                  # App entry point, router registration, lifespan
│   │   ├── config.py                # Settings via pydantic-settings
│   │   ├── database.py              # Async SQLAlchemy engine + session factory
│   │   ├── redis_client.py          # Upstash Redis async client setup
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── user.py              # User SQLAlchemy model
│   │   │   ├── habit.py             # Habit model (linked to user)
│   │   │   ├── habit_log.py         # Daily log model (date + completion)
│   │   │   └── evaluation.py        # Nightly AI evaluation result model
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── user.py              # UserCreate, UserRead, UserUpdate
│   │   │   ├── habit.py             # HabitCreate, HabitRead, HabitUpdate
│   │   │   ├── habit_log.py         # HabitLogCreate, HabitLogRead
│   │   │   └── evaluation.py        # EvaluationRead
│   │   ├── routers/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py              # /auth/register, /auth/login, /auth/me
│   │   │   ├── habits.py            # CRUD for habits + logging
│   │   │   ├── heatmap.py           # Heatmap data endpoint (cached)
│   │   │   ├── evaluations.py       # Locker room history endpoint
│   │   │   └── ws.py                # WebSocket: AI negotiation endpoint
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── auth_service.py      # JWT creation, verification, password logic
│   │   │   ├── habit_service.py     # Business logic for habits + streaks
│   │   │   ├── cache_service.py     # Redis get/set/invalidate wrappers
│   │   │   ├── ai_service.py        # LangChain agent: negotiation + evaluation
│   │   │   └── email_service.py     # Resend email client: nightly evaluation emails
│   │   ├── workers/
│   │   │   ├── __init__.py
│   │   │   └── nightly_worker.py    # APScheduler job: runs at 23:59 daily
│   │   └── dependencies.py          # FastAPI dependency injection (get_db, get_current_user)
│   ├── alembic/
│   │   ├── env.py
│   │   └── versions/                # Migration files auto-generated
│   ├── alembic.ini
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
├── .github/
│   └── workflows/
│       ├── frontend-deploy.yml      # Vercel deployment on push to main
│       └── backend-deploy.yml       # Render deployment on push to main
│
├── docker-compose.yml               # Local dev orchestration
└── README.md
```

---

## 3. Environment Variables

### `/frontend/.env.local.example`
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here
```

### `/backend/.env.example`
```env
# Database
DATABASE_URL=postgresql+asyncpg://user:password@host:port/dbname

# Redis (Upstash)
REDIS_URL=rediss://default:password@your-upstash-endpoint:6380

# Auth
SECRET_KEY=your-super-secret-jwt-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# AI
GEMINI_API_KEY=your-gemini-api-key-here

# Email (Resend)
RESEND_API_KEY=re_your-resend-api-key-here
EMAIL_FROM=Fièrté <noreply@yourdomain.com>

# App
ENVIRONMENT=development
FRONTEND_URL=http://localhost:3000
```

---

## 4. Database Schema

### Table: `users`
```sql
id                UUID PRIMARY KEY DEFAULT gen_random_uuid()
email             VARCHAR(255) UNIQUE NOT NULL
username          VARCHAR(50) UNIQUE NOT NULL
hashed_password   VARCHAR(255) NOT NULL
goal_statement    TEXT                          -- Raw original goal from onboarding
is_onboarded      BOOLEAN DEFAULT FALSE
created_at        TIMESTAMPTZ DEFAULT NOW()
updated_at        TIMESTAMPTZ DEFAULT NOW()
```

### Table: `habits`
```sql
id                    UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id               UUID REFERENCES users(id) ON DELETE CASCADE
name                  VARCHAR(255) NOT NULL           -- e.g., "50 strict pull-ups daily"
description           TEXT
target_value          FLOAT NOT NULL                  -- e.g., 50
target_unit           VARCHAR(50) NOT NULL            -- e.g., "reps", "minutes", "pages"
current_level         INTEGER DEFAULT 1              -- Progressive overload level
difficulty_multiplier FLOAT DEFAULT 1.0              -- Multiplied when AI overloads
is_active             BOOLEAN DEFAULT TRUE
created_at            TIMESTAMPTZ DEFAULT NOW()
updated_at            TIMESTAMPTZ DEFAULT NOW()
```

### Table: `habit_logs`
```sql
id            UUID PRIMARY KEY DEFAULT gen_random_uuid()
habit_id      UUID REFERENCES habits(id) ON DELETE CASCADE
user_id       UUID REFERENCES users(id) ON DELETE CASCADE
log_date      DATE NOT NULL
completed     BOOLEAN DEFAULT FALSE
logged_value  FLOAT                           -- Actual value user logged
notes         TEXT
created_at    TIMESTAMPTZ DEFAULT NOW()
UNIQUE(habit_id, log_date)
```

### Table: `evaluations`
```sql
id                UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id           UUID REFERENCES users(id) ON DELETE CASCADE
evaluation_date   DATE NOT NULL
overall_verdict   VARCHAR(20) NOT NULL          -- "PASS" | "FAIL" | "PERFECT"
completion_rate   FLOAT NOT NULL               -- 0.0 to 1.0
ai_message        TEXT NOT NULL                -- The roast or praise from AI
habits_overloaded JSONB                        -- List of habit IDs that got overloaded
created_at        TIMESTAMPTZ DEFAULT NOW()
```

---

## 5. API Specification

### Auth Routes — `/auth`

#### `POST /auth/register`
- **Body:** `{ email, username, password }`
- **Response:** `{ access_token, token_type: "bearer", user: UserRead }`
- **Logic:** Hash password with bcrypt. Create user. Generate JWT. Return token.

#### `POST /auth/login`
- **Body:** `{ email, password }`
- **Response:** `{ access_token, token_type: "bearer", user: UserRead }`
- **Logic:** Verify email + password. If mismatch → 401. Generate JWT.

#### `GET /auth/me`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `UserRead`
- **Logic:** Decode JWT. Fetch user from DB. Return.

---

### Habits Routes — `/habits`
All routes require `Authorization: Bearer <token>`.

#### `GET /habits`
- **Response:** `List[HabitRead]`
- **Logic:** Return all active habits for current user.

#### `POST /habits`
- **Body:** `{ name, description, target_value, target_unit }`
- **Response:** `HabitRead`
- **Logic:** Create habit linked to current user.

#### `PUT /habits/{habit_id}`
- **Body:** `{ name?, description?, target_value?, target_unit? }`
- **Response:** `HabitRead`
- **Logic:** Update habit. Invalidate Redis cache for this user's heatmap.

#### `DELETE /habits/{habit_id}`
- **Response:** `{ message: "Habit deleted" }`
- **Logic:** Soft delete (set `is_active = false`). Invalidate cache.

#### `POST /habits/{habit_id}/log`
- **Body:** `{ logged_value, notes? }`
- **Response:** `HabitLogRead`
- **Logic:**
  1. Check if a log already exists for today for this habit. If yes, update it. If no, create it.
  2. `completed = True` if `logged_value >= habit.target_value * habit.difficulty_multiplier`
  3. Invalidate Redis keys `heatmap:{user_id}:{habit_id}` and `streak:{user_id}:{habit_id}`.
  4. Return created/updated log.

---

### Heatmap Route — `/heatmap`
Requires auth.

#### `GET /heatmap/{habit_id}`
- **Query Params:** `year` (default: current year)
- **Response:**
  ```json
  {
    "habit_id": "uuid",
    "year": 2025,
    "data": [
      { "date": "2025-01-01", "completed": true, "value": 55 },
      ...
    ],
    "current_streak": 12,
    "longest_streak": 34,
    "completion_rate": 0.87
  }
  ```
- **Logic:**
  1. Check Redis key `heatmap:{user_id}:{habit_id}:{year}`. If HIT → return immediately.
  2. If MISS → query DB for all `habit_logs` for this habit in this year.
  3. Compute `current_streak` and `longest_streak` in Python.
  4. Store full response JSON in Redis with TTL of 3600 seconds (1 hour).
  5. Return response.

---

### Evaluations Route — `/evaluations`
Requires auth.

#### `GET /evaluations`
- **Query Params:** `limit` (default: 30), `offset` (default: 0)
- **Response:** `List[EvaluationRead]`
- **Logic:** Return paginated evaluations for current user, ordered by date descending.

#### `GET /evaluations/latest`
- **Response:** `EvaluationRead | null`
- **Logic:** Return the most recent evaluation for current user.

---

### WebSocket — `/ws/negotiate`

#### `WS /ws/negotiate?token=<jwt>`
- **Protocol:** JSON messages over WebSocket
- **Authentication:** Token passed as query param. Validate on connect. Reject with code 4001 if invalid.
- **Flow:**

**Step 1 — Client sends goal:**
```json
{ "type": "goal", "content": "I want to get shredded using bodyweight and ship more code" }
```

**Step 2 — Server streams AI response:**
```json
{ "type": "thinking", "content": "Analyzing your goals..." }
```
Then:
```json
{
  "type": "habits_proposal",
  "content": [
    {
      "name": "50 Strict Pull-Ups",
      "description": "Dead hang, full extension. No kipping.",
      "target_value": 50,
      "target_unit": "reps"
    },
    {
      "name": "2 Hours Deep Work",
      "description": "No social media. No phone. Timer running.",
      "target_value": 120,
      "target_unit": "minutes"
    }
  ]
}
```

**Step 3 — Client accepts or modifies:**
```json
{ "type": "accept", "habits": [...] }
```
OR
```json
{ "type": "modify", "habits": [...] }
```

**Step 4 — Server confirms contract:**
1. Save habits to DB.
2. Set `user.is_onboarded = True`.
3. Send:
```json
{ "type": "contract_sealed", "habits": [...] }
```

**Error handling:** Any exception → send `{ "type": "error", "content": "..." }` and close connection.

---

## 6. AI Service Specification (`backend/app/services/ai_service.py`)

### Function: `negotiate_habits(goal: str) -> List[dict]`
- **Model:** Gemini 1.5 Flash via LangChain's `ChatGoogleGenerativeAI`
- **System Prompt:**
```
You are Fièrté, a ruthless AI performance coach.
You do not coddle. You do not motivate with kindness.
You analyze goals and convert them into the minimum viable set of daily habits — measurable, trackable, brutal.
Rules:
- Return ONLY a valid JSON array. No markdown. No explanation. No preamble.
- Return 3 to 4 habits maximum.
- Each habit must have: name (string), description (string), target_value (number), target_unit (string)
- Units must be one of: reps, minutes, pages, km, hours, pushups, sessions
- Habits must be completable daily. No weekly targets.
- Be specific. "Exercise" is not a habit. "50 pull-ups" is.
```
- **User message format:** `"Goal: {goal}"`
- **Parse response** as JSON. If parsing fails → retry once with explicit JSON reminder. If second failure → raise `ValueError("AI returned invalid habit format")`.

### Function: `evaluate_user(user_id: str, db: AsyncSession) -> EvaluationResult`
- **Called by:** Nightly worker at 23:59
- **Logic:**
  1. Fetch all active habits for user.
  2. Fetch all `habit_logs` for today.
  3. Calculate `completion_rate = completed_habits / total_habits`.
  4. Determine `verdict`:
     - `completion_rate == 1.0` → `"PERFECT"`
     - `completion_rate >= 0.5` → `"PASS"`
     - `completion_rate < 0.5` → `"FAIL"`
  5. Call Gemini with context, get AI message.
  6. If `verdict == "PERFECT"` for 7 consecutive days → trigger `progressive_overload(habit)`.
  7. Save `Evaluation` record to DB.
  8. Invalidate Redis key `evaluations:{user_id}`.
  9. Return the saved `EvaluationResult` object (used by the nightly worker to send email).

- **Evaluation Prompt (FAIL):**
```
You are Fièrté. A user has failed their habit contract today.
User's habits: {habit_summary}
Completion rate: {rate}%
Habits failed: {failed_habits}

Write a harsh, personalized 2-3 sentence critique.
Do not use profanity. Be cold, precise, and contemptuous.
Address the user directly as "you". No emojis. No fluff.
```

- **Evaluation Prompt (PASS):**
```
You are Fièrté. A user has partially completed their habit contract.
Completion rate: {rate}%
Write a brief 1-2 sentence cold acknowledgment. Do not praise. Just note what was done and what was not.
```

- **Evaluation Prompt (PERFECT):**
```
You are Fièrté. A user has achieved 100% completion today.
This is day {streak} of a perfect streak.
Write a 1-2 sentence cold, reluctant acknowledgment.
Do not be warm. Do not celebrate. Simply note it like a general noting a soldier met the minimum standard.
```

### Function: `progressive_overload(habit: Habit, db: AsyncSession)`
- **Logic:**
  1. `new_multiplier = habit.difficulty_multiplier * 1.10` (10% increase)
  2. `habit.difficulty_multiplier = round(new_multiplier, 2)`
  3. `habit.current_level += 1`
  4. Commit to DB.

---

## 7. Nightly Worker Specification (`backend/app/workers/nightly_worker.py`)

```
Uses APScheduler with AsyncIOScheduler.
Schedule: cron trigger at hour=23, minute=59, timezone='UTC'.
On trigger:
  1. Open async DB session.
  2. Fetch all users where is_onboarded = True.
  3. For each user:
       a. Call ai_service.evaluate_user(user.id, db) → get EvaluationResult.
       b. Call email_service.send_evaluation_email(user, evaluation_result).
       c. Log success/failure per user with Python logging.
  4. Close session cleanly.
```

The scheduler must be started inside the FastAPI `lifespan` async context manager in `main.py`. It must shut down cleanly on app shutdown via `scheduler.shutdown()`.

**Error isolation:** Each user's evaluation + email is wrapped in an individual `try/except`. A failure for one user must never abort processing for remaining users. Log the exception with `logging.error(f"Failed for user {user.id}: {e}")` and continue.

---

## 8. Email Service Specification (`backend/app/services/email_service.py`)

### Setup
- Import `resend` and initialise with `resend.api_key = settings.RESEND_API_KEY` at module load time.
- `EMAIL_FROM` is read from `settings.EMAIL_FROM` (e.g., `Fièrté <noreply@yourdomain.com>`).

### Function: `async def send_evaluation_email(user: User, evaluation: EvaluationResult) -> None`

- **Purpose:** Send the nightly AI evaluation to the user's registered email address.
- **Logic:**
  1. Build `subject` string based on verdict:
     - `"PERFECT"` → `"Fièrté — You met the standard. Barely."`
     - `"PASS"` → `"Fièrté — Acceptable. Don't make a habit of acceptable."`
     - `"FAIL"` → `"Fièrté — You failed today. Here's the record."`
  2. Build `html` body using the template below.
  3. Call `resend.Emails.send(...)` synchronously inside `asyncio.to_thread(...)` to avoid blocking the event loop.
  4. On success → log `f"Email sent to {user.email} — verdict: {evaluation.overall_verdict}"`.
  5. On `resend.exceptions.ResendError` → log the error and re-raise so the caller (nightly worker) can catch it per-user.

- **Do not use `await` directly on `resend.Emails.send`** — the Resend Python SDK is synchronous. Wrap it:
  ```python
  await asyncio.to_thread(
      resend.Emails.send,
      {
          "from": settings.EMAIL_FROM,
          "to": [user.email],
          "subject": subject,
          "html": html_body,
      }
  )
  ```

### Email HTML Template

The email must be a self-contained HTML string. No external CSS files. Inline styles only. Use the following structure exactly:

```html
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:'Courier New',monospace;color:#f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:40px auto;">
    <tr>
      <td style="padding:32px;border:1px solid #222222;background-color:#111111;">

        <!-- Header -->
        <p style="margin:0 0 4px 0;font-size:11px;color:#888888;letter-spacing:4px;text-transform:uppercase;">
          FIÈRTÉ — NIGHTLY REPORT
        </p>
        <p style="margin:0 0 32px 0;font-size:11px;color:#444444;">
          {evaluation_date}
        </p>

        <!-- Verdict Badge -->
        <div style="display:inline-block;padding:6px 16px;margin-bottom:24px;
          background-color:{verdict_bg};color:#ffffff;
          font-size:12px;letter-spacing:3px;font-weight:700;">
          {overall_verdict}
        </div>

        <!-- Completion Rate -->
        <p style="margin:0 0 8px 0;font-size:11px;color:#888888;letter-spacing:2px;">
          COMPLETION RATE
        </p>
        <p style="margin:0 0 24px 0;font-size:36px;font-weight:700;color:{rate_color};">
          {completion_rate_pct}%
        </p>

        <!-- AI Message -->
        <p style="margin:0 0 32px 0;font-size:14px;line-height:1.7;color:{message_color};
          border-left:2px solid {verdict_accent};padding-left:16px;">
          {ai_message}
        </p>

        <!-- CTA -->
        <a href="{frontend_url}/dashboard"
          style="display:inline-block;padding:12px 28px;background-color:#ff2020;
          color:#ffffff;text-decoration:none;font-size:11px;letter-spacing:3px;
          text-transform:uppercase;font-weight:700;">
          OPEN DASHBOARD →
        </a>

        <!-- Footer -->
        <p style="margin:32px 0 0 0;font-size:10px;color:#444444;border-top:1px solid #222222;padding-top:16px;">
          You registered with this email. No excuses. No unsubscribes.
        </p>

      </td>
    </tr>
  </table>
</body>
</html>
```

**Template variable mapping (Python f-string or `.format()`):**

| Template Variable | Value |
|---|---|
| `{evaluation_date}` | `evaluation.evaluation_date.strftime("%A, %d %B %Y")` |
| `{overall_verdict}` | `evaluation.overall_verdict` |
| `{verdict_bg}` | `#22c55e` if PERFECT, `#222222` if PASS, `#ff2020` if FAIL |
| `{verdict_accent}` | `#22c55e` if PERFECT, `#888888` if PASS, `#ff2020` if FAIL |
| `{completion_rate_pct}` | `round(evaluation.completion_rate * 100)` |
| `{rate_color}` | `#22c55e` if PERFECT, `#f5f5f5` if PASS, `#ff2020` if FAIL |
| `{ai_message}` | `evaluation.ai_message` |
| `{message_color}` | `#cc2222` if FAIL, `#22c55e` if PERFECT, `#888888` if PASS |
| `{frontend_url}` | `settings.FRONTEND_URL` |

---

## 9. Frontend Pages & Components

### Design System (implement in `globals.css` and `tailwind.config.ts`)

**Color Palette (CSS Variables):**
```css
:root {
  --bg-primary: #0a0a0a;
  --bg-secondary: #111111;
  --bg-card: #161616;
  --border: #222222;
  --text-primary: #f5f5f5;
  --text-secondary: #888888;
  --text-muted: #444444;
  --accent-red: #ff2020;
  --accent-red-dim: #661010;
  --accent-white: #ffffff;
  --success: #22c55e;
  --warning: #f59e0b;
}
```

**Typography:**
- Display font: `Space Grotesk` (Google Fonts) — headings, numbers, large labels
- Body font: `JetBrains Mono` (Google Fonts) — all body text, inputs, data readouts
- Import both in `app/layout.tsx` via `next/font/google`

**Tailwind Config Extensions:**
- Extend `colors` to map all CSS variables (e.g., `bgPrimary: 'var(--bg-primary)'`)
- Extend `fontFamily`: `{ display: ["Space Grotesk", "sans-serif"], mono: ["JetBrains Mono", "monospace"] }`

---

### Page: Landing (`app/page.tsx`)

**Redirect Logic:**
- On mount, call `GET /auth/me` with the stored token from `localStorage`.
- If the call succeeds and `user.is_onboarded === true` → `router.push('/dashboard')`.
- If the call succeeds and `user.is_onboarded === false` → `router.push('/onboarding')`.
- If the call fails (no token, 401) → render the landing page below. Do not flash or redirect.

**Background & Texture:**
- Full-viewport `--bg-primary` (`#0a0a0a`) background.
- Apply a subtle noise texture via an SVG `<feTurbulence>` filter injected as a `<svg>` element fixed-positioned and covering the full viewport at `opacity: 0.035`. This breaks the flat black without introducing any color or gradient. No other background decoration.

**Header (Sticky, Top):**
- Height: `48px`. Background: `transparent`. No border. No shadow.
- Left: wordmark `FIÈRTÉ` in Space Grotesk, `font-weight: 800`, `font-size: 13px`, `letter-spacing: 4px`, uppercase, color `--text-primary`.
- Right: a single ghost link `"SIGN IN"` in JetBrains Mono, `font-size: 11px`, `letter-spacing: 3px`, color `--text-secondary`, no underline, `hover:color --text-primary` transition `150ms`.
- Nothing else in the header. No nav links, no logo mark, no divider.

**Above-Fold Section (`min-height: 100vh`, flex column, centered vertically and horizontally):**

The section has three stacked elements, center-aligned, with no other content competing for attention.

1. **Eyebrow label** — rendered above the main heading:
   - Text: `"HABIT TRACKER / EGO ENGINE / v1.0"` 
   - Font: JetBrains Mono, `font-size: 11px`, `letter-spacing: 4px`, color `--text-muted` (`#444444`), uppercase.
   - No animation. Static. Acts as a system version stamp.

2. **Main heading** — the single dominant typographic element above the fold:
   - Text: `"NO EXCUSES."` on line one, `"NO PARTICIPATION"` on line two, `"TROPHIES."` on line three — each line is its own `<span>` in a `<h1>`, `display: block`.
   - Font: Space Grotesk, `font-weight: 900`, `font-size: clamp(52px, 10vw, 112px)`, `line-height: 0.92`, `letter-spacing: -2px`, color `--text-primary`.
   - The word `"TROPHIES."` on the final line is rendered in `--accent-red` (`#ff2020`). Every other word is `--text-primary`. This is the only accent color in the above-fold area.
   - No text-shadow, no gradient fill, no animation on the text itself.

3. **Subline + CTA block** — rendered below the heading with `margin-top: 48px`:
   - Subline: `"Only output."` — JetBrains Mono, `font-size: 16px`, color `--text-secondary`, `letter-spacing: 2px`, uppercase. Rendered on its own line above the CTA button.
   - CTA button: text `"CLAIM YOUR SPOT"`, links to `/register`.
     - Background: `--accent-red` (`#ff2020`). No border-radius. Padding: `14px 40px`.
     - Font: JetBrains Mono, `font-size: 12px`, `font-weight: 700`, `letter-spacing: 4px`, uppercase, color `#ffffff`.
     - Hover state: background shifts to `#cc0000`, transition `120ms ease`.
     - No icon. No arrow. No shadow.
     - Rendered as a Next.js `<Link>` styled as a block button. Not a `<button>` tag.
   - `margin-top: 24px` between subline and button.

**Scroll Indicator:**
- At the very bottom of the viewport, centered: a single static character `"↓"` in JetBrains Mono, `font-size: 12px`, color `--text-muted`, `letter-spacing: 2px`. No animation. No label text.

**Below-Fold Section — Ghost Dashboard Preview:**

This section sits immediately below the above-fold, `padding: 120px 0`. Its purpose is to show a partially visible, low-opacity preview of the real dashboard — a "ghost" that signals what the product looks like without being fully interactive.

Container: max-width `900px`, centered, `padding: 0 24px`.

Section label above the ghost:
- Text: `"WHAT AWAITS YOU"` — JetBrains Mono, `font-size: 11px`, `letter-spacing: 5px`, color `--text-muted`, uppercase. Left-aligned. `margin-bottom: 32px`.

**Ghost Card (`LandingGhostCard`)** — a single static card component:
- Background: `--bg-card` (`#161616`). Border: `1px solid --border` (`#222222`). Padding: `32px`. No border-radius.
- Opacity of the entire card: `0.72`. No blur. No pointer-events.
- Apply a `linear-gradient(to bottom, transparent 60%, #0a0a0a 100%)` overlay on top of the card using a sibling `<div>` with `position: absolute, inset: 0` — this fades the bottom of the ghost out into the page background, simulating a "below the waterline" cut-off.

Inside the ghost card, render three static (hardcoded, non-fetching) sub-sections side by side:

**Sub-section 1 — Ghost Habit Label:**
- Text: `"DAILY OUTPUT"` — Space Grotesk, `font-weight: 700`, `font-size: 20px`, color `--text-primary`.
- Below it: `"TARGET: 4.00 hrs"` — JetBrains Mono, `font-size: 12px`, color `--text-secondary`, `letter-spacing: 2px`.
- Below it: a `DifficultyBadge`-styled static element: `"LVL 3"` with `border: 1px solid --border`, JetBrains Mono, `font-size: 10px`, color `--text-muted`. No `+OVERLOAD` suffix.

**Sub-section 2 — Ghost Heatmap:**
- Render a static 26-column × 7-row grid (half a year) of `8×8px` squares with `2px` gap.
- Fill cells with hardcoded pattern that communicates "mostly done, a few misses":
  - 80% of cells: `#22c55e` (completed).
  - 12% of cells: `#661010` (failed).
  - 8% of cells: `#111111` (empty — no log).
  - Distribute these randomly but seed the pattern so it's always the same render. Use a simple deterministic formula: `cellIndex % 13 === 0 → empty`, `cellIndex % 7 === 0 → failed`, `else → completed`.
- No hover tooltips. No interactivity.
- `opacity: 1` — the heatmap is the most visually readable part of the ghost.

**Sub-section 3 — Ghost Streak Counter:**
- Large number: `"34"` — Space Grotesk, `font-weight: 800`, `font-size: 48px`, color `--accent-red`. JetBrains Mono used for the label only.
- Label above the number: `"DAY STREAK"` — JetBrains Mono, `font-size: 10px`, `letter-spacing: 4px`, color `--text-muted`.
- Below number: `"BEST: 41 DAYS"` — JetBrains Mono, `font-size: 11px`, color `--text-muted`.

The three sub-sections sit in a CSS Grid: `grid-template-columns: auto 1fr auto`, `align-items: start`, `gap: 48px`.

**Below the ghost card** (`margin-top: 48px`):
- A single line of centered text: `"START YOUR STREAK TODAY."` — JetBrains Mono, `font-size: 12px`, `letter-spacing: 4px`, color `--text-muted`, uppercase.
- Below that (`margin-top: 16px`): a second CTA link identical to the above-fold CTA — same styles, same copy `"CLAIM YOUR SPOT"`, same `/register` destination.

**Footer:**
- Minimal single-line footer at the very bottom of the page. `padding: 24px`. `border-top: 1px solid --border`.
- Left: `"© FIÈRTÉ"` — JetBrains Mono, `font-size: 10px`, color `--text-muted`, `letter-spacing: 3px`.
- Right: `"NO EXCUSES."` — JetBrains Mono, `font-size: 10px`, color `--text-muted`, `letter-spacing: 3px`.
- Nothing else.

**Framer Motion:**
- The above-fold block uses `motion.div` with `initial={{ opacity: 0, y: 12 }}`, `animate={{ opacity: 1, y: 0 }}`, `transition={{ duration: 0.5, ease: "easeOut" }}`. No stagger. No delays. Single unified entrance.
- The ghost card uses `motion.div` with `initial={{ opacity: 0 }}`, `whileInView={{ opacity: 0.72 }}`, `viewport={{ once: true, amount: 0.2 }}`, `transition={{ duration: 0.6 }}`. It does not animate to full opacity — max is `0.72`.
- No other Framer Motion usage on this page.

---

### Page: Login (`app/(auth)/login/page.tsx`)
- Full-screen `--bg-primary` background
- Center-aligned form: email field + password field, no labels (use placeholder only)
- Single CTA button: text `"ENTER"`, background `--accent-red`, full width
- Below button: small link `"No account. Create one."` → `/register`
- On submit → `POST /auth/login` → store token in `localStorage` as `fierté_token`
- If `user.is_onboarded` → redirect `/dashboard`, else → redirect `/onboarding`
- Inline error text below button on failure: `"Wrong credentials. Try again."` in `--accent-red`

### Page: Register (`app/(auth)/register/page.tsx`)
- Identical layout to login
- Fields: username, email, password (placeholders only, no labels)
- CTA: `"CLAIM YOUR SPOT"`
- On success → `POST /auth/register` → store token → redirect `/onboarding`

---

### Page: Onboarding (`app/onboarding/page.tsx`)

**Phase 1 — Goal Input (`GoalInput.tsx`):**
- Full-screen black centered layout
- Heading in display font, uppercase, size `6xl` or larger: `"WHAT ARE YOU TRYING TO BECOME?"`
- Below: `<textarea>` with no background, no border, only a bottom border line in `--border`, monospace font, white text, 3 rows tall, full width up to 600px
- Subtext below textarea: `"Be honest. Be specific. This is your contract."` in `--text-muted`, mono font, small
- Button: `"SUBMIT TO THE PROCESS"` — red, full width, uppercase
- On submit → open WebSocket `ws://{WS_URL}/ws/negotiate?token={jwt}`
- Send: `{ "type": "goal", "content": textarea_value }`
- Transition to Phase 2 on send

**Phase 2 — AI Negotiation (`HabitNegotiation.tsx`):**
- While waiting for `habits_proposal`:
  - Show a centered text that cycles every 800ms through: `"ANALYZING..."`, `"CUTTING THE FAT..."`, `"BUILDING YOUR CONTRACT..."` using `useEffect` + `useState`
- On `habits_proposal` received:
  - Render each proposed habit as a card with black background, `--border` border, 1px
  - Card contents: habit name (large, white, display font), description (small, mono, `--text-secondary`), target in red: `"{target_value} {target_unit}"`
  - Below each card: an `<input type="number">` to edit `target_value` inline, pre-filled with proposed value
  - Two buttons below all cards: `"ACCEPT CONTRACT"` (red, large) and `"RENEGOTIATE"` (white outline)
  - ACCEPT → send `{ "type": "accept", "habits": currentHabits }` over WebSocket
  - RENEGOTIATE → send `{ "type": "modify", "habits": editedHabits }` over WebSocket

**Phase 3 — Contract Sealed (`ContractSeal.tsx`):**
- On `contract_sealed` message:
  - Framer Motion: flash entire screen to `--accent-red` for 200ms then back to black
  - Show centered: `"CONTRACT SEALED."` in display font, massive (text-8xl), white
  - Below: `"There are no excuses now."` in mono, `--text-secondary`
  - After 2500ms delay → `router.push('/dashboard')`

---

### Page: Dashboard (`app/dashboard/page.tsx`)

**Layout:**
- No sidebar. Full-width content area.
- Top bar: left side shows `username` in mono, right side shows total active streak days across all habits
- Below top bar: grid of `HabitCard` components, 1 column on mobile, 2 columns on desktop

**HabitCard (`components/dashboard/HabitCard.tsx`):**
- Container: `--bg-card` background, `--border` border, padding 24px
- Top row: habit name (left, display font, large) + `DifficultyBadge` (right)
- Second row: target in mono: `"TARGET: {effective_target} {unit}"` where `effective_target = target_value * difficulty_multiplier`
- Below: `HeatmapGrid` component
- Below heatmap: `StreakCounter` + `PerformanceStats` in a horizontal row
- Bottom: `LogHabitButton`

**HeatmapGrid (`components/dashboard/HeatmapGrid.tsx`):**
- 52 columns (weeks) × 7 rows (days)
- Each cell: 10×10px square, 2px gap between cells
- Color logic per cell:
  - No log data for that date: `#111111`
  - Log exists but `completed = false`: `#661010`
  - Log exists and `completed = true`: `#22c55e`
  - If date is today: add `2px solid #ff2020` outline
- Hover tooltip: show `"{date}: {logged_value} {unit}"` or `"{date}: not logged"`
- Data source: `GET /heatmap/{habit_id}?year={year}`
- Render a small month label row above the grid (Jan, Feb, ... Dec) aligned to week columns

**LogHabitButton (`components/dashboard/LogHabitButton.tsx`):**
- If today's log already exists and `completed = true`: show `"✓ LOGGED TODAY"` in green, non-clickable
- If today's log exists but `completed = false`: show `"LOGGED — INCOMPLETE"` in `--accent-red-dim`
- If no log today: show large red button `"LOG TODAY"`
- On click → show inline input: `"Enter value (e.g., 55)"` + `"CONFIRM"` button
- On CONFIRM → `POST /habits/{habit_id}/log` with `{ logged_value: Number(input) }`
- Optimistic UI: immediately update the heatmap cell for today before response returns

**StreakCounter (`components/dashboard/StreakCounter.tsx`):**
- Shows `"🔥 {current_streak} DAY STREAK"` — use `--accent-red` for the number
- Below: `"BEST: {longest_streak} DAYS"` in `--text-muted`

**PerformanceStats (`components/dashboard/PerformanceStats.tsx`):**
- Shows completion rate as a percentage: `"{rate}% COMPLETION"` in mono
- Below: a simple horizontal bar `<div>` — full width background `--border`, inner fill `--success` at `{rate}%` width

**DifficultyBadge (`components/dashboard/DifficultyBadge.tsx`):**
- Always shows: `"LVL {current_level}"` in a bordered box, `--border` border, mono font
- If `difficulty_multiplier > 1.0`: append `"+{((multiplier - 1) * 100).toFixed(0)}% OVERLOAD"` in `--accent-red` text, same line

---

### Page: Locker Room (`app/dashboard/locker-room/page.tsx`)

- Full page title: `"THE LOCKER ROOM"` in display font, uppercase
- Subtext: `"What happened when you thought no one was watching."` in mono, muted
- Fetch: `GET /evaluations?limit=30&offset=0` via React Query
- If empty → show centered: `"The locker room is empty. Come back tomorrow."` in `--text-muted`
- Otherwise: vertical list of `EvaluationCard` components

**EvaluationCard (`components/locker-room/EvaluationCard.tsx`):**
- Top row: date (left, mono, `--text-secondary`) + verdict badge (right):
  - PERFECT: green background, white text
  - PASS: white border, white text
  - FAIL: `--accent-red` background, white text
- Second row: completion rate horizontal bar (same as PerformanceStats)
- Below: `RoastDisplay` component

**RoastDisplay (`components/locker-room/RoastDisplay.tsx`):**
- Renders `evaluation.ai_message` in JetBrains Mono, `--text-primary`, no decorative quotes
- No borders, no background, just the raw text
- If `verdict === "FAIL"`: text color is `#cc2222` (dimmed red)
- If `verdict === "PERFECT"`: text color is `--success`
- If `verdict === "PASS"`: text color is `--text-secondary`

---

### Page: Settings (`app/dashboard/settings/page.tsx`)

- Title: `"CONTRACT SETTINGS"` in display font
- Section: `"ACTIVE HABITS"` — lists all active habits with name and target
- Each habit row has a `"REMOVE"` button → calls `DELETE /habits/{habit_id}` → confirm with inline text `"Removing this is an admission of defeat."` before proceeding
- Section: `"ADD HABIT"` — inline form (no `<form>` tag, use `onClick` handler):
  - Fields: habit name, description, target value (number), target unit (select from allowed units)
  - Button: `"ADD TO CONTRACT"` → `POST /habits`
- Section: `"RESET CONTRACT"` — single button `"RESTART FROM ZERO"`
  - On click → show inline brutal confirmation: `"Are you resetting because you failed? Thought so. Type RESET to confirm."`
  - User must type `"RESET"` in an input field
  - On match → DELETE all habits for user, set `is_onboarded = false` via `PUT /auth/me`, redirect to `/onboarding`

---

## 10. Caching Strategy (Redis)

| Cache Key | Value | TTL | Invalidated On |
|---|---|---|---|
| `heatmap:{user_id}:{habit_id}:{year}` | Full heatmap JSON string | 3600s | Any log for this habit |
| `streak:{user_id}:{habit_id}` | `{ current, longest }` JSON string | 3600s | Any log for this habit |
| `evaluations:{user_id}` | Latest evaluation JSON | 86400s | Nightly worker run |
| `user:{user_id}:habits` | List of habits JSON | 1800s | Any habit CRUD operation |

All cache operations implemented in `backend/app/services/cache_service.py`:
- `async def get_cache(key: str) -> Optional[str]`
- `async def set_cache(key: str, value: str, ttl: int) -> None`
- `async def invalidate_cache(key: str) -> None`
- `async def invalidate_pattern(pattern: str) -> None` — use Redis SCAN + DEL pipeline

---

## 11. Authentication Flow

**JWT Strategy:**
- Tokens are HS256 JWTs signed with `SECRET_KEY`
- Payload: `{ sub: user_id (as string), exp: timestamp }`
- Expiry: 7 days (10080 minutes)
- Stored on frontend in `localStorage` key: `fierté_token`

**Frontend Auth Logic (`lib/api.ts`):**
- All API requests attach `Authorization: Bearer {token}` header automatically
- If any response returns HTTP 401 → clear `localStorage` → `router.push('/login')`
- On app load in root `layout.tsx` → call `GET /auth/me` to validate token silently

**Backend Auth Dependency (`dependencies.py`):**
- `get_current_user`: decodes JWT, fetches user from DB, raises HTTP 401 if token invalid or user not found
- `get_db`: yields an async SQLAlchemy session, closes after request

---

## 12. Docker Configuration

### `docker-compose.yml` (Local Development Only)

```yaml
version: "3.9"

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: fiertedb
      POSTGRES_USER: fierteuser
      POSTGRES_PASSWORD: fiertepassword
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U fierteuser -d fiertedb"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    command: redis-server --maxmemory 256mb --maxmemory-policy allkeys-lru

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    env_file:
      - ./backend/.env
    environment:
      - DATABASE_URL=postgresql+asyncpg://fierteuser:fiertepassword@postgres:5432/fiertedb
      - REDIS_URL=redis://redis:6379
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
    volumes:
      - ./backend:/app
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

  frontend:
    image: node:20-alpine
    working_dir: /app
    ports:
      - "3000:3000"
    env_file:
      - ./frontend/.env.local
    depends_on:
      - backend
    volumes:
      - ./frontend:/app
      - /app/node_modules
    command: sh -c "npm install && npm run dev"

volumes:
  postgres_data:
```

### `backend/Dockerfile`

```dockerfile
FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends gcc libpq-dev && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## 13. GitHub Actions CI/CD

### `.github/workflows/backend-deploy.yml`
```yaml
name: Deploy Backend to Render

on:
  push:
    branches: [main]
    paths:
      - 'backend/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Trigger Render Deploy Hook
        run: curl -X POST "${{ secrets.RENDER_DEPLOY_HOOK_URL }}"
```

### `.github/workflows/frontend-deploy.yml`
```yaml
name: Deploy Frontend to Vercel

on:
  push:
    branches: [main]
    paths:
      - 'frontend/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install Vercel CLI
        run: npm install -g vercel
      - name: Deploy to Vercel
        run: vercel --prod --token "${{ secrets.VERCEL_TOKEN }}" --yes
        working-directory: ./frontend
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## 14. `backend/requirements.txt`

```
fastapi==0.111.0
uvicorn[standard]==0.29.0
sqlalchemy[asyncio]==2.0.30
asyncpg==0.29.0
alembic==1.13.1
pydantic==2.7.1
pydantic-settings==2.2.1
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-dotenv==1.0.1
redis==5.0.4
apscheduler==3.10.4
langchain==0.2.1
langchain-google-genai==1.0.5
google-generativeai==0.5.4
httpx==0.27.0
python-multipart==0.0.9
websockets==12.0
resend==2.0.0
```

---

## 15. Deployment Runbook (Step-by-Step)

### Step 1: Supabase Setup
1. Go to supabase.com → New project
2. Copy the connection string from Settings → Database → Connection String → URI mode (use the **Session pooler** URL for production)
3. Replace `[YOUR-PASSWORD]` with your DB password
4. This becomes `DATABASE_URL` in your backend env

### Step 2: Upstash Redis Setup
1. Go to upstash.com → Create Database → Redis
2. Select the free tier, pick a region close to your Render deployment
3. Copy the `REDIS_URL` (TLS URL starting with `rediss://`)
4. This becomes `REDIS_URL` in your backend env

### Step 3: Gemini API Key
1. Go to aistudio.google.com → Get API Key
2. This becomes `GEMINI_API_KEY` in your backend env

### Step 4: Resend Setup
1. Go to resend.com → Create account (free tier: 3,000 emails/month, 100/day)
2. Go to Domains → Add Domain → verify your domain via DNS records (add SPF, DKIM, DMARC records)
3. If you don't have a domain, use Resend's shared `onboarding@resend.dev` address for testing only — it only sends to your own verified email
4. Go to API Keys → Create API Key → copy it
5. This becomes `RESEND_API_KEY` in your backend env
6. Set `EMAIL_FROM` to `Fièrté <noreply@yourdomain.com>` (must match your verified domain)

### Step 5: Deploy Backend on Render
1. render.com → New Web Service → Connect GitHub → Select repo
2. Root directory: `backend`
3. Runtime: Python 3
4. Build command: `pip install -r requirements.txt`
5. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add all environment variables from `.env.example` including `RESEND_API_KEY` and `EMAIL_FROM`
7. After deploy: go to Settings → Copy Deploy Hook URL → add to GitHub Secrets as `RENDER_DEPLOY_HOOK_URL`

### Step 6: Run Migrations
After backend is live, in your local terminal:
```bash
cd backend
# Set DATABASE_URL to the Supabase production URL in your .env
alembic upgrade head
```

### Step 7: Deploy Frontend on Vercel
1. vercel.com → Add New Project → Import GitHub repo
2. Root directory: `frontend`
3. Framework preset: Next.js
4. Add environment variables:
   - `NEXT_PUBLIC_API_URL` = your Render backend URL (e.g., `https://fierté-api.onrender.com`)
   - `NEXT_PUBLIC_WS_URL` = `wss://fierté-api.onrender.com`
   - `NEXTAUTH_URL` = your Vercel frontend URL
   - `NEXTAUTH_SECRET` = any long random string
5. Deploy
6. Go to Vercel Account Settings → Tokens → Create → add to GitHub Secrets as `VERCEL_TOKEN`
7. Add `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` from `.vercel/project.json` to GitHub Secrets

---

## 16. Key Implementation Notes for Gemini CLI

1. **No placeholder code.** Every function must have a complete implementation. No `pass`, no `# TODO`, no `raise NotImplementedError`.
2. **All AI calls must be async.** Use `await` throughout. Do not use synchronous LangChain or Gemini calls inside async FastAPI handlers.
3. **WebSocket state is per-connection.** Do not use a global dict for WS state. Use local variables within the handler coroutine.
4. **Heatmap is the most expensive query.** Always check Redis before Postgres. The cache-aside pattern is non-negotiable.
5. **Alembic `env.py` must use async engine.** Import all four models in `env.py` so autogenerate detects all tables.
6. **CORS middleware in FastAPI** must allow the `FRONTEND_URL` origin explicitly. In development, also allow `http://localhost:3000`.
7. **Nightly worker timezone is UTC.** `cron(hour=23, minute=59, timezone='UTC')`.
8. **Progressive overload check** requires 7 consecutive `PERFECT` evaluations. Query the evaluations table ordered by date descending, check the last 7 are all PERFECT before triggering.
9. **React Query `staleTime`** must be set to `60000` (1 minute) for habit and heatmap queries to avoid excessive API calls.
10. **WebSocket ping/pong** must be handled to survive Render's 30-second idle connection timeout. Send a `ping` frame every 20 seconds from the server side.
11. **The `RESET CONTRACT` flow** must delete all habits AND all habit_logs for that user before setting `is_onboarded = false`. Use cascading deletes via SQLAlchemy.
12. **Framer Motion animations** must use `AnimatePresence` for page transitions in the root layout. Each page must have a `motion.div` wrapper with `initial={{ opacity: 0 }}`, `animate={{ opacity: 1 }}`, `exit={{ opacity: 0 }}`.
13. **All monetary/numeric displays** (streak counts, completion rates, target values) must use `font-mono` class to maintain the data-terminal aesthetic.
14. **The `useHeatmap` hook** must accept a `year` parameter defaulting to `new Date().getFullYear()` and generate all 365 dates client-side to fill empty cells before the API data loads.
15. **Resend SDK is synchronous.** Never call `resend.Emails.send(...)` directly inside an async function. Always wrap it with `asyncio.to_thread(...)` to prevent blocking the event loop during the nightly worker run.
16. **Email failures must never crash the nightly worker.** Each user's email send is isolated inside its own `try/except`. Log the error and move to the next user.

---

## 17. Future: Converting Fièrté to a Mobile App

> **Reference-only. Do not implement during Phase 1.**

### Recommended Path: React Native via Expo

The web frontend is Next.js + React. The mobile app will use **Expo (React Native)** to maximize code reuse.

**What transfers with zero changes:**
- Entire FastAPI backend — no modifications whatsoever
- Supabase + Upstash infrastructure — identical
- All TypeScript types from `lib/types.ts`
- All React Query hooks from `lib/hooks/` — copy directly
- All Zustand stores — copy directly
- All AI service logic — backend owned, no mobile code needed

**What must be rewritten:**
- All JSX components → React Native equivalents (`View`, `Text`, `Pressable`, `TextInput` instead of HTML elements)
- Tailwind CSS → **NativeWind** (Tailwind syntax for React Native) or React Native StyleSheet API
- `localStorage` → `expo-secure-store` for token storage
- WebSocket: same logic, use native WebSocket API (available in React Native without extra packages)
- `HeatmapGrid`: rebuild using `react-native-svg` — draw each cell as an SVG `<Rect>` element
- Next.js routing → **Expo Router** (file-based routing, same mental model)
- Framer Motion → **React Native Reanimated** for animations

**New features unique to mobile:**
- Push notifications via `expo-notifications` — deliver nightly evaluation result directly to phone
- Haptic feedback on habit log: `expo-haptics` — short impact when user taps "LOG TODAY"
- Offline log queuing — if no internet, store log entry in `AsyncStorage`, sync to backend on reconnect

**Conversion sequence:**
1. `npx create-expo-app fierté-mobile --template blank-typescript`
2. Install NativeWind, Expo Router, React Query, Zustand
3. Copy `lib/types.ts`, `lib/hooks/`, `lib/store/` directly
4. Build auth screens (Login, Register)
5. Build Onboarding with WebSocket negotiation (identical logic to web)
6. Build Dashboard with `HeatmapGrid` in SVG
7. Build Locker Room and Settings
8. Add push notifications for nightly evaluation
9. Build and publish via `EAS Build` (Expo Application Services — free tier supports both iOS and Android builds)

**Estimated conversion time:** 2–3 weeks for a developer familiar with the web version.
