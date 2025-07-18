from datetime import datetime, timezone
from typing import Dict,List,Union
from pymongo.asynchronous.database import AsyncDatabase
from fastapi import Depends,HTTPException
from app.repositories.task_repository import TaskRepository
from app.models.task import TaskModel,CreateTaskSchema,ResponseTaskSchema,UpdateTaskSchema,AssignTaskSchema
from config.database import get_database
from app.logging_config import logger
import asyncio


class TaskService:
    def __init__(self, task_repository: TaskRepository = None):
        self.task_repository = task_repository
        logger.info("TaskService initialized.")

    async def create_task(self, task_create: CreateTaskSchema) -> Dict:
        """
        Create a new task.

        Args:
            task_create (CreateTaskSchema): Task details.

        Returns:
            dict: Created task.

        Raises:
            HTTPException: If creation fails.
        """
        task_dict = task_create.model_dump(exclude_unset=True)
        task_dict['created_at'] = task_dict.get('created_at', datetime.now(timezone.utc))
        task_dict['updated_at'] = task_dict.get('updated_at', datetime.now(timezone.utc))
        task = TaskModel(**task_dict)
        task_document = task.model_dump(by_alias=True)
        logger.info(f"Creating task: {task_dict}")
        result = await self.task_repository.create(task_document)
        if result  is not None:
            logger.info(f"Task created successfully: {task_document}")
            return task_document
        else:
            logger.error("Task creation failed")
            raise HTTPException(status_code=400, detail="Task creation failed")

    async def get_task(self, task_id: str) -> Dict:
        """
        Get a task by ID.

        Args:
            task_id (str): Task ID.

        Returns:
            dict: Task details.

        Raises:
            HTTPException: If not found.
        """
        task = await self.task_repository.get(task_id)
        if task:
            return task
        else:
            raise HTTPException(status_code=404, detail="Task not found")

    async def update_task(self, task_id: str, task_update: Union[UpdateTaskSchema,AssignTaskSchema]) -> Dict:
        """
        Update a task by ID.

        Args:
            task_id (str): Task ID.
            task_update (UpdateTaskSchema): Fields to update.

        Returns:
            dict: Updated task.

        Raises:
            HTTPException: If not found or no changes.
        """
        document=task_update.model_dump(exclude_unset=True)
        updated = await self.task_repository.update(task_id, document)
        if updated:
            updated_task = await self.task_repository.get(task_id)
            return updated_task
        else:
            raise HTTPException(status_code=404, detail="Task not found or no changes made")

    async def delete_task(self, task_id: str) -> Dict:
        """
        Delete a task by ID.

        Args:
            task_id (str): Task ID.

        Returns:
            dict: Success message.

        Raises:
            HTTPException: If not found.
        """
        deleted = await self.task_repository.delete(task_id)
        if deleted:
            return {"message": "Task deleted successfully"}
        else:
            raise HTTPException(status_code=404, detail="Task not found")
        
    async def get_all_tasks(self) -> list[Dict]:
        """
        Get all tasks.

        Returns:
            list[dict]: All tasks.

        Raises:
            HTTPException: If none found.
        """
        tasks = await self.task_repository.get_all()
        if not tasks:
            raise HTTPException(status_code=404, detail="No tasks found")
        return tasks

    async def get_tasks_by_member(self, assigned_to: str) -> List[Dict]:
        """
        Get all tasks assigned to a member.

        Args:
            assigned_to (str): Member ObjectId as string.

        Returns:
            list[dict]: Tasks assigned to the member.

        Raises:
            HTTPException: If none found.
        """
        tasks = await self.task_repository.get_tasks_by_member(assigned_to)
        if not tasks:
            raise HTTPException(status_code=404, detail="No tasks found for this member")
        return [ResponseTaskSchema(**task) for task in tasks]

    async def update_task_status(self, task_id: str, task_update: UpdateTaskSchema) -> Dict:
        """
        Update the status of a task.

        Args:
            task_id (str): Task ID.
            task_update (UpdateTaskSchema): Status update.

        Returns:
            dict: Updated task.

        Raises:
            HTTPException: If not found or no changes.
        """
        document = task_update.dict(exclude_unset=True)
        result = await self.task_repository.update_task(task_id, document)
        if hasattr(result, 'modified_count') and result.modified_count > 0:
            updated_task = await self.task_repository.get_task(task_id)
            return updated_task
        else:
            raise HTTPException(status_code=404, detail="Task not found or no changes made")


def get_task_service(db: AsyncDatabase = Depends(get_database)):
    """
    Dependency provider for TaskService.

    Args:
        db (AsyncDatabase): Async database instance.

    Returns:
        TaskService: Service instance.
    """
    task_repository = TaskRepository(db)
    return TaskService(task_repository)