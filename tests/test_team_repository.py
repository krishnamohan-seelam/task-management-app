import pytest
from unittest.mock import AsyncMock
from bson import ObjectId
from app.repositories.team_repository import TeamRepository

@pytest.fixture
def repo():
    db = {'teams': AsyncMock()}
    return TeamRepository(db)

@pytest.mark.asyncio
async def test_create_team(repo):

    repo.collection.insert_one = AsyncMock(return_value=AsyncMock(inserted_id='123'))
    result = await repo.create_team({'name': 'Team'})
    repo.collection.insert_one.assert_called_once()

@pytest.mark.asyncio
async def test_get_team_by_id(repo):
    obj_id = ObjectId()
    repo.collection.find_one = AsyncMock(return_value={'_id': obj_id, 'name': 'Team'})
    result = await repo.get_team_by_id(str(obj_id))
    repo.collection.find_one.assert_called_once()
