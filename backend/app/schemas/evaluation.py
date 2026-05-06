from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime, date
from typing import Optional, List

class EvaluationRead(BaseModel):
    id: UUID
    user_id: UUID
    evaluation_date: date
    overall_verdict: str
    completion_rate: float
    ai_message: str
    habits_overloaded: Optional[List[UUID]] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
