from pymongo import MongoClient
from pymongo.results import InsertOneResult
from pymongo.asynchronous.cursor import AsyncCursor
from bson import ObjectId
from typing import List, Dict, Optional
from app.models.team import TeamModel, TeamMemberModel
from .abstract_repository import AbstractRepository
from app.logging_config import logger
from app.utils import UpdateResult


class TeamRepository(AbstractRepository):
    def __init__(self, db):
        self.collection = db["teams"]
        self.teams_view = db["teams_view"]
        logger.info("TeamRepository initialized.")

    async def create(self, obj: Dict) -> str:
        logger.info(f"Inserting new team: {obj}")
        result = await self.collection.insert_one(obj)
        if not isinstance(result, InsertOneResult) or not result.inserted_id:
            logger.error("Failed to insert team")
            raise Exception("Failed to insert team")
        return str(result.inserted_id)

    async def get(self, obj_id: str) -> Optional[Dict]:
        return await self.teams_view.find_one({"_id": ObjectId(obj_id)})

    async def update(self, obj_id: str, obj_update: Dict) -> bool:
        result = await self.collection.update_one(
            {"_id": ObjectId(obj_id)}, {"$set": obj_update}
        )
        if result.matched_count == 0:
            logger.warning(f"No team found with ID: {obj_id}")

         
        if result.modified_count == 0:
            logger.info(f"No changes made to team with ID: {obj_id}")

        logger.info(f"Successfully updated team with ID: {obj_id}")
        return UpdateResult(matched=result.matched_count > 0, modified=result.modified_count > 0) 

    async def delete(self, obj_id: str) -> bool:
        result = await self.collection.delete_one({"_id": ObjectId(obj_id)})
        if result.deleted_count == 0:
            logger.warning(f"No team found with ID: {obj_id} to delete")
            return False
        logger.info(f"Deleted team with ID: {obj_id}")
        if result.deleted_count > 1:
            logger.warning(
                f"Multiple teams deleted with ID: {obj_id}, expected only one"
            )
        else:
            logger.info(f"Successfully deleted team with ID: {obj_id}")
        return result.deleted_count > 0

    async def get_all(self) -> List[Dict]:
        cursor = self.teams_view.find()
        return await cursor.to_list(length=None)

    # Legacy methods call new abstract methods
    async def create_team(self, team_data: Dict) -> str:
        return await self.create(team_data)

    async def get_team_by_id(self, team_id: str) -> Optional[Dict]:
        return await self.get(team_id)

    async def update_team(self, team_id: str, update_data: Dict) -> bool:
        return await self.update(team_id, update_data)

    async def delete_team(self, team_id: str) -> bool:
        return await self.delete(team_id)

    async def get_all_teams(self) -> List[Dict]:
        return await self.get_all()

    async def add_team_member(self, team_id: str, member_id: str) -> bool:
        """
        Add a member's ObjectId to a team.

        Args:
            team_id (str): Team ID.
            member_id (str): Member ID.

        Returns:
            bool: True if added.
        """
        result = await self.collection.update_one(
            {"_id": ObjectId(team_id)},
            {"$addToSet": {"member_ids": ObjectId(member_id)}},
        )
        if result.matched_count == 0:
            logger.warning(f"No team found with ID: {team_id} to add member")
            return False
        if result.modified_count == 0:
            logger.info(
                f"Member with ID: {member_id} already exists in team with ID: {team_id}"
            )
            return False
        logger.info(f"Added member with ID: {member_id} to team with ID: {team_id}")
        return result.modified_count > 0

    async def remove_team_member(self, team_id: str, member_id: str) -> bool:
        """
        Remove a member's ObjectId from a team.

        Args:
            team_id (str): Team ID.
            member_id (str): Member ID.

        Returns:
            bool: True if removed.
        """
        result = await self.collection.update_one(
            {"_id": ObjectId(team_id)}, {"$pull": {"member_ids": ObjectId(member_id)}}
        )
        if result.matched_count == 0:
            logger.warning(f"No team found with ID: {team_id} to remove member")
            return False
        if result.modified_count == 0:
            logger.info(
                f"Member with ID: {member_id} not found in team with ID: {team_id}"
            )
            return False
        logger.info(f"Removed member with ID: {member_id} from team with ID: {team_id}")
        return result.modified_count > 0

    async def get_team_members(self, team_id: str) -> dict:
        """
        Get all member ObjectIds for a team.

        Args:
            team_id (str): Team ID.

        Returns:
            List[dict]: Team members.
        """
        team = await self.get(team_id)
        if not team:
            logger.warning(f"No team found with ID: {team_id}")
            return {}
        logger.info(f"Retrieved members for team with ID: {team_id}")
        return team

    async def get_all_team_members(self) -> list:
        """
        Get all unique member ObjectIds across all teams.

        Returns:
            List[dict]: All team members.
        """
        cursor = self.collection.find({}, {"member_ids": 1})
        teams = await cursor.to_list(length=None)
        member_ids = set()
        for team in teams:
            member_ids.update(team.get("member_ids", []))
        return list(member_ids)
