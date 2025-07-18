from typing import List, Dict, Optional
from fastapi import Depends,HTTPException
from app.repositories.team_member_repository import TeamMemberRepository
from app.models.team import TeamMemberModel,ResponseTeamSchema, AddTeamMembersSchema, CreateTeamMemberSchema,ResponseTeamMemberSchema,ResponseTeamMemberSchema, ResponseTeamMembersCollection
from config.database import get_database
from app.logging_config import logger

from pymongo.asynchronous.database import AsyncDatabase
from fastapi import HTTPException

class TeamMemberService:
    def __init__(self, team_member_repository: TeamMemberRepository):
        self.team_member_repository = team_member_repository
        logger.info("TeamMemberService initialized.")

    async def create_team_member(self, team_member_data: CreateTeamMemberSchema) -> dict:
        """
        Create a new team member.

        Args:
            team_member_data (CreateTeamMemberSchema): Member details.

        Returns:
            dict: Created member.

        Raises:
            HTTPException: If creation fails.
        """
        if not isinstance(team_member_data, CreateTeamMemberSchema):
            raise HTTPException(status_code=400, detail="Invalid team member data")
        # Convert the Pydantic model to a dictionary

        team_member_data = team_member_data.dict(exclude_unset=True)
        team_member = TeamMemberModel(**team_member_data)
        document = team_member.model_dump(by_alias=True)

        logger.info(f"Creating team member: {team_member_data}")
        result = await self.team_member_repository.create_team_member(document)
        
        if not result:
            logger.error("Team member creation failed")
            raise HTTPException(status_code=400, detail="Team member creation failed")
        logger.info(f"Team member created successfully: {document}")
        return document


    async def get_team_member_by_id(self, team_member_id: str) -> Optional[dict]:
        member = await self.team_member_repository.get_team_member_by_id(team_member_id)
        return member

    async def get_all_team_members(self) -> Optional[List[dict]]:
        """
        Get all team members.

        Returns:
            List[dict]: All members.

        Raises:
            HTTPException: If none found.
        """
        result = await self.team_member_repository.get_all_team_members()
        if not result:
            raise HTTPException(status_code=404, detail="No team members found")
        members = [member_dict for member_dict in result]
        return members

    async def update_team_member(self, team_member_id: str, update_data: Dict) -> bool:
        """
        Update a team member.

        Args:
            team_member_id (str): Member ID.
            update_data (dict): Fields to update.

        Returns:
            bool: True if updated.

        Raises:
            HTTPException: If not found or not updated.
        """
        updated = await self.team_member_repository.update_team_member(team_member_id, update_data)
        if not updated:
            raise HTTPException(status_code=404, detail="Team member not found or not updated")
        return updated

    async def delete_team_member(self, team_member_id: str) -> bool:
        """
        Delete a team member.

        Args:
            team_member_id (str): Member ID.

        Returns:
            bool: True if deleted.

        Raises:
            HTTPException: If not found or not deleted.
        """
        deleted = await self.team_member_repository.delete_team_member(team_member_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Team member not found or not deleted")
        return deleted

    async def get_team_member_by_email(self, email: str) -> Optional[dict]:
        """
        Get a team member by email.
        """
        return await self.team_member_repository.get_team_member_by_email(email)
    
    async def get_team_members_by_role(self, role: str) -> List[dict]:
        """
        Get team members by role.

        Args:
            role (str): Role to filter by.

        Returns:
            List[dict]: Team members with the specified role.
        """
        members = await self.team_member_repository.get_team_members_by_role(role)
        if not members:
            raise HTTPException(status_code=404, detail="No team members found with the specified role")
        return members


def get_team_member_service(db: AsyncDatabase = Depends(get_database)):
    """
    Dependency provider for TeamMemberService.

    Args:
        db (AsyncDatabase): Async database instance.

    Returns:
        TeamMemberService: Service instance.
    """
    team_member_repository = TeamMemberRepository(db)
    return TeamMemberService(team_member_repository)