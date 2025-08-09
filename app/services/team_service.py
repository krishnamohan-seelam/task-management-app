from pymongo.asynchronous.database import AsyncDatabase
from fastapi import Depends,HTTPException
from config.database import get_database
from app.models.team import TeamModel,CreateTeamSchema, ResponseTeamSchema, UpdateTeamSchema
from app.repositories.team_repository import TeamRepository
from typing import List, Optional,Dict
from app.logging_config import logger



class TeamService:  
    # This code defines a TeamService class that provides methods for managing teams in a task management application.
    # It includes methods for creating, retrieving, updating, and deleting teams, as well as managing team members.
    # The service interacts with a TeamRepository to perform database operations and raises HTTP exceptions for error handling.
    # The service also includes methods to retrieve teams by lead and update team members.
    # The TeamService class is designed to be used in a FastAPI application, allowing for easy integration with web endpoints.
    # The service uses Pydantic schemas for data validation and serialization, ensuring that the data conforms to the expected structure.
    # The service is initialized with a TeamRepository instance, which can be provided or created using the get_database function. 

    def __init__(self, team_repository: TeamRepository = None):
        self.team_repository = team_repository
        logger.info("TeamService initialized.")
        
    async def create_team(self, team_create: CreateTeamSchema) -> Dict:
        try:
            team_dict = team_create.model_dump(exclude_unset=True)
            team = TeamModel(**team_dict)
            team_document = team.model_dump(by_alias=True)
            result = await self.team_repository.create_team(team_document)
            
            if result is not None:
                logger.info(f"Team created successfully: {team_document}")
                return team_document
            else:
                logger.error("Team creation failed: No result returned")
                raise HTTPException(status_code=400, detail="Team creation failed")
        except ValueError as ve:
            logger.error(f"Validation error: {str(ve)}")
            raise HTTPException(status_code=422, detail=str(ve))
        except Exception as e:
            logger.error(f"Unexpected error creating team: {str(e)}")
            raise HTTPException(status_code=500, detail="Internal server error")

    async def get_team(self, team_id: str) -> Dict:
        """
        Retrieve a team by its ID.

        Args:
            team_id (str): Team ID.

        Returns:
            dict: Team details.

        Raises:
            HTTPException: If not found.
        """
        team = await self.team_repository.get_team_by_id(team_id)
        if team:
            return team
        else:
            raise HTTPException(status_code=404, detail="Team not found")
    
    async def get_all_teams(self) -> List[Dict]:
        """
        Retrieve all teams.

        Returns:
            List[dict]: List of all teams.
        """
        teams = await self.team_repository.get_all_teams()
        return teams
    
    async def update_team(self, team_id: str, team_update: UpdateTeamSchema) -> Dict:
        """
        Update a team's details only if changes are detected.

        Args:
            team_id (str): Team ID.
            team_update (UpdateTeamSchema): Fields to update.

        Returns:
            dict: Updated team.

        Raises:
            HTTPException: If not found or update fails.
        """
        document = team_update.model_dump(exclude_unset=True)
        update_result = await self.team_repository.update(team_id, document)

        if not update_result.matched:
            return {
                "team": None,
                "updated": False
            }

        return {
            "team": await self.team_repository.get(team_id),
            "updated": True
        }
    
    async def delete_team(self, team_id: str) -> bool:
        """
        Delete a team by its ID.

        Args:
            team_id (str): Team ID.

        Returns:
            bool: True if deleted.

        Raises:
            HTTPException: If not found.
        """
        result = await self.team_repository.delete_team(team_id)
        if result:
            return True
        else:
            raise HTTPException(status_code=404, detail="Team not found or deletion failed")
        
    async def add_team_member(self, team_id: str, member_data: dict) -> bool:
        """
        Add a member to a team.

        Args:
            team_id (str): Team ID.
            member_data (dict): Member details.

        Returns:
            bool: True if added.

        Raises:
            HTTPException: If not found or fails.
        """
        result = await self.team_repository.add_team_member(team_id, member_data)
        if result:
            return True
        else:
            raise HTTPException(status_code=404, detail="Team not found or member addition failed")
        
    async def remove_team_member(self, team_id: str, member_id: str) -> bool:
        """
        Remove a member from a team.

        Args:
            team_id (str): Team ID.
            member_id (str): Member ID.

        Returns:
            bool: True if removed.

        Raises:
            HTTPException: If not found or fails.
        """
        result = await self.team_repository.remove_team_member(team_id, member_id)
        if result:
            return True
        else:
            raise HTTPException(status_code=404, detail="Team not found or member removal failed")
        
    async def get_team_members(self, team_id: str) -> List[dict]:
        """
        Get all members of a team.

        Args:
            team_id (str): Team ID.

        Returns:
            List[dict]: Team members.

        Raises:
            HTTPException: If not found.
        """
        members = await self.team_repository.get_team_members(team_id)
        if members is not None:
            return members
        else:
            raise HTTPException(status_code=404, detail="Team not found or no members found")
    
    async def get_all_team_members(self) -> List:
        """
        Get all team members across all teams.

        Returns:
            List: All team members.
        """
        members = await self.team_repository.get_all_team_members()
        return members
    
    async def get_team_by_name(self, team_name: str) -> Optional[Dict]:
        """
        Get a team by its name.

        Args:
            team_name (str): Team name.

        Returns:
            dict or None: Team details.

        Raises:
            HTTPException: If not found.
        """
        team = await self.team_repository.get_team_by_name(team_name)
        if team:
            return team
        else:
            raise HTTPException(status_code=404, detail="Team not found")
        
    async def update_team_member(self, team_id: str, member_id: str, member_data: dict) -> bool:
        """
        Update a member's details in a team.

        Args:
            team_id (str): Team ID.
            member_id (str): Member ID.
            member_data (dict): Updated details.

        Returns:
            bool: True if updated.

        Raises:
            HTTPException: If not found.
        """
        result = await self.team_repository.update_team_member(team_id, member_id, member_data)
        if result:
            return True
        else:
            raise HTTPException(status_code=404, detail="Team or member not found or update failed")
        
    async def get_team_by_lead(self, lead_id: str) -> List[Dict]:
        """
        Get all teams led by a specific team lead.

        Args:
            lead_id (str): Team lead ID.

        Returns:
            List[dict]: Teams led by the lead.

        Raises:
            HTTPException: If none found.
        """
        teams = await self.team_repository.get_team_by_lead(lead_id)
        if teams:
            return teams
        else:
            raise HTTPException(status_code=404, detail="No teams found for the specified lead")
    
    async def add_team_members(self, team_id: str, add_members_schema, team_lead_id: str) -> dict:
        """
        Add members to a team by their ObjectIds.
        """
        for member_id in add_members_schema.member_ids:
            await self.team_repository.add_team_member(team_id, member_id)
        updated_team = await self.team_repository.get_team_by_id(team_id)
        return updated_team

    async def get_team_members(self, team_id: str, team_member_repository) -> list:
        """
        Get full member details for a team using member_ids.
        """
        member_ids = await self.team_repository.get_team_members(team_id)
        if not member_ids:
            return []
        # Fetch member details from team_member collection
        members = []
        for member_id in member_ids:
            member = await team_member_repository.get_team_member_by_id(str(member_id))
            if member:
                members.append(member)
        return members



def get_team_service(db: AsyncDatabase = Depends(get_database)):
    """
    Dependency provider for TeamService.

    Args:
        db (AsyncDatabase): Async database instance.

    Returns:
        TeamService: Service instance.
    """
    team_repository = TeamRepository(db)
    return TeamService(team_repository)