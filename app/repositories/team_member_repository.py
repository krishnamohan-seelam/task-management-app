from pymongo import MongoClient
from pymongo.asynchronous.cursor import AsyncCursor
from bson import ObjectId
from typing import List, Dict, Optional
from app.models.team import TeamModel, TeamMemberModel
from .abstract_repository import AbstractRepository
from app.logging_config import logger

class TeamMemberRepository(AbstractRepository):
    def __init__(self, db):
        self.collection = db['team_members']
        logger.info("TeamMemberRepository initialized.")

    async def create(self, obj: Dict) -> str:
        logger.info(f"Inserting new team member: {obj}")
        result = await self.collection.insert_one(obj)
        return str(result.inserted_id)

    async def get(self, obj_id: str) -> Optional[Dict]:
        """
        Get a team member by ID.

        Args:
            team_member_id (str): Member ID.

        Returns:
            dict or None: Member document.
        """
        return await self.collection.find_one({"_id": ObjectId(obj_id)})

    async def update(self, obj_id: str, obj_update: Dict) -> bool:
        """
        Update a team member.

        Args:
            team_member_id (str): Member ID.
            update_data (dict): Fields to update.

        Returns:
            bool: True if updated.
        """
        result = await self.collection.update_one({"_id": ObjectId(obj_id)}, {"$set": obj_update})
        return result.modified_count > 0

    async def delete(self, obj_id: str) -> bool:
        """
        Delete a team member.

        Args:
            team_member_id (str): Member ID.

        Returns:
            bool: True if deleted.
        """
        result = await self.collection.delete_one({"_id": ObjectId(obj_id)})
        return result.deleted_count > 0

    async def get_all(self) -> List[Dict]:
        """
        Get all team members.

        Returns:
            List[dict]: All members.
        """
        cursor = self.collection.find()
        return await cursor.to_list(length=None)

 
    async def get_team_members_by_role(self, role: str) -> List[Dict]:
        """
        Get team members by role.

        Args:
            role (str): Role to filter by.

        Returns:
            List[dict]: Team members with the specified role.
        """
        print(f"Fetching team members with role: {role}")
        cursor = self.collection.find({"role": role})
        return await cursor.to_list(length=None)
    
    

    # Legacy methods call new abstract methods
    async def create_team_member(self, team_member_data: Dict) -> str:
        return await self.create(team_member_data)

    async def get_team_member_by_id(self, team_member_id: str) -> Optional[Dict]:
        return await self.get(team_member_id)

    async def update_team_member(self, team_member_id: str, update_data: Dict) -> bool:
        return await self.update(team_member_id, update_data)

    async def delete_team_member(self, team_member_id: str) -> bool:
        return await self.delete(team_member_id)

    async def get_all_team_members(self) -> List[Dict]:
        return await self.get_all()

    async def get_team_member_by_email(self, email: str) -> Optional[Dict]:
        return await self.collection.find_one({"email": email})
