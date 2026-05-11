import json
from typing import List
from datetime import date
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
import google.generativeai as genai

from ..config import settings
from ..models import Habit, HabitLog, Evaluation
from .cache_service import invalidate_cache

# Configure the Gemini SDK
genai.configure(api_key=settings.GEMINI_API_KEY)

NEGOTIATE_SYSTEM_PROMPT = """You are Fièrté, a ruthless AI performance coach.
You do not coddle. You do not motivate with kindness.
You analyze goals and convert them into the minimum viable set of daily habits — measurable, trackable, brutal.
Rules:
- Return ONLY a valid JSON array. No markdown. No explanation. No preamble.
- Return 3 to 4 habits maximum.
- Each habit must have: name (string), description (string), target_value (number), target_unit (string)
- Units must be one of: reps, minutes, pages, km, hours, pushups, sessions
- Habits must be completable daily. No weekly targets.
- Be specific. "Exercise" is not a habit. "50 pull-ups" is."""


async def _call_gemini(system_prompt: str, user_prompt: str) -> str:
    """Call Gemini API directly using the google-generativeai SDK."""
    model = genai.GenerativeModel(
        model_name="gemini-2.5-flash",
        system_instruction=system_prompt
    )
    response = await model.generate_content_async(user_prompt)
    return response.text.strip()


def _parse_json_response(content: str) -> list:
    """Parse JSON from LLM response, stripping markdown code fences if present."""
    if content.startswith("```json"):
        content = content.replace("```json", "", 1).replace("```", "", 1).strip()
    elif content.startswith("```"):
        content = content.replace("```", "", 1).replace("```", "", 1).strip()
    return json.loads(content)


async def negotiate_habits(goal: str) -> List[dict]:
    try:
        content = await _call_gemini(NEGOTIATE_SYSTEM_PROMPT, f"Goal: {goal}")
        return _parse_json_response(content)
    except (json.JSONDecodeError, Exception) as e:
        # Retry once with explicit JSON reminder
        retry_prompt = f"Goal: {goal}\n\nIMPORTANT: Your previous response was not valid JSON. Return ONLY a valid JSON array of habits. No markdown, no explanation."
        content = await _call_gemini(NEGOTIATE_SYSTEM_PROMPT, retry_prompt)
        try:
            return _parse_json_response(content)
        except json.JSONDecodeError:
            raise ValueError(f"AI returned invalid habit format: {e}")

async def evaluate_user(user_id: str, db: AsyncSession) -> Evaluation:
    # 1. Fetch all active habits for user
    habits_result = await db.execute(select(Habit).where(Habit.user_id == user_id, Habit.is_active == True))
    habits = habits_result.scalars().all()
    
    if not habits:
        raise ValueError("User has no active habits")
        
    # 2. Fetch all habit_logs for today
    today = date.today()
    logs_result = await db.execute(select(HabitLog).where(HabitLog.user_id == user_id, HabitLog.log_date == today))
    logs = {log.habit_id: log for log in logs_result.scalars().all()}
    
    # 3. Calculate completion rate
    total_habits = len(habits)
    completed_habits = sum(1 for h in habits if h.id in logs and logs[h.id].completed)
    completion_rate = completed_habits / total_habits
    
    # 4. Determine verdict
    if completion_rate == 1.0:
        verdict = "PERFECT"
    elif completion_rate >= 0.5:
        verdict = "PASS"
    else:
        verdict = "FAIL"
        
    # 5. Call Gemini for AI message
    habit_summary = ", ".join([f"{h.name} ({h.target_value} {h.target_unit})" for h in habits])
    failed_habits_list = [h.name for h in habits if h.id not in logs or not logs[h.id].completed]
    failed_habits = ", ".join(failed_habits_list)
    
    if verdict == "FAIL":
        prompt = f"A user has failed their habit contract today. User's habits: {habit_summary}. Completion rate: {int(completion_rate*100)}%. Habits failed: {failed_habits}. Write a harsh, personalized 2-3 sentence critique. Do not use profanity. Be cold, precise, and contemptuous. Address the user directly as 'you'. No emojis. No fluff."
    elif verdict == "PASS":
        prompt = f"A user has partially completed their habit contract. Completion rate: {int(completion_rate*100)}%. Write a brief 1-2 sentence cold acknowledgment. Do not praise. Just note what was done and what was not."
    else: # PERFECT
        # Fetch streak
        streak_result = await db.execute(
            select(func.count(Evaluation.id))
            .where(Evaluation.user_id == user_id, Evaluation.overall_verdict == "PERFECT")
        )
        streak = (streak_result.scalar() or 0) + 1 # Simple streak count for prompt
        prompt = f"A user has achieved 100% completion today. This is day {streak} of a perfect streak. Write a 1-2 sentence cold, reluctant acknowledgment. Do not be warm. Do not celebrate. Simply note it like a general noting a soldier met the minimum standard."

    eval_system = "You are Fièrté, a ruthless AI performance coach. You do not coddle. You do not motivate with kindness. Be cold, precise, and contemptuous."
    ai_message = await _call_gemini(eval_system, prompt)
    
    # 6. Progressive overload trigger
    overloaded_habits = []
    if verdict == "PERFECT":
        # Check last 6 days (total 7 including today)
        last_evals_result = await db.execute(
            select(Evaluation.overall_verdict)
            .where(Evaluation.user_id == user_id)
            .order_by(Evaluation.evaluation_date.desc())
            .limit(6)
        )
        last_evals = last_evals_result.scalars().all()
        if len(last_evals) == 6 and all(v == "PERFECT" for v in last_evals):
            for habit in habits:
                await progressive_overload(habit, db)
                overloaded_habits.append(habit.id)
                
    # 7. Save Evaluation record to DB
    evaluation = Evaluation(
        user_id=user_id,
        evaluation_date=today,
        overall_verdict=verdict,
        completion_rate=completion_rate,
        ai_message=ai_message,
        habits_overloaded=overloaded_habits if overloaded_habits else None
    )
    db.add(evaluation)
    await db.commit()
    await db.refresh(evaluation)
    
    # 8. Invalidate Redis key
    await invalidate_cache(f"evaluations:{user_id}")
    
    return evaluation

async def progressive_overload(habit: Habit, db: AsyncSession):
    new_multiplier = habit.difficulty_multiplier * 1.10
    habit.difficulty_multiplier = round(new_multiplier, 2)
    habit.current_level += 1
    # Note: caller handles commit
