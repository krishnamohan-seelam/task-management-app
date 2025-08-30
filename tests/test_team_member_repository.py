import pytest
from unittest.mock import AsyncMock
from bson import ObjectId
from app.repositories.team_member_repository import TeamMemberRepository


@pytest.fixture
def repo(get_mongo_db):
    return TeamMemberRepository(get_mongo_db)

@pytest.mark.asyncio
async def test_create_team_member(repo):
    inserted_id = await repo.create({'name': 'John'})
    test_result = await repo.get(inserted_id)
    assert test_result['name'] == 'John'

@pytest.mark.asyncio
async def test_get_team_member_by_id(repo):
    obj_id = ObjectId()
    repo.collection.find_one = AsyncMock(return_value={'_id': obj_id, 'name': 'John'})
    result = await repo.get_team_member_by_id(str(obj_id))
    repo.collection.find_one.assert_called_once()
