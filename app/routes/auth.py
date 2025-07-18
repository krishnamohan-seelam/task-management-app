from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from jose import jwt
from datetime import datetime, timedelta, timezone
from app.services.team_member_service import get_team_member_service, TeamMemberService
from app.models.team import Role
import os

SECRET_KEY = os.getenv("SECRET_KEY", "supersecret")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

router = APIRouter()

@router.post("/login")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    team_member_service: TeamMemberService = Depends(get_team_member_service)
):
    # For demo: username = email, password = role (not secure, just for RBAC demo)
    member = await team_member_service.get_team_member_by_email(form_data.username)
    if not member or form_data.password != member.get("role"):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {
        "sub": str(member["_id"]),
        "role": member["role"],
        "exp": datetime.now(timezone.utc) + access_token_expires,
    }
    token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": token, "token_type": "bearer"}
