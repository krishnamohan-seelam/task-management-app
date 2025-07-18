from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.models.task import ResponseTaskSchema, UpdateTaskSchema
from app.models.team import (
    CreateTeamMemberSchema,
    ResponseTeamMemberSchema,
    ResponseTeamMembersCollection,
)
from app.services.task_service import TaskService, get_task_service
from app.services.team_member_service import TeamMemberService, get_team_member_service
from app.logging_config import logger
from app.dependencies.auth import require_roles

router = APIRouter(
    dependencies=[Depends(require_roles("developer"))]
)


@router.get("/tasks/", response_model=List[ResponseTaskSchema])
async def get_tasks(assigned_to: str, task_service: TaskService = Depends(get_task_service)):
    # assigned_to should be passed as ObjectId string
    return await task_service.get_tasks_by_member(assigned_to)


@router.put("/tasks/{task_id}", response_model=ResponseTaskSchema)
async def update_task_status(task_id: str, task_update: UpdateTaskSchema, task_service: TaskService = Depends(get_task_service)):
    updated_task = await task_service.update_task_status(task_id, task_update)
    if not updated_task:
        raise HTTPException(status_code=404, detail="Task not found")
    return updated_task


@router.post("/team-member", response_model=ResponseTeamMemberSchema, response_model_by_alias=True)
async def create_team_member(
    member: CreateTeamMemberSchema,
    team_member_service: TeamMemberService = Depends(get_team_member_service)
):
    logger.info(f"[Team Member] Creating team member: {member}")
    created_member = await team_member_service.create_team_member(member)
    if not created_member:
        logger.error("Team member creation failed in route.")
        raise HTTPException(status_code=400, detail="Team member creation failed")
    return created_member


@router.get("/team-members", response_model=ResponseTeamMembersCollection, response_model_by_alias=False)
async def get_all_team_members(
    team_member_service: TeamMemberService = Depends(get_team_member_service)
):
    members = await team_member_service.get_all_team_members()
    return ResponseTeamMembersCollection(members=members)


@router.get("/team-member/{team_member_id}", response_model=ResponseTeamMemberSchema)
async def get_team_member_by_id(
    team_member_id: str,
    team_member_service: TeamMemberService = Depends(get_team_member_service)
):
    member = await team_member_service.get_team_member_by_id(team_member_id)
    return member