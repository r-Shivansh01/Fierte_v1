from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from ..database import get_db
from ..models.user import User
from ..schemas.user import UserCreate, UserRead, UserUpdate
from ..services import auth_service
from ..dependencies import get_current_user
import logging

logger = logging.getLogger("uvicorn.error")

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=dict)
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    logger.info(f"Registering user: {user_in.username} ({user_in.email})")
    # Check if user exists
    result = await db.execute(select(User).where((User.email == user_in.email) | (User.username == user_in.username)))
    existing_user = result.scalars().first()
    if existing_user:
        logger.warning(f"Registration failed: User already exists - {user_in.username} or {user_in.email}")
        raise HTTPException(status_code=400, detail="User already registered")
    
    try:
        hashed_password = auth_service.get_password_hash(user_in.password)
        user = User(
            email=user_in.email,
            username=user_in.username,
            hashed_password=hashed_password
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
        logger.info(f"User created successfully: {user.id}")
    except Exception as e:
        logger.error(f"Error creating user: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error during registration")
    
    access_token = auth_service.create_access_token(data={"sub": str(user.id)})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserRead.model_validate(user)
    }

@router.post("/login", response_model=dict)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == form_data.username)) # OAuth2 uses 'username' field for email here
    user = result.scalars().first()
    
    if not user or not auth_service.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = auth_service.create_access_token(data={"sub": str(user.id)})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserRead.model_validate(user)
    }

@router.get("/me", response_model=UserRead)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=UserRead)
async def update_me(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    update_data = user_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(current_user, key, value)
    
    await db.commit()
    await db.refresh(current_user)
    return current_user
