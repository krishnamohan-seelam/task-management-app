from fastapi import APIRouter, HTTPException, Depends
from typing import List

from app.models.task import (
    CreateTaskSchema,
    TaskModel,
    UpdateTaskSchema,
    AssignTaskSchema,
)
from app.models.team import (
    CreateTeamSchema,
    CreateTeamMemberSchema,
    ResponseTeamMemberSchema,
    ResponseTeamMembersCollection,
    AddTeamMembersSchema,
    ResponseTeamSchema,
    ResponseTeamCollection,
)
from app.services.task_service import TaskService, get_task_service
from app.services.team_member_service import TeamMemberService, get_team_member_service
from app.services.team_service import TeamService, get_team_service
from app.logging_config import logger
from app.dependencies.auth import require_roles, get_current_user

router = APIRouter(dependencies=[Depends(require_roles("team_lead"))])


@router.post("/tasks/", response_model=TaskModel, response_model_by_alias=False)
async def create_task(
    task: CreateTaskSchema, 
    task_service: TaskService = Depends(get_task_service),
    team_service: TeamService = Depends(get_team_service),
    current_user: dict = Depends(get_current_user)
):
    logger.info(f"[Team Lead] Creating task: {task}")
    
    # Verify the user manages the team
    if task.team_id:
        team = await team_service.get_team(str(task.team_id))
        if str(team.get("project_manager")) != current_user["user_id"]:
             raise HTTPException(status_code=403, detail="You do not have permission to create tasks for this team.")
    
    return await task_service.create_task(task)


@router.post(
    "/assign-task/{task_id}", response_model=TaskModel, response_model_by_alias=False
)
async def assign_task(
    task_id: str,
    task_assign: AssignTaskSchema,
    task_service: TaskService = Depends(get_task_service),
    team_service: TeamService = Depends(get_team_service),
    current_user: dict = Depends(get_current_user)
):
    # Fetch task to check team ownership
    existing_task = await task_service.get_task(task_id)
    team_id = existing_task.get("team_id")
    
    if not team_id:
         raise HTTPException(status_code=400, detail="Task is not associated with any team.")

    # Check permission
    team = await team_service.get_team(str(team_id))
    if str(team.get("project_manager")) != current_user["user_id"]:
        raise HTTPException(status_code=403, detail="You do not have permission to assign this task.")

    # Check assignee membership
    assignee_id = str(task_assign.assigned_to)
    member_ids = [str(m) for m in team.get("member_ids", [])]
    if assignee_id not in member_ids:
            raise HTTPException(status_code=400, detail="Assignee is not a member of the task's team.")

    try:
        updated_task = await task_service.update_task(task_id, task_assign)
        return updated_task
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/tasks", response_model=List[TaskModel])
async def get_assigned_tasks(
    current_user: dict = Depends(get_current_user),
    task_service: TaskService = Depends(get_task_service),
    team_service: TeamService = Depends(get_team_service)
):
    """
    Retrieve all tasks for teams led by the current user.
    """
    # Get teams managed by user
    teams = await team_service.get_team_by_project_manager(current_user["user_id"])
    if not teams:
        return []
        
    team_ids = [str(t["_id"]) for t in teams]
    
    # Get tasks for these teams
    tasks = await task_service.get_tasks_by_team_ids(team_ids)
    return tasks


@router.put("/update-task/{task_id}", response_model=TaskModel)
async def update_task(
    task_id: str,
    task_update: UpdateTaskSchema,
    task_service: TaskService = Depends(get_task_service),
    team_service: TeamService = Depends(get_team_service),
    current_user: dict = Depends(get_current_user)
):
    # Verify ownership
    existing_task = await task_service.get_task(task_id)
    team_id = existing_task.get("team_id")
    if team_id:
        team = await team_service.get_team(str(team_id))
        if str(team.get("project_manager")) != current_user["user_id"]:
            raise HTTPException(status_code=403, detail="You do not have permission to update this task.")

    updated_task = await task_service.update_task(task_id, task_update)
    if not updated_task:
        raise HTTPException(status_code=404, detail="Task not found")
    return updated_task


@router.get("/track-tasks", response_model=List[TaskModel])
async def track_tasks(task_service: TaskService = Depends(get_task_service)):
    tasks = await task_service.get_all_tasks()
    return tasks


@router.post("/add-team-members", response_model=ResponseTeamSchema)
async def add_team_members(
    team_id: str,
    members: AddTeamMembersSchema,
    team_service: TeamService = Depends(get_team_service),
    team_member_service: TeamMemberService = Depends(get_team_member_service),
    current_user: dict = Depends(get_current_user)
):
    # Verify permission
    team = await team_service.get_team(team_id)
    if str(team.get("project_manager")) != current_user["user_id"]:
        raise HTTPException(status_code=403, detail="You do not have permission to add members to this team.")

    updated_team = await team_service.add_team_members(team_id, members)
    if not updated_team:
        raise HTTPException(status_code=400, detail="Adding team members failed or team size limit exceeded")
    return updated_team


@router.get("/team-member/{team_member_id}", response_model=ResponseTeamMemberSchema)
async def get_team_member_by_id(
    team_member_id: str,
    team_member_service: TeamMemberService = Depends(get_team_member_service),
):
    member = await team_member_service.get_team_member_by_id(team_member_id)
    return member


@router.put("/team-member/{team_member_id}", response_model=ResponseTeamMemberSchema)
async def update_team_member(
    team_member_id: str,
    update_data: dict,
    team_member_service: TeamMemberService = Depends(get_team_member_service),
):
    updated = await team_member_service.update_team_member(team_member_id, update_data)
    if not updated:
        raise HTTPException(
            status_code=404, detail="Team member not found or not updated"
        )
    member = await team_member_service.get_team_member_by_id(team_member_id)
    return member


@router.delete("/team-member/{team_member_id}")
async def delete_team_member(
    team_member_id: str,
    team_member_service: TeamMemberService = Depends(get_team_member_service),
):
    deleted = await team_member_service.delete_team_member(team_member_id)
    if not deleted:
        raise HTTPException(
            status_code=404, detail="Team member not found or not deleted"
        )
    return {"detail": "Team member deleted successfully"}


@router.get("/team-members/{team_id}", response_model=ResponseTeamMembersCollection)
async def get_team_members(
    team_id: str,
    team_service: TeamService = Depends(get_team_service),
    team_member_service: TeamMemberService = Depends(get_team_member_service),
):
    members = await team_service.get_team_members(
        team_id, team_member_service.team_member_repository
    )
    return ResponseTeamMembersCollection(members=members)


@router.get("/teams", response_model=ResponseTeamCollection)
async def get_teams(
    current_user: dict = Depends(get_current_user),
    team_service: TeamService = Depends(get_team_service),
):
    """
    Retrieve teams managed by the current user.
    """
    teams = await team_service.get_team_by_project_manager(current_user["user_id"])
    converted_teams = []
    # Convert dicts from mongo to objects expected by schema if necessary, 
    # but ResponseTeamCollection expects 'teams' list of ResponseTeamSchema
    # TeamService.get_team_by_project_manager returns list of dicts.
    # ResponseTeamSchema can create from attributes/dict if configured.
    return ResponseTeamCollection(teams=teams)
