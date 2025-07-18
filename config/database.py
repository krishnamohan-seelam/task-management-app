from pymongo import AsyncMongoClient
from pymongo.asynchronous.database import AsyncDatabase
from dotenv import load_dotenv
import os

load_dotenv()

def get_database() -> AsyncDatabase:
    """
    Get the MongoDB database instance based on environment.

    Returns:
        AsyncDatabase: The database instance.
    """
    # Load environment variables
    env = os.getenv("ENV", "dev")
    db_url = os.getenv("DB_URL", "mongodb://localhost:27017")
    db_name = os.getenv("DB_NAME", "task_management_dev")

    if env == "test":
        db_name = "task_management_test"
    elif env == "prod":
        db_name = "task_management"

    client = AsyncMongoClient(db_url)
    return client[db_name]