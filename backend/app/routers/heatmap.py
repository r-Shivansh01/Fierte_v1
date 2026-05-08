import json
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import date
from ..database import get_db
from ..models.habit_log import HabitLog
from ..models.user import User
from ..dependencies import get_current_user
from ..services.cache_service import get_cache, set_cache

router = APIRouter(prefix="/heatmap", tags=["heatmap"])

@router.get("/{habit_id}")
async def get_heatmap(
    habit_id: str,
    year: int = date.today().year,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    cache_key = f"heatmap:{current_user.id}:{habit_id}:{year}"
    cached_data = await get_cache(cache_key)
    
    if cached_data:
        return json.loads(cached_data)
        
    # MISS -> Query DB
    start_date = date(year, 1, 1)
    end_date = date(year, 12, 31)
    
    result = await db.execute(
        select(HabitLog)
        .where(HabitLog.habit_id == habit_id, HabitLog.log_date >= start_date, HabitLog.log_date <= end_date)
        .order_by(HabitLog.log_date.asc())
    )
    logs = result.scalars().all()
    
    data = [
        {"date": log.log_date.isoformat(), "completed": log.completed, "value": log.logged_value}
        for log in logs
    ]
    
    # Compute streaks (simplified logic)
    current_streak = 0
    longest_streak = 0
    temp_streak = 0
    
    # To correctly compute streaks, we might need logs beyond this year, 
    # but for simplicity and per spec, we'll compute based on available logs.
    # In a real app, you'd want to check back from today for current streak.
    
    all_time_result = await db.execute(
        select(HabitLog)
        .where(HabitLog.habit_id == habit_id)
        .order_by(HabitLog.log_date.desc())
    )
    all_logs = all_time_result.scalars().all()
    
    # Current streak (working backwards from today or last log)
    if all_logs:
        today = date.today()
        # If no log for today, check yesterday
        last_log_date = all_logs[0].log_date
        if last_log_date == today or last_log_date == today - date.resolution: # date.resolution is 1 day
             # compute current streak
             for log in all_logs:
                 if log.completed:
                     current_streak += 1
                 else:
                     break
        
        # Longest streak
        # Sort all logs by date asc for longest streak
        sorted_all_logs = sorted(all_logs, key=lambda x: x.log_date)
        current_temp = 0
        last_d = None
        for log in sorted_all_logs:
            if log.completed:
                if last_d and log.log_date == last_d + date.resolution:
                    current_temp += 1
                else:
                    current_temp = 1
                longest_streak = max(longest_streak, current_temp)
                last_d = log.log_date
            else:
                current_temp = 0
                last_d = None

    completion_rate = sum(1 for log in logs if log.completed) / len(logs) if logs else 0
    
    response_data = {
        "habit_id": habit_id,
        "year": year,
        "data": data,
        "current_streak": current_streak,
        "longest_streak": longest_streak,
        "completion_rate": round(completion_rate, 2)
    }
    
    await set_cache(cache_key, json.dumps(response_data), 3600)
    return response_data
