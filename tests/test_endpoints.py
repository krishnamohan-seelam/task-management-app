import pytest
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def mock_db_get(monkeypatch, mock_db):
    monkeypatch.setattr("config.database.get_database", lambda: mock_db)

@pytest.mark.asyncio
async def test_get_all_tasks(client, mock_db_get):
    response = client.get("/tasks")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

@pytest.mark.asyncio
async def test_create_task(client, mock_db_get):
    data = {"title": "Test Task", "status": "pending", "assigned_to": "1"}
    response = client.post("/tasks/", json=data)
    assert response.status_code == 200
    assert response.json()["title"] == "Test Task"

@pytest.mark.asyncio
async def test_create_team_member(client, mock_db_get):
    data = {"name": "John", "email": "john@example.com", "role": "developer"}
    response = client.post("/team-member", json=data)
    assert response.status_code == 200
    assert response.json()["name"] == "John"
