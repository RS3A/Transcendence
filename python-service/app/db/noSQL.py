import	os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "transcendence")

class MongoDB:
	client: AsyncIOMotorClient | None = None
	db = None

mongo = MongoDB

async def connect():
	mongo.client = AsyncIOMotorClient(MONGO_URL)
	mongo.db = mongo.client[DB_NAME]
	await mongo.client.admin.command("ping")
	print(f"Conectado ao MongoDB: {DB_NAME}")

async def close():
	if mongo.client:
		mongo.client.close()
		print(f"Conexão MongoDB feixada!")