from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime, date
from typing import Optional

class HabitLogBase(BaseModel):
    logged_value: float
    notes: Optional[str] = None

class HabitLogCreate(HabitLogBase):
    pass

class HabitLogRead(HabitLogBase):
    id: UUID
    habit_id: UUID
    user_id: UUID
    log_date: date
    completed: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
