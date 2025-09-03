from pydantic import BaseModel, Field, BeforeValidator, ConfigDict, field_serializer
from bson import ObjectId
from typing import Optional, Annotated, List
from datetime import datetime, timezone
from enum import Enum


class TaskStatus(str, Enum):
    UN_ASSIGNED = "unassigned"
    ASSIGNED = "assigned"
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"


PyObjectId = Annotated[str, BeforeValidator(str)]


class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    assigned_to: Optional[PyObjectId] = None
    team_id: Optional[PyObjectId] = None


class ResponseTaskSchema(TaskBase):
    task_id: Optional[PyObjectId] = Field(default=None, alias="_id")
    model_config = ConfigDict(from_attributes=True, validate_by_name=True)


class TaskModel(TaskBase):
    task_id: Optional[PyObjectId] = Field(
        default_factory=lambda: ObjectId(), alias="_id"
    )
    created_at: Optional[datetime] = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    updated_at: Optional[datetime] = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    @field_serializer("created_at", "updated_at", when_used="json")
    def serialize_datetime(self, value):
        return value.astimezone(timezone.utc).isoformat() if value else None

    @field_serializer("task_id", "assigned_to", "team_id", when_used="json")
    def serialize_objectid(self, value):
        return str(value) if value else None

    model_config = ConfigDict(
        use_enum_values=True,
        validate_by_name=True,
        populate_by_name=True,
        arbitrary_types_allowed=True,
        str_strip_whitespace=True,
        str_min_length=1,
        str_max_length=255,
        validate_assignment=True,
        json_schema_extra={
            "example": {
                "title": "Sample Task",
                "description": "This is a sample task description.",
                "status": "in progress",
                "assigned_to": "60d5ec49f8d2e4b8b4e7c8a1",
            }
        },
    )


class CreateTaskSchema(TaskBase):
    pass


class UpdateTaskSchema(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    assigned_to: Optional[PyObjectId] = None
    team_id: Optional[PyObjectId] = None


class AssignTaskSchema(BaseModel):
    assigned_to: PyObjectId
    status: Optional[TaskStatus] = None


class ResponseTeamTaskViewSchema(BaseModel):
    task_id: Optional[PyObjectId] = Field(default=None, alias="_id")
    title: Optional[str]
    status: Optional[str]
    team_name: Optional[str]
    team_member: Optional[str]

    model_config = ConfigDict(from_attributes=True, validate_by_name=True)


class ResponseTeamTaskViewCollection(BaseModel):
    tasks: List[ResponseTeamTaskViewSchema]
