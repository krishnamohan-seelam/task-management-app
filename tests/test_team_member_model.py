# Example pytest for TeamMemberModel validation
import pytest
from app.models.team import TeamMemberModel, Role

def test_valid_team_member():
    member = TeamMemberModel(name="John", email="john@example.com", role=Role.DEVELOPER, hashed_password="hashed_secret")
    assert member.role == Role.DEVELOPER

def test_invalid_role_raises():
    with pytest.raises(ValueError):
        TeamMemberModel(name="Jane", email="jane@example.com", role="invalid", hashed_password="hashed_secret")
