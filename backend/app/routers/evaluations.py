import logging
from datetime import date, timedelta
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
from ..database import get_db
from ..models.evaluation import Evaluation
from ..models.user import User
from ..schemas.evaluation import EvaluationRead
from ..dependencies import get_current_user
from ..services import ai_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/evaluations", tags=["evaluations"])

@router.get("", response_model=List[EvaluationRead])
async def get_evaluations(
    limit: int = Query(30, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Evaluation)
        .where(Evaluation.user_id == current_user.id)
        .order_by(Evaluation.evaluation_date.desc())
        .limit(limit)
        .offset(offset)
    )
    return result.scalars().all()

@router.get("/latest", response_model=Optional[EvaluationRead])
async def get_latest_evaluation(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Evaluation)
        .where(Evaluation.user_id == current_user.id)
        .order_by(Evaluation.evaluation_date.desc())
        .limit(1)
    )
    return result.scalars().first()

@router.post("/backfill")
async def backfill_evaluation(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Lazy evaluation: checks if yesterday's evaluation exists.
    If not, generates it on-the-fly so the user always sees their
    nightly verdict even if the cron job was missed (e.g. Render sleeping).
    Called automatically when the user opens the dashboard."""
    yesterday = date.today() - timedelta(days=1)

    # Skip if user onboarded today (no yesterday to evaluate)
    if current_user.created_at and current_user.created_at.date() > yesterday:
        return {"status": "too_new", "message": "Account too new for backfill"}

    # Check if evaluation already exists for yesterday
    existing = await db.execute(
        select(Evaluation).where(
            Evaluation.user_id == current_user.id,
            Evaluation.evaluation_date == yesterday
        )
    )
    if existing.scalar():
        return {"status": "already_evaluated"}

    # Generate the missing evaluation for yesterday
    try:
        evaluation = await ai_service.evaluate_user_for_date(
            str(current_user.id), db, yesterday
        )
        logger.info(f"Backfilled evaluation for user {current_user.id} for {yesterday}")
        return {
            "status": "backfilled",
            "verdict": evaluation.overall_verdict,
            "completion_rate": evaluation.completion_rate
        }
    except ValueError as e:
        logger.warning(f"Backfill skipped for user {current_user.id}: {e}")
        return {"status": "skipped", "message": str(e)}
    except Exception as e:
        logger.error(f"Backfill failed for user {current_user.id}: {e}")
        return {"status": "error", "message": "Failed to generate evaluation"}
