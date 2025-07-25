import pytest
from mongomock_motor import AsyncMongoMockClient 
from config.database import get_database
from app.dependencies.auth import require_roles,get_current_user
from app.main import app
from fastapi.testclient import TestClient
from bson import ObjectId
from datetime import datetime, timezone
from _pytest.monkeypatch import MonkeyPatch

MOCK_PROJECT_MANAGER_USER = {
    "id": "1",
    "name": "Test Project Manager",
    "email": "project_manager@example.com",
    "role": "project_manager",
}

MOCK_TEAM_LEAD_USER = {
    "id": "2",
    "name": "Test Team Lead",
    "email": "team_lead@example.com",
    "role": "team_lead",
}

MOCK_DEVELOPER_USER = {
    "id": "3",
    "name": "Test Developer",
    "email": "developer@example.com",
    "role": "developer",
}

# --- Override Dependency Function ---
def override_require_roles(mock_user: dict):
    """Overrides the role requirement with a specific mock user."""
    def _override_require_roles():
        return  {"user_id": mock_user['id'], "role": mock_user['role']}
    return _override_require_roles

def override_get_current_user(mock_user:dict):
    def _override_get_current_user():
        return {"user_id": mock_user['id'], "role": mock_user['role']}
    return _override_get_current_user

 


async def mock_mongo():
    client = AsyncMongoMockClient()
    db =client['task_management_dev']
    await setup_mock_db(db)
    yield db
    client.close()

async def setup_mock_db(db):
   
    # Insert mock data
    mock_member_id = ObjectId()
    mock_team_id = ObjectId()
    mock_task_id = ObjectId()

    # Create team member
    await db['team_members'].insert_one({
        "_id": mock_member_id,
        "name": "Test Member",
        "email": "test@example.com",
        "role": "developer",
        "teams": [mock_team_id]
    })

    # Create team
    await db['teams'].insert_one({
        "_id": mock_team_id,
        "name": "Test Team",
        "member_ids": [mock_member_id],
        "project_manager": ObjectId()
    })

    # Create task
    await db['tasks'].insert_one({
        "_id": mock_task_id,
        "title": "Test Task Title",
        "description": "Test Task Description",
        "status": "pending",
        "assigned_to": mock_member_id,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
        "team_id": mock_team_id
    })
    
    # Create a mock implementation of the team_tasks_view
    # Since mongomock_motor doesn't fully support MongoDB views
    await db['team_tasks_view'].insert_one({
        "_id": mock_task_id,
        "title": "Test Task Title",
        "status": "pending",
        "team_name": "Test Team",
        "team_member": "Test Member"
    })

# --- Role-Specific Client Fixtures ---
@pytest.fixture(scope="function")
def project_manager_client():
    """Provides a TestClient instance with a Project Manager role."""
    # Temporarily override the dependency for this fixture's scope
    app.dependency_overrides[get_current_user] = override_get_current_user(MOCK_PROJECT_MANAGER_USER)
    app.dependency_overrides[get_database] = mock_mongo
    with TestClient(app) as client:
        yield client
    # Clean up the dependency override after the tests in this module finish
    app.dependency_overrides = {}

@pytest.fixture(scope="function")
def team_lead_client():
    """Provides a TestClient instance with a Team Lead role."""
  
    app.dependency_overrides[get_current_user] = override_get_current_user(MOCK_TEAM_LEAD_USER) 
    app.dependency_overrides[get_database] = mock_mongo
    with TestClient(app) as client:
        yield client
    app.dependency_overrides = {}

@pytest.fixture(scope="function")
def developer_client():
    """Provides a TestClient instance with a Developer role."""
    #app.dependency_overrides[require_roles] = override_require_roles(MOCK_DEVELOPER_USER)
    app.dependency_overrides[get_current_user] = override_get_current_user(MOCK_DEVELOPER_USER) 
    app.dependency_overrides[get_database] = mock_mongo
    with TestClient(app) as client:
        yield client
    app.dependency_overrides = {}

# --- Example of a generic client fixture (no role override) ---
@pytest.fixture(scope="module")
def generic_client():
    """Provides a TestClient instance without any role override."""
    with TestClient(app) as client:
        yield client

