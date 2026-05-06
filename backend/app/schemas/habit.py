from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime
from typing import Optional

class HabitBase(BaseModel):
    name: str
    description: Optional[str] = None
    target_value: float
    target_unit: str

class HabitCreate(HabitBase):
    pass

class HabitRead(HabitBase):
    id: UUID
    user_id: UUID
    current_level: int
    difficulty_multiplier: float
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class HabitUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    target_value: Optional[float] = None
    target_unit: Optional[str] = None
    is_active: Optional[bool] = None
