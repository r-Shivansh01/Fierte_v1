from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .routers import auth_router, habits_router, heatmap_router, evaluations_router, ws_router
from .workers.nightly_worker import start_scheduler, shutdown_scheduler

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    start_scheduler()
    yield
    # Shutdown
    shutdown_scheduler()

app = FastAPI(
    title="Fièrté API",
    description="The Ego-Driven Habit Tracker API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware
origins = [
    settings.FRONTEND_URL,
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(auth_router)
app.include_router(habits_router)
app.include_router(heatmap_router)
app.include_router(evaluations_router)
app.include_router(ws_router)

@app.get("/health")
async def health_check():
    return {"status": "ruthless"}
