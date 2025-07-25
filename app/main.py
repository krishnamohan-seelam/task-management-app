from fastapi import FastAPI
from app.routes import team_lead, team_member, project_manager, auth
from app.logging_config import logger
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.database.views import create_views
from config.database import get_database



@asynccontextmanager
async def lifespan(app: FastAPI):
    db = get_database()
    await create_views(db)
    yield

app = FastAPI(lifespan=lifespan)
logger.info("FastAPI application instance created.")

app.include_router(team_lead.router, prefix="/team-lead", tags=["Team Lead"])
app.include_router(team_member.router, prefix="/team-member", tags=["Team Member"])
app.include_router(project_manager.router, prefix="/project-manager", tags=["Project Manager"])
app.include_router(auth.router, prefix="/auth", tags=["Auth"])

origins = ["*"]
    

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    logger.info("Root endpoint accessed.")
    return {"message": "Welcome to the Task Management API"}