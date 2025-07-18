# Example pytest for TaskModel validation
import pytest
from app.models.task import TaskModel,TaskStatus
from datetime import datetime

def test_task_model_defaults():
    # Use valid TaskStatus and assigned_to as ObjectId string
    task = TaskModel(title="Test Task", status=TaskStatus.PENDING, assigned_to="60d5ec49f8d2e4b8b4e7c8a1")
    assert task.title == "Test Task"
    assert task.status == TaskStatus.PENDING
    assert task.assigned_to == "60d5ec49f8d2e4b8b4e7c8a1"
    assert isinstance(task.created_at, datetime)
    assert isinstance(task.updated_at, datetime)

def test_task_model_optional_description():
    task = TaskModel(title="Test Task", status=TaskStatus.IN_PROGRESS, assigned_to="60d5ec49f8d2e4b8b4e7c8a1", description="desc")
    assert task.description == "desc"
