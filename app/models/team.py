from pydantic import (
    BaseModel,
    Field,
    EmailStr,
    BeforeValidator,
    field_validator,
    ConfigDict,
    field_serializer,
)
from typing import Annotated, List, Optional
from enum import Enum
from bson import ObjectId
from datetime import datetime, timezone

PyObjectId = Annotated[str, BeforeValidator(str)]


class Role(str, Enum):
    """
    Enum representing possible roles for a team member.
    """

    DEVELOPER = "developer"
    TEAM_LEAD = "team_lead"
    PROJECT_MANAGER = "project_manager"
    SUPER_ADMIN = "super_admin"


class TeamMemberModel(BaseModel):
    """
    Pydantic model representing a team member.
    """

    member_id: Optional[PyObjectId] = Field(
        default_factory=lambda: ObjectId(), alias="_id"
    )
    name: str = Field(
        ..., min_length=1, max_length=255, json_schema_extra={"strip_whitespace": True}
    )
    email: EmailStr
    role: Role  # Now uses Enum directly
    hashed_password: str
    teams: Optional[List[PyObjectId]] = Field(
        default_factory=list
    )  # Store only ObjectIds

    @field_validator("role", mode="before")
    def validate_role(cls, v):
        """
        Validates that the role is either 'developer' or 'team lead'.
        """
        if isinstance(v, str):
            try:
                return Role(v)
            except ValueError:
                raise ValueError("Role must be either 'developer' or 'team lead'.")
        if not isinstance(v, Role):
            raise ValueError("Invalid role type.")
        return v

    @field_serializer("member_id", when_used="json")
    def serialize_objectid(self, value):
        return str(value) if value else None

    @field_serializer("teams", when_used="json")
    def serialize_teams(self, values):
        return [str(value) if value else None for value in values] if values else []

    model_config = ConfigDict(
        use_enum_values=True,
        validate_by_name=True,
        populate_by_name=True,
        arbitrary_types_allowed=True,
        extra="allow",
        json_schema_extra={
            "str_strip_whitespace": True,
            "str_min_length": 1,
            "str_max_length": 255,
        },
    )


class TeamModel(BaseModel):
    """
    Pydantic model representing a team, including its members.
    """

    team_id: Optional[PyObjectId] = Field(
        default_factory=lambda: ObjectId(), alias="_id"
    )
    name: str = Field(..., min_length=1, max_length=255)
    member_ids: List[PyObjectId] = Field(default_factory=list)  # Store only ObjectIds
    project_manager: Optional[PyObjectId] = None  # Reference to a project manager

    @field_validator("member_ids")
    def validate_members(cls, member_ids):
        """
        Validates the members list for team size and team lead constraints.
        """
        if not member_ids:
            return member_ids  # Allow teams with no members
        if len(member_ids) > 5:
            raise ValueError("A team can have a maximum of 5 members.")
        return member_ids

    @field_serializer("team_id", when_used="json")
    def serialize_objectid(self, value):
        return str(value) if value else None

    model_config = ConfigDict(
        validate_by_name=True,
        arbitrary_types_allowed=True,
        extra="allow",
        json_schema_extra={"str_strip_whitespace": True},
    )


class CreateTeamSchema(BaseModel):
    """
    Schema for creating a new team.
    """

    name: str = Field(
        ..., min_length=1, max_length=255, json_schema_extra={"strip_whitespace": True}
    )
    member_ids: List[PyObjectId] = Field(default_factory=list)


class UpdateTeamSchema(BaseModel):
    """
    Schema for updating an existing team.
    """

    name: Optional[str] = Field(
        None, min_length=1, max_length=255, json_schema_extra={"strip_whitespace": True}
    )
    member_ids: Optional[List[PyObjectId]] = None
    project_manager: Optional[PyObjectId] = None
    model_config = ConfigDict(
        json_schema_extra={
            "str_strip_whitespace": True,
            "str_min_length": 1,
            "str_max_length": 255,
        }
    )


class ResponseTeamMemberSchema(BaseModel):
    """
    Schema for returning team member data in API responses.
    """

    member_id: Optional[PyObjectId] = Field(default=None, alias="_id")
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[Role] = None

    @field_serializer("member_id", when_used="json")
    def serialize_objectid(self, value):
        return str(value) if value else None

    @field_serializer("role", when_used="json")
    def serialize_role(self, value):
        return str(value) if value else None

    model_config = ConfigDict(
        from_attributes=True,
        validate_by_name=True,
        arbitrary_types_allowed=True,
        use_enum_values=True,
        validate_assignment=True,
        extra="allow",
        json_schema_extra={
            "str_strip_whitespace": True,
            "str_min_length": 1,
            "str_max_length": 255,
        },
    )


class TeamSchema(BaseModel):
    """
    Schema for returning team data including members in API responses.
    """

    team_id: Optional[PyObjectId] = Field(default=None, alias="_id")
    name: Optional[str] = None
    members: Optional[List[ResponseTeamMemberSchema]] = None
    project_manager: Optional[PyObjectId] = None
    project_manager_name: Optional[str] = None
    model_config = ConfigDict(
        from_attributes=True,
        use_enum_values=True,
        json_schema_extra={
            "str_strip_whitespace": True,
            "str_min_length": 1,
            "str_max_length": 255,
        },
    )


class ResponseTeamSchema(BaseModel):
    """
    Schema for returning team data in API responses.
    """

    team_id: Optional[PyObjectId] = Field(default=None, alias="_id")
    name: Optional[str] = None
    member_ids: Optional[List[PyObjectId]] = None
    project_manager: Optional[PyObjectId] = None

    model_config = ConfigDict(
        from_attributes=True,
        use_enum_values=True,
        json_schema_extra={
            "str_strip_whitespace": True,
            "str_min_length": 1,
            "str_max_length": 255,
        },
    )


class AddTeamMembersSchema(BaseModel):
    """
    Schema for adding members to a team by their IDs.
    """

    member_ids: List[PyObjectId]


class CreateTeamMemberSchema(BaseModel):
    """
    Schema for creating a new team member.
    """

    name: str = Field(
        ..., min_length=1, max_length=255, json_schema_extra={"strip_whitespace": True}
    )
    email: EmailStr
    role: Role
    password: str = Field(..., min_length=6, max_length=128)
    model_config = ConfigDict(
        json_schema_extra={
            "str_strip_whitespace": True,
            "str_min_length": 1,
            "str_max_length": 255,
        }
    )





class ResponseTeamMembersCollection(BaseModel):
    """
    Schema for returning a list of team members in API responses.
    """

    members: Optional[List[ResponseTeamMemberSchema]]


class ResponseTeamCollection(BaseModel):
    """
    Schema for returning a list of teams in API responses.
    """

    teams: Optional[List[ResponseTeamSchema]]
