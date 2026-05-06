from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
from ..database import get_db
from ..models.evaluation import Evaluation
from ..models.user import User
from ..schemas.evaluation import EvaluationRead
from ..dependencies import get_current_user

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
