# Example pytest for TeamModel validation
import pytest
from app.models.team import TeamModel, Role
from bson import ObjectId


def test_team_with_no_members():
    team = TeamModel(name="Alpha Team", member_ids=[])
    assert team.name == "Alpha Team"
    assert team.member_ids == []


def test_team_with_one_member():
    member_id = str(ObjectId())
    team = TeamModel(name="Beta Team", member_ids=[member_id])
    assert team.member_ids == [member_id]


def test_team_with_too_many_members_raises():
    member_ids = [str(ObjectId()) for _ in range(6)]
    with pytest.raises(ValueError):
        TeamModel(name="Delta Team", member_ids=member_ids)
