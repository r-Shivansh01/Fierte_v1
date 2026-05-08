from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import delete
from typing import List
from datetime import date
from ..database import get_db
from ..models.habit import Habit
from ..models.habit_log import HabitLog
from ..models.user import User
from ..schemas.habit import HabitCreate, HabitRead, HabitUpdate
from ..schemas.habit_log import HabitLogCreate, HabitLogRead
from ..dependencies import get_current_user
from ..services.cache_service import invalidate_pattern, invalidate_cache

router = APIRouter(prefix="/habits", tags=["habits"])

@router.get("", response_model=List[HabitRead])
async def get_habits(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Habit).where(Habit.user_id == current_user.id, Habit.is_active == True))
    return result.scalars().all()

@router.post("", response_model=HabitRead)
async def create_habit(habit_in: HabitCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    habit = Habit(
        **habit_in.model_dump(),
        user_id=current_user.id
    )
    db.add(habit)
    await db.commit()
    await db.refresh(habit)
    await invalidate_cache(f"user:{current_user.id}:habits")
    return habit

@router.delete("")
async def delete_all_habits(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    await db.execute(delete(Habit).where(Habit.user_id == current_user.id))
    await db.commit()
    
    await invalidate_pattern(f"heatmap:{current_user.id}:*")
    await invalidate_cache(f"user:{current_user.id}:habits")
    
    return {"message": "All habits deleted"}

@router.put("/{habit_id}", response_model=HabitRead)
async def update_habit(habit_id: str, habit_in: HabitUpdate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Habit).where(Habit.id == habit_id, Habit.user_id == current_user.id))
    habit = result.scalars().first()
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    
    update_data = habit_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(habit, key, value)
    
    await db.commit()
    await db.refresh(habit)
    
    # Invalidate cache
    await invalidate_pattern(f"heatmap:{current_user.id}:{habit_id}:*")
    await invalidate_cache(f"user:{current_user.id}:habits")
    
    return habit

@router.delete("/{habit_id}")
async def delete_habit(habit_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Habit).where(Habit.id == habit_id, Habit.user_id == current_user.id))
    habit = result.scalars().first()
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    
    habit.is_active = False
    await db.commit()
    
    # Invalidate cache
    await invalidate_pattern(f"heatmap:{current_user.id}:{habit_id}:*")
    await invalidate_cache(f"user:{current_user.id}:habits")
    
    return {"message": "Habit deleted"}

@router.post("/{habit_id}/log", response_model=HabitLogRead)
async def log_habit(habit_id: str, log_in: HabitLogCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Habit).where(Habit.id == habit_id, Habit.user_id == current_user.id))
    habit = result.scalars().first()
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    
    today = date.today()
    # Check if log already exists
    log_result = await db.execute(select(HabitLog).where(HabitLog.habit_id == habit_id, HabitLog.log_date == today))
    log = log_result.scalars().first()
    
    completed = log_in.logged_value >= (habit.target_value * habit.difficulty_multiplier)
    
    if log:
        log.logged_value = log_in.logged_value
        log.notes = log_in.notes
        log.completed = completed
    else:
        log = HabitLog(
            habit_id=habit_id,
            user_id=current_user.id,
            log_date=today,
            logged_value=log_in.logged_value,
            notes=log_in.notes,
            completed=completed
        )
        db.add(log)
    
    await db.commit()
    await db.refresh(log)
    
    # Invalidate Redis keys
    await invalidate_pattern(f"heatmap:{current_user.id}:{habit_id}:*")
    await invalidate_cache(f"streak:{current_user.id}:{habit_id}")
    
    return log
