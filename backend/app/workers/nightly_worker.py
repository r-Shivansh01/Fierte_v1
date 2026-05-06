import logging
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from sqlalchemy.future import select
from ..database import SessionLocal
from ..models.user import User
from ..services import ai_service, email_service

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

scheduler = AsyncIOScheduler()

async def run_nightly_evaluation():
    logger.info("Starting nightly evaluation worker...")
    async with SessionLocal() as db:
        result = await db.execute(select(User).where(User.is_onboarded == True))
        users = result.scalars().all()
        
        for user in users:
            try:
                evaluation = await ai_service.evaluate_user(user.id, db)
                await email_service.send_evaluation_email(user, evaluation)
                logger.info(f"Successfully processed nightly evaluation for user {user.id}")
            except Exception as e:
                logger.error(f"Failed to process nightly evaluation for user {user.id}: {str(e)}")
                continue

def start_scheduler():
    scheduler.add_job(
        run_nightly_evaluation,
        "cron",
        hour=23,
        minute=59,
        timezone="UTC"
    )
    scheduler.start()
    logger.info("Nightly worker scheduled for 23:59 UTC")

def shutdown_scheduler():
    scheduler.shutdown()
    logger.info("Nightly worker shut down.")
