import pytest
from app.models.task import CreateTaskSchema, AssignTaskSchema, UpdateTaskSchema, ResponseTaskSchema
from app.models.team import CreateTeamSchema, UpdateTeamSchema, ResponseTeamSchema, AddTeamMembersSchema, CreateTeamMemberSchema, ResponseTeamMemberSchema

def test_create_task_schema():
    schema = CreateTaskSchema(title='Task', status='pending', assigned_to='1')
    assert schema.title == 'Task'

def test_assign_task_schema():
    schema = AssignTaskSchema(assigned_to='1')
    assert schema.assigned_to == '1'

def test_update_task_schema():
    schema = UpdateTaskSchema(title='Updated')
    assert schema.title == 'Updated'

def test_create_team_schema():
    schema = CreateTeamSchema(name='Team', member_ids=[])
    assert schema.name == 'Team'

def test_add_team_members_schema():
    schema = AddTeamMembersSchema(member_ids=['1'])
    assert schema.member_ids == ['1']

def test_create_team_member_schema():
    schema = CreateTeamMemberSchema(name='John', email='john@example.com', role='developer', password='password123')
    assert schema.name == 'John'
