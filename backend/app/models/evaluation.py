from sqlalchemy import Column, String, Text, DateTime, Date, Float, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID, JSONB
import uuid
from ..database import Base

class Evaluation(Base):
    __tablename__ = "evaluations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    evaluation_date = Column(Date, nullable=False)
    overall_verdict = Column(String(20), nullable=False) # "PASS" | "FAIL" | "PERFECT"
    completion_rate = Column(Float, nullable=False)
    ai_message = Column(Text, nullable=False)
    habits_overloaded = Column(JSONB, nullable=True) # List of habit IDs
    created_at = Column(DateTime(timezone=True), server_default=func.now())
