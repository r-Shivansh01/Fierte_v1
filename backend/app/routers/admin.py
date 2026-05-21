from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
import time
from uuid import UUID

from ..database import get_db
from ..models.user import User
from ..schemas.user import UserRead, AdminUserCreate, AdminUserUpdate
from ..dependencies import require_admin
from ..services import auth_service

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
            "id": str(u.id),
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

@router.post("/users")
async def create_user(
    user_in: AdminUserCreate,
    db: AsyncSession = Depends(get_db)
):
    # Check if user exists
    result = await db.execute(select(User).where((User.email == user_in.email) | (User.username == user_in.username)))
    existing_user = result.scalars().first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User already registered")
    
    hashed_password = auth_service.get_password_hash(user_in.password)
    user = User(
        email=user_in.email,
        username=user_in.username,
        hashed_password=hashed_password,
        role=user_in.role
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return {"message": "User created successfully", "id": str(user.id)}

@router.put("/users/{user_id}")
async def update_user(
    user_id: UUID,
    user_in: AdminUserUpdate,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    update_data = user_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(user, key, value)
        
    await db.commit()
    await db.refresh(user)
    return {"message": "User updated successfully"}

@router.delete("/users/{user_id}")
async def delete_user(
    user_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if user.role == "ROOT_ADMIN":
        # Check if there are other root admins before deleting
        count_result = await db.execute(select(func.count(User.id)).where(User.role == "ROOT_ADMIN"))
        root_count = count_result.scalar()
        if root_count <= 1:
            raise HTTPException(status_code=400, detail="Cannot delete the last ROOT_ADMIN")
            
    await db.delete(user)
    await db.commit()
    return {"message": "User deleted successfully"}

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
