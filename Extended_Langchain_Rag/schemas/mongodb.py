# schemas/mongodb.py
import os
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure
import logging
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

class Database:
    client: AsyncIOMotorClient = None
    database = None

# Global database instance
database = Database()

async def connect_to_mongo():
    """Create database connection"""
    try:
        # Get MongoDB connection string from environment
        connection_string = os.getenv("MONGODB_CONNECTION_STRING", "mongodb://localhost:27017")
        database_name = os.getenv("MONGODB_DATABASE", "campus_mitra")
        
        # Create connection
        database.client = AsyncIOMotorClient(connection_string)
        database.database = database.client[database_name]
        
        # Test the connection
        await database.client.admin.command('ismaster')
        
        # Create indexes
        await create_indexes()
        
        logger.info(f"Connected to MongoDB database: {database_name}")
        return True
        
    except ConnectionFailure as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        return False
    except Exception as e:
        logger.error(f"Error connecting to MongoDB: {e}")
        return False

async def close_mongo_connection():
    """Close database connection"""
    if database.client:
        database.client.close()
        logger.info("Disconnected from MongoDB")

async def create_indexes():
    """Create necessary database indexes"""
    try:
        # Users collection indexes
        await database.database.users.create_index("email", unique=True)
        await database.database.users.create_index("username", unique=True)
        
        # Files collection indexes
        await database.database.files.create_index("user_id")
        await database.database.files.create_index("file_hash")
        await database.database.files.create_index([("user_id", 1), ("filename", 1)], unique=True)
        
        logger.info("Database indexes created successfully")
        
    except Exception as e:
        logger.error(f"Error creating indexes: {e}")

# Access to collections
def get_users_collection():
    return database.database.users

def get_files_collection():
    return database.database.files

# Export the database instance for use in other modules
mongodb = database