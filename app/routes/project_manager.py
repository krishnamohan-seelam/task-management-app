from fastapi import APIRouter, HTTPException, Depends
from app.models.task import (
    CreateTaskSchema,
    TaskModel,
    AssignTaskSchema,
    ResponseTaskSchema,
    ResponseTeamTaskViewCollection,
)

from app.models.team import (
    CreateTeamSchema,
    ResponseTeamSchema,
    AddTeamMembersSchema,
    CreateTeamMemberSchema,
    ResponseTeamMemberSchema,
    ResponseTeamMembersCollection,
    UpdateTeamSchema,
    ResponseTeamCollection,
    TeamSchema,
)
from app.services.task_service import TaskService, get_task_service
from app.services.team_service import TeamService, get_team_service
from app.services.team_member_service import TeamMemberService, get_team_member_service
from app.logging_config import logger
from app.dependencies.auth import require_roles

from typing import List


router = APIRouter(dependencies=[Depends(require_roles("project_manager"))])


@router.get(
    "/tasks",
    response_model=ResponseTeamTaskViewCollection,
    response_model_by_alias=False,
)
async def get_all_tasks(task_service: TaskService = Depends(get_task_service)):
    logger.info("[Project Manager] Fetching all tasks.")
    try:
        tasks = await task_service.get_all_tasks()
        return ResponseTeamTaskViewCollection(tasks=tasks)
    except Exception as e:
        logger.error(f"Error fetching all tasks: {e}")
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/task/{task_id}", response_model=TaskModel)
async def get_task(task_id: str, task_service: TaskService = Depends(get_task_service)):
    """
    Retrieve a task by its ID.

    Args:
        task_id (str): The unique identifier of the task to retrieve.
        task_service (TaskService, optional): The service used to fetch the task.
            Defaults to a dependency injection of `get_task_service`.

    Returns:
        Task: The task object corresponding to the provided task_id.

    Raises:
        HTTPException: If the task is not found (404) or if an error occurs during retrieval (400).
    """
    try:
        task = await task_service.get_task(task_id)
        if task is None:
            raise HTTPException(status_code=404, detail="Task not found")
        return task
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post(
    "/team-member",
    response_model=ResponseTeamMemberSchema,
    response_model_by_alias=False,
)
async def create_team_member(
    member: CreateTeamMemberSchema,
    team_member_service: TeamMemberService = Depends(get_team_member_service),
):
    """
    Create a team member independently of a team.
    """
    created_member = await team_member_service.create_team_member(member)
    if not created_member:
        raise HTTPException(status_code=400, detail="Team member creation failed")
    return created_member


@router.post(
    "/add-team-members",
    response_model=ResponseTeamSchema,
    response_model_by_alias=False,
)
async def add_team_members(
    team_id: str,
    members: AddTeamMembersSchema,
    team_lead_id: str,
    team_service: TeamService = Depends(get_team_service),
):
    """
    Assign existing members to a team.
    """
    updated_team = await team_service.add_team_members(team_id, members, team_lead_id)
    if not updated_team:
        raise HTTPException(status_code=400, detail="Adding team members failed")
    return updated_team


@router.post(
    "/remove-team-members",
    response_model=ResponseTeamSchema,
    response_model_by_alias=False,
)
async def remove_team_members(
    team_id: str,
    members: AddTeamMembersSchema,
    team_service: TeamService = Depends(get_team_service),
):
    """
    Remove members from a team.
    """
    updated_team = await team_service.remove_team_members(team_id, members)
    if not updated_team:
        raise HTTPException(status_code=400, detail="Removing team members failed")
    return updated_team


@router.get(
    "/team-members/{team_id}",
    response_model=TeamSchema,
    response_model_by_alias=False,
)
async def get_team_members_by_team_id(
    team_id: str, team_service: TeamService = Depends(get_team_service)
):
    """
    Get all team members, or members of a specific team if team_id is provided.
    """
    if team_id:
        team = await team_service.get_team_members(team_id)
        return team


@router.get(
    "/team-members",
    response_model=ResponseTeamMembersCollection,
    response_model_by_alias=False,
)
async def get_all_team_members(
    team_member_service: TeamMemberService = Depends(get_team_member_service),
):
    members = await team_member_service.get_all_team_members()

    return ResponseTeamMembersCollection(members=members)


@router.get(
    "/team-members-by-role/{role}",
    response_model=ResponseTeamMembersCollection,
    response_model_by_alias=False,
)
async def get_all_team_members_by_role(
    role: str, team_member_service: TeamMemberService = Depends(get_team_member_service)
):
    """
    Get all team members by their role.
    """
    members = await team_member_service.get_team_members_by_role(role)
    if not members:
        raise HTTPException(
            status_code=404, detail="No members found with the specified role"
        )
    return ResponseTeamMembersCollection(members=members)


@router.get(
    "/teams", response_model=ResponseTeamCollection, response_model_by_alias=False
)
async def get_all_teams(team_service: TeamService = Depends(get_team_service)):
    """
    Retrieve all teams.
    """
    teams = await team_service.get_all_teams()
    return ResponseTeamCollection(teams=teams)


@router.post(
    "/create-team", response_model=ResponseTeamSchema, response_model_by_alias=False
)
async def create_team(
    team: CreateTeamSchema, team_service: TeamService = Depends(get_team_service)
):
    created_team = await team_service.create_team(team)
    if not created_team:
        raise HTTPException(status_code=400, detail="Team creation failed")
    return created_team


@router.put(
    "/update-team/{team_id}",
    response_model=ResponseTeamSchema,
    response_model_by_alias=False,
)
async def update_team(
    team_id: str,
    team: UpdateTeamSchema,
    team_service: TeamService = Depends(get_team_service),
):
    logger.info(f"Updating team...{team}")
    created_team = await team_service.update_team(team_id=team_id, team_update=team)
    if not created_team:
        raise HTTPException(status_code=400, detail="Team update failed")
    return created_team


@router.post("/tasks/", response_model=TaskModel, response_model_by_alias=False)
async def create_task(
    task: CreateTaskSchema, task_service: TaskService = Depends(get_task_service)
):
    """
    Disabled for project managers. Task creation must be done by team leads.
    """
    raise HTTPException(
        status_code=403,
        detail="Forbidden: Project managers cannot create tasks. Use team-lead endpoints (/team-lead/tasks/) instead.",
    )


@router.post(
    "/assign-task/{task_id}", response_model=TaskModel, response_model_by_alias=False
)
async def assign_task(
    task_id: str,
    task: AssignTaskSchema,
    task_service: TaskService = Depends(get_task_service),
):
    """
    Disabled for project managers. Task assignment must be done by team leads.
    """
    raise HTTPException(
        status_code=403,
        detail="Forbidden: Project managers cannot assign tasks. Use team-lead endpoints (/team-lead/assign-task/{task_id}) instead.",
    )
