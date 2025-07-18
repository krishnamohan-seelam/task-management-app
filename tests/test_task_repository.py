import pytest
from unittest.mock import AsyncMock
from bson import ObjectId
from app.repositories.task_repository import TaskRepository



@pytest.fixture
def repo():
    db = {'tasks': AsyncMock()}
    return TaskRepository(db)

@pytest.mark.asyncio
async def test_create_task(repo):
    obj_id = ObjectId()
    repo.collection.insert_one = AsyncMock(return_value=AsyncMock(inserted_id=obj_id))
    result = await repo.create({'title': 'Test'})
    repo.collection.insert_one.assert_called_once()

@pytest.mark.asyncio
async def test_get_task(repo):
    obj_id = ObjectId()
    repo.collection.find_one = AsyncMock(return_value={'_id': obj_id, 'title': 'Test'})
    result = await repo.get(str(obj_id))
    repo.collection.find_one.assert_called_once()

@pytest.mark.asyncio
async def test_update_task(repo):
    obj_id = ObjectId()
    repo.collection.update_one = AsyncMock(return_value=AsyncMock(modified_count=1))
    result = await repo.update(str(obj_id), {'title': 'Updated'})
    repo.collection.update_one.assert_called_once()
