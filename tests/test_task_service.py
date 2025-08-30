import pytest
from unittest.mock import AsyncMock
from app.services.task_service import TaskService
from app.models.task import CreateTaskSchema
from app.repositories.task_repository import TaskRepository

@pytest.fixture
def task_service(get_mongo_db):
    repository = TaskRepository(get_mongo_db)
    return TaskService(repository)

@pytest.mark.asyncio
async def test_create_task_success(task_service):
    schema = CreateTaskSchema(title='Test', status='pending', assigned_to='1')
    result = await task_service.create_task(schema)
    assert result['title'] == 'Test'

 
