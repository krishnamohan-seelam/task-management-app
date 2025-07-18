import pytest
from unittest.mock import AsyncMock
from app.services.task_service import TaskService
from app.models.task import CreateTaskSchema

@pytest.fixture
def repo():
    return AsyncMock()

@pytest.mark.asyncio
async def test_create_task_success(repo):
    repo.create = AsyncMock(return_value=AsyncMock(inserted_id='1'))
    service = TaskService(task_repository=repo)
    schema = CreateTaskSchema(title='Test', status='pending', assigned_to='1')
    result = await service.create_task(schema)
    assert result['title'] == 'Test'

@pytest.mark.asyncio
async def test_create_task_failure(repo):
    repo.create = AsyncMock(return_value=AsyncMock(inserted_id=None))
    service = TaskService(task_repository=repo)
    schema = CreateTaskSchema(title='Test', status='pending', assigned_to='1')
    with pytest.raises(Exception):
        await service.create_task(schema)
