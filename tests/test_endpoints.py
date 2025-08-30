import pytest
 


@pytest.mark.asyncio
async def test_get_all_tasks(project_manager_client):
    response = project_manager_client.get("/project-manager/tasks")
    assert response.status_code == 200
    assert len(response.json()["tasks"]) == 1
    


@pytest.mark.asyncio
async def test_create_task(team_lead_client):
    data = {"title": "Test Task", "status": "pending", "assigned_to": "1"}
    response = team_lead_client.post("/team-lead/tasks/", json=data)
    assert response.status_code == 200
    assert response.json()["title"] == "Test Task"

@pytest.mark.asyncio
async def test_create_team_member(project_manager_client):
    data = {"name": "John", "email": "john@example.com", "role": "developer"}
    response = project_manager_client.post("/project-manager/team-member", json=data)
    assert response.status_code == 200
    assert response.json()["name"] == "John"
