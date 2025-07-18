from fastapi import APIRouter, HTTPException, Depends
from typing import List

from app.models.task import CreateTaskSchema, ResponseTaskSchema, UpdateTaskSchema,AssignTaskSchema
from app.models.team import (
    CreateTeamSchema,
    CreateTeamMemberSchema,
    ResponseTeamMemberSchema,
    ResponseTeamMembersCollection,
    AddTeamMembersSchema,
    ResponseTeamSchema,
)
from app.services.task_service import TaskService, get_task_service
from app.services.team_member_service import TeamMemberService, get_team_member_service
from app.services.team_service import TeamService, get_team_service
from app.logging_config import logger
from app.dependencies.auth import require_roles

router = APIRouter(
    dependencies=[Depends(require_roles("team_lead"))]
)


@router.post("/tasks/", response_model=ResponseTaskSchema,response_model_by_alias=False)
async def create_task(task: CreateTaskSchema,task_service: TaskService = Depends(get_task_service)):
    logger.info(f"[Team Lead] Creating task: {task}")
    """
    Creates a new task using the provided task data.

    Args:
        task (CreateTaskSchema): The schema containing the details of the task to be created.
        task_service (TaskService, optional): The service responsible for handling task-related operations. 
            Defaults to an instance provided by the `get_task_service` dependency.

    Returns:
        dict: The created task details as returned by the task service.
    """
    return await task_service.create_task(task)

@router.post("/assign-task/{task_id}", response_model=ResponseTaskSchema,response_model_by_alias=False)
async def assign_task(task_id: str, task: AssignTaskSchema,task_service: TaskService = Depends(get_task_service)):
    """
    Assign a task to a user.
    Args:
        task (AssignTaskSchema): The schema containing the details of the task to be assigned.
        task_service (TaskService, optional): The service responsible for handling task-related operations. 
            Defaults to a dependency injection of `get_task_service`.
    Returns:
        The assigned task object after successful assignment.
    Raises:
        HTTPException: If an error occurs during task assignment, an HTTP 400 error is raised with the error details.
    """
    try:
        task =  await task_service.update_task(task_id,task)
        return task
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/tasks", response_model=List[ResponseTaskSchema])
async def get_assigned_tasks(team_lead_id: str, task_service: TaskService = Depends(get_task_service)):
    """
    Retrieve all tasks assigned to a specific team lead.

    Args:
        team_lead_id (str): The unique identifier of the team lead whose tasks are to be retrieved.
        task_service (TaskService, optional): Dependency-injected service for task operations.

    Returns:
        List[Task]: A list of tasks assigned to the specified team lead.
    """
    tasks = await task_service.get_tasks_by_team_lead(team_lead_id)
    return tasks


@router.put("/update-task/{task_id}", response_model=ResponseTaskSchema)
async def update_task(task_id: str, task_update: UpdateTaskSchema, task_service: TaskService = Depends(get_task_service)):
    updated_task = await task_service.update_task(task_id, task_update)
    if not updated_task:
        raise HTTPException(status_code=404, detail="Task not found")
    return updated_task


@router.get("/track-tasks", response_model=List[ResponseTaskSchema])
async def track_tasks(task_service: TaskService = Depends(get_task_service)):
    tasks = await task_service.get_all_tasks()
    return tasks


@router.post("/add-team-members", response_model=ResponseTeamSchema)
async def add_team_members(
    team_id: str,
    members: AddTeamMembersSchema,
    team_lead_id: str,
    team_service: TeamService = Depends(get_team_service),
    team_member_service: TeamMemberService = Depends(get_team_member_service)
):
    updated_team = await team_service.add_team_members(team_id, members, team_lead_id)
    if not updated_team:
        raise HTTPException(status_code=400, detail="Adding team members failed")
    return updated_team



@router.get("/team-member/{team_member_id}", response_model=ResponseTeamMemberSchema)
async def get_team_member_by_id(
    team_member_id: str,
    team_member_service: TeamMemberService = Depends(get_team_member_service)
):
    member = await team_member_service.get_team_member_by_id(team_member_id)
    return member


@router.put("/team-member/{team_member_id}", response_model=ResponseTeamMemberSchema)
async def update_team_member(
    team_member_id: str,
    update_data: dict,
    team_member_service: TeamMemberService = Depends(get_team_member_service)
):
    updated = await team_member_service.update_team_member(team_member_id, update_data)
    if not updated:
        raise HTTPException(status_code=404, detail="Team member not found or not updated")
    member = await team_member_service.get_team_member_by_id(team_member_id)
    return member


@router.delete("/team-member/{team_member_id}")
async def delete_team_member(
    team_member_id: str,
    team_member_service: TeamMemberService = Depends(get_team_member_service)
):
    deleted = await team_member_service.delete_team_member(team_member_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Team member not found or not deleted")
    return {"detail": "Team member deleted successfully"}


@router.get("/team-members/{team_id}", response_model=ResponseTeamMembersCollection)
async def get_team_members(
    team_id: str,
    team_service: TeamService = Depends(get_team_service),
    team_member_service: TeamMemberService = Depends(get_team_member_service)
):
    members = await team_service.get_team_members(team_id, team_member_service.team_member_repository)
    return ResponseTeamMembersCollection(members=members)