import pytest
from unittest.mock import AsyncMock
from bson import ObjectId
from app.repositories.team_repository import TeamRepository

@pytest.fixture
def repo(get_mongo_db):
    return TeamRepository(get_mongo_db)

@pytest.mark.asyncio
async def test_create_team(repo):
    inserted_id = await repo.create({'name': 'Team'})
    test_result  = await repo.get(inserted_id)
    assert test_result['name'] == 'Team'
     

@pytest.mark.asyncio
async def test_get_team_by_id(repo):
    obj_id = ObjectId()
    repo.collection.find_one = AsyncMock(return_value={'_id': obj_id, 'name': 'Team'})
    result = await repo.get_team_by_id(str(obj_id))
    repo.collection.find_one.assert_called_once()
