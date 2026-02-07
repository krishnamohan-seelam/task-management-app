import pytest
from unittest.mock import AsyncMock
from app.services.team_member_service import TeamMemberService
from app.models.team import CreateTeamMemberSchema

@pytest.mark.asyncio
async def test_create_team_member_success():
    repo = AsyncMock()
    repo.create_team_member = AsyncMock(return_value='1')
    service = TeamMemberService(team_member_repository=repo)
    schema = CreateTeamMemberSchema(name='John', email='john@example.com', role='developer', password='password123')
    result = await service.create_team_member(schema)
    assert result['name'] == 'John'

@pytest.mark.asyncio
async def test_create_team_member_invalid():
    repo = AsyncMock()
    service = TeamMemberService(team_member_repository=repo)
    with pytest.raises(Exception):
        await service.create_team_member('invalid')
