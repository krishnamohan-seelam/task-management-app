import pytest
from unittest.mock import AsyncMock
from bson import ObjectId
from app.repositories.team_member_repository import TeamMemberRepository


@pytest.fixture
def repo():
    db = {'team_members': AsyncMock()}
    return TeamMemberRepository(db)

@pytest.mark.asyncio
async def test_create_team_member(repo):
 
    repo.collection.insert_one = AsyncMock(return_value=AsyncMock(inserted_id='123'))
    result = await repo.create_team_member({'name': 'John'})
    repo.collection.insert_one.assert_called_once()

@pytest.mark.asyncio
async def test_get_team_member_by_id(repo):
    obj_id = ObjectId()
    repo.collection.find_one = AsyncMock(return_value={'_id': obj_id, 'name': 'John'})
    result = await repo.get_team_member_by_id(str(obj_id))
    repo.collection.find_one.assert_called_once()
