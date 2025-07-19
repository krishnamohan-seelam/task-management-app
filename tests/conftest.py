import pytest
from mongomock_motor import AsyncMongoMockClient

@pytest.fixture
async def mock_mongo():
    client = AsyncMongoMockClient()
    yield client
    client.close()

@pytest.fixture
async def mock_db(mock_mongo):
    db = mock_mongo['task_management_test']
    yield db
    await db.client.drop_database('task_management_test')