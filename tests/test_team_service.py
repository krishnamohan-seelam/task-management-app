import pytest
from unittest.mock import AsyncMock
from app.services.team_service import TeamService
from app.repositories.team_repository import TeamRepository
from app.models.team import CreateTeamSchema

@pytest.fixture
def team_service(get_mongo_db):
    repository = TeamRepository(get_mongo_db)
    return TeamService(repository)


@pytest.mark.asyncio
async def test_create_team_success(team_service):
    schema = CreateTeamSchema(name='Team', member_ids=[])
    result = await team_service.create_team(schema)
    assert result['name'] == 'Team'
