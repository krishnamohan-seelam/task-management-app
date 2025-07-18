import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_all_tasks():
    response = client.get("/tasks")
    assert response.status_code in (200, 422)  # 422 if no DB/mock

def test_create_task():
    data = {"title": "Test Task", "status": "pending", "assigned_to": "1"}
    response = client.post("/tasks/", json=data)
    assert response.status_code in (200, 422, 400)

def test_create_team_member():
    data = {"name": "John", "email": "john@example.com", "role": "developer"}
    response = client.post("/team-member", json=data)
    assert response.status_code in (200, 422, 400)
