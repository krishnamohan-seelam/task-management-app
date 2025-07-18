import pytest
from unittest.mock import AsyncMock
from app.services.team_service import TeamService
from app.models.team import CreateTeamSchema

@pytest.mark.asyncio
async def test_create_team_success():
    repo = AsyncMock()
    repo.create_team = AsyncMock(return_value=AsyncMock(inserted_id='1'))
    service = TeamService(team_repository=repo)
    schema = CreateTeamSchema(name='Team', member_ids=[])
    result = await service.create_team(schema)
    assert result['name'] == 'Team'

@pytest.mark.asyncio
async def test_create_team_failure():
    repo = AsyncMock()
    repo.create_team = AsyncMock(return_value=AsyncMock(inserted_id=None))
    service = TeamService(team_repository=repo)
    schema = CreateTeamSchema(name='Team', member_ids=[])
    with pytest.raises(Exception):
        await service.create_team(schema)
