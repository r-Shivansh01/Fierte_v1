from typing import Optional
from ..redis_client import redis_client

async def get_cache(key: str) -> Optional[str]:
    return await redis_client.get(key)

async def set_cache(key: str, value: str, ttl: int) -> None:
    await redis_client.set(key, value, ex=ttl)

async def invalidate_cache(key: str) -> None:
    await redis_client.delete(key)

async def invalidate_pattern(pattern: str) -> None:
    cursor = 0
    while True:
        cursor, keys = await redis_client.scan(cursor=cursor, match=pattern)
        if keys:
            await redis_client.delete(*keys)
        if cursor == 0:
            break
