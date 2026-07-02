import asyncio
from redis.asyncio import Redis

async def main():
    r = Redis(host="127.0.0.1", port=6379)
    print(await r.ping())
    await r.close()

asyncio.run(main())