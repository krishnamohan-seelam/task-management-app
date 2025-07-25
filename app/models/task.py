from pydantic import BaseModel, Field, BeforeValidator, ConfigDict, field_serializer
from bson import ObjectId
from typing import Optional, Annotated, List
from datetime import datetime, timezone
from enum import Enum

PyObjectId = Annotated[str, BeforeValidator(str)]

class TaskStatus(str, Enum):
    UN_ASSIGNED = "unassigned"
    ASSIGNED= "assigned"
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"

class TaskModel(BaseModel):
    """
    TaskModel represents a task entity in the task management application.
    Normalized: assigned_to is a reference to TeamMember (ObjectId).

    Attributes:
        task_id (Optional[PyObjectId]): Unique identifier for the task, defaults to a new ObjectId.
        title (str): Title of the task.
        description (Optional[str]): Detailed description of the task.
        status (TaskStatus): Current status of the task (e.g., "in progress", "completed").
        assigned_to (Optional[PyObjectId]): Identifier of the user to whom the task is assigned.
        created_at (Optional[datetime]): Timestamp when the task was created, defaults to current UTC time.
        updated_at (Optional[datetime]): Timestamp when the task was last updated, defaults to current UTC time.

    Config:
        use_enum_values (bool): Use enum values for serialization.
        validate_by_name (bool): Allow validation by field name.
        populate_by_name (bool): Allow population by field name.
        arbitrary_types_allowed (bool): Allow arbitrary types such as ObjectId.
        str_strip_whitespace (bool): Strip whitespace from string fields.
        str_min_length (int): Minimum length for string fields.
        str_max_length (int): Maximum length for string fields.
        extra (str): Forbid extra fields not defined in the model.
        json_encoders (dict): Custom JSON encoders for specific types.
        validate_assignment (bool): Validate fields on assignment.
        json_schema_extra (dict): Example schema for documentation purposes.
    """
    task_id: Optional[PyObjectId] = Field(default_factory=lambda: ObjectId(), alias="_id")
    title: str
    description: Optional[str] = None
    status: TaskStatus
    assigned_to: Optional[PyObjectId] = None  # Reference to TeamMember
    created_at: Optional[datetime] = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: Optional[datetime] = Field(default_factory=lambda: datetime.now(timezone.utc))
    team_id: Optional[PyObjectId] = None  # Reference to Team

    @field_serializer('created_at', 'updated_at', when_used='json')
    def serialize_datetime(self, value):
        return value.astimezone(timezone.utc).isoformat() if value else None

    @field_serializer('task_id', 'assigned_to', when_used='json')
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
        extra="forbid",
        validate_assignment=True,
        json_schema_extra={
            "example": {
                "title": "Sample Task",
                "description": "This is a sample task description.",
                "status": "in progress",
                "assigned_to": "60d5ec49f8d2e4b8b4e7c8a1",
            }
        }
    )

class CreateTaskSchema(BaseModel):
    """
    Schema for creating a new task.

    Attributes:
        title (str): The title of the task.
        description (Optional[str]): An optional description providing more details about the task.
        status (TaskStatus): The current status of the task (e.g., 'pending', 'completed').
    """
    title: str
    description: Optional[str] = None
    status: TaskStatus
    assigned_to: Optional[PyObjectId] = None

class AssignTaskSchema(BaseModel):
    """
    Schema for assigning a task to a user.

    Attributes:
        assigned_to (PyObjectId): The identifier (e.g., username or user ID) of the user to whom the task is assigned.
        status (Optional[TaskStatus]): The current status of the task assignment (e.g., 'pending', 'in progress', 'completed'). This field is optional.
    """
    assigned_to: PyObjectId
    status: Optional[TaskStatus] = None

class UpdateTaskSchema(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    assigned_to: Optional[PyObjectId] = None
    team_id: Optional[PyObjectId] = None

class ResponseTaskSchema(BaseModel):
    task_id: Optional[PyObjectId] = Field(default=None, alias="_id")
    title: str
    description: Optional[str] = None
    status: TaskStatus=None
    assigned_to: Optional[PyObjectId] = None
    team_id: Optional[PyObjectId] = None

    model_config = ConfigDict(
        from_attributes=True,
        validate_by_name=True
    )

class ResponseTeamTaskViewSchema(BaseModel):
    task_id: Optional[PyObjectId] = Field(default=None, alias="_id")
    title: Optional[str]
    status: Optional[str]
    team_name: Optional[str]
    team_member: Optional[str]

    model_config = ConfigDict(
        from_attributes=True,
        validate_by_name=True
    )

class ResponseTeamTaskViewCollection(BaseModel):
    tasks: List[ResponseTeamTaskViewSchema]