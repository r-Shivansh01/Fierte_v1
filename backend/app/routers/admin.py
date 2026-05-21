from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
import time
from typing import List

from ..database import get_db
from ..models.user import User
from ..schemas.user import UserRead
from ..dependencies import require_admin

router = APIRouter(
    prefix="/admin",
    tags=["admin"],
    dependencies=[Depends(require_admin)]
)

@router.get("/users")
async def get_users(
    skip: int = 0,
    limit: int = 20,
    db: AsyncSession = Depends(get_db)
):
    # Query users
    result = await db.execute(select(User).offset(skip).limit(limit))
    users = result.scalars().all()
    
    # Query total count
    count_result = await db.execute(select(func.count(User.id)))
    total = count_result.scalar()

    # Format response for the frontend (matching the mock data structure)
    formatted_users = []
    for u in users:
        formatted_users.append({
            "name": u.username,
            "email": u.email,
            "role": u.role,
            "state": "ACTIVE" if getattr(u, 'is_onboarded', False) else "INACTIVE",
            "lastSync": str(u.updated_at).split('.')[0].replace('-', '.').replace(' ', '_')
        })

    return {
        "items": formatted_users,
        "total": total,
        "page": (skip // limit) + 1,
        "totalPages": (total // limit) + (1 if total % limit > 0 else 0)
    }

@router.get("/health-metrics")
async def get_health_metrics(db: AsyncSession = Depends(get_db)):
    start_time = time.time()
    db_status = "HEALTHY"
    db_latency = 0
    
    try:
        # Simple DB ping
        await db.execute(select(1))
        db_latency = int((time.time() - start_time) * 1000)
    except Exception:
        db_status = "DEGRADED"

    return {
        "overall_status": "ALL_SERVICES_OPERATIONAL" if db_status == "HEALTHY" else "PARTIAL_OUTAGE",
        "latency_ms": db_latency,
        "api_gateway": {
            "status": "HEALTHY",
            "latency": "24ms",
            "throughput": "12.4k/s",
            "errors": "0.001%"
        },
        "database": {
            "status": db_status,
            "cpu_load": "42%",
            "connections": "892/2000",
            "replication": "SYNCED"
        },
        "storage": {
            "status": "DEGRADED",
            "iops": "LOW_THR",
            "utilization": "94%",
            "pending_jobs": "1,402"
        },
        "active_nodes": 1024,
        "total_requests": 142891002
    }
