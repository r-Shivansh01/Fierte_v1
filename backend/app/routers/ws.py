import asyncio
import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from jose import JWTError, jwt
from ..config import settings
from ..database import SessionLocal
from ..models.habit import Habit
from ..services import ai_service

router = APIRouter(tags=["websocket"])

async def get_user_from_token(token: str):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            return None
        return user_id
    except JWTError:
        return None

@router.websocket("/ws/negotiate")
async def websocket_endpoint(websocket: WebSocket, token: str = Query(...)):
    await websocket.accept()
    
    user_id = await get_user_from_token(token)
    if not user_id:
        await websocket.close(code=4001)
        return

    # Keep track of background ping task
    ping_task = asyncio.create_task(send_pings(websocket))
    
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            if message["type"] == "goal":
                await websocket.send_json({"type": "thinking", "content": "Analyzing your goals..."})
                habits = await ai_service.negotiate_habits(message["content"])
                await websocket.send_json({"type": "habits_proposal", "content": habits})
                
            elif message["type"] in ["accept", "modify"]:
                habits_data = message["habits"]
                
                async with SessionLocal() as db:
                    # Save habits
                    for h_data in habits_data:
                        habit = Habit(
                            user_id=user_id,
                            name=h_data["name"],
                            description=h_data["description"],
                            target_value=h_data["target_value"],
                            target_unit=h_data["target_unit"]
                        )
                        db.add(habit)
                    
                    # Update user
                    from sqlalchemy import update
                    from ..models.user import User
                    await db.execute(
                        update(User)
                        .where(User.id == user_id)
                        .values(is_onboarded=True, goal_statement="Negotiated via AI")
                    )
                    await db.commit()
                
                await websocket.send_json({"type": "contract_sealed", "habits": habits_data})
                
    except WebSocketDisconnect:
        pass
    except Exception as e:
        try:
            await websocket.send_json({"type": "error", "content": str(e)})
        except:
            pass
    finally:
        ping_task.cancel()
        try:
            await websocket.close()
        except:
            pass

async def send_pings(websocket: WebSocket):
    try:
        while True:
            await asyncio.sleep(20)
            await websocket.send_json({"type": "ping"})
    except asyncio.CancelledError:
        pass
    except:
        pass
