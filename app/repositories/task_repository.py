from pymongo import MongoClient
from bson import ObjectId
from typing import List, Dict
from app.models.task import TaskModel
from pymongo.asynchronous.cursor import AsyncCursor
from .abstract_repository import AbstractRepository
from app.logging_config import logger


class TaskRepository(AbstractRepository):
    def __init__(self, db):
        self.collection = db["tasks"]
        self.view = db["team_tasks_view"]
        logger.info("TaskRepository initialized.")

    async def create(self, obj: Dict) -> str:
        logger.info(f"Inserting new task: {obj}")
        # Ensure obj is serialized correctly for MongoDB
        return await self.collection.insert_one(obj)

    async def get(self, obj_id: str) -> Dict:
        """
        Get a task by ID.

        Args:
            obj_id (str): Task ID.

        Returns:
            dict: Task document.
        """
        return await self.collection.find_one({"_id": ObjectId(obj_id)})

    async def update(self, obj_id: str, obj_update: Dict) -> bool:
        """
        Update a task.

        Args:
            obj_id (str): Task ID.
            obj_update (TaskModel): Fields to update.

        Returns:
            bool: True if updated.
        """
        result = await self.collection.update_one(
            {"_id": ObjectId(obj_id)}, {"$set": obj_update}
        )
        return result.modified_count > 0

    async def delete(self, obj_id: str) -> bool:
        """
        Delete a task.

        Args:
            task_id (str): Task ID.

        Returns:
            bool: True if deleted.
        """
        logger.info(f"Deleting task with ID: {obj_id}")
        result = await self.collection.delete_one({"_id": ObjectId(obj_id)})
        return result.deleted_count > 0

    async def get_all(self) -> list:
        """
        Get all tasks.

        Returns:
            list: All tasks.
        """
        results = []
        cursor = self.view.find()
        async for task in cursor:
            results.append(task)
        return results

    def get_all_tasks2(self) -> AsyncCursor:
        """
        Get all tasks (cursor).

        Returns:
            AsyncCursor: Cursor for all tasks.
        """
        return self.collection.find()

    async def get_tasks_by_member(self, assigned_to: str) -> list:
        """
        Get all tasks assigned to a member by ObjectId.

        Args:
            assigned_to (str): Member ObjectId as string.

        Returns:
            list: Tasks assigned to the member.
        """
        cursor = self.collection.find({"assigned_to": assigned_to})
        results = []
        async for task in cursor:
            results.append(task)
        return results

    # Keep legacy methods for backward compatibility or refactor usage in codebase
    async def create_task(self, task: Dict) -> str:
        return await self.create(task)

    async def get_task(self, task_id: str) -> Dict:
        return await self.get(task_id)

    async def update_task(self, task_id: str, task_update: Dict) -> bool:
        return await self.update(task_id, task_update)

    async def delete_task(self, task_id: str) -> bool:
        return await self.delete(task_id)

    async def get_all_tasks(self) -> list:
        return await self.get_all()
