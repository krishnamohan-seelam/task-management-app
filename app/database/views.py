from pymongo.asynchronous.database import AsyncDatabase
from app.logging_config import logger


async def create_views(db: AsyncDatabase):
    logger.info("Attempting to create or update MongoDB views...")
    view_name = "team_tasks_view"
    collections = await db.list_collection_names()
    if view_name in collections:
        logger.info(f"View '{view_name}' exists in the database.")
        return 

    try:
        # Drop the view if it already exists to ensure a clean creation/update
        await db.command({"drop": "team_tasks_view"})
        logger.info("Dropped existing 'team_tasks_view'.")
    except Exception as e:
        # Log if the view didn't exist, which is expected on first run
        logger.info(f"'team_tasks_view' did not exist or could not be dropped: {e}")

    try:
        # Create the team_tasks_view
        await db.create_collection(
            "team_tasks_view",
            viewOn="tasks",
            pipeline=[
                {
                    "$addFields": {
                        "team_id_obj": {"$convert": {"input": '$team_id', "to" : 'objectId', "onError": '',"onNull": ''}},
                        "assigned_to_obj": {"$convert": {"input": '$assigned_to', "to" : 'objectId', "onError": '',"onNull": ''}},
                    }
                },
                {
                    "$lookup": {
                        "from": "teams",
                        "localField": "team_id_obj",
                        "foreignField": "_id",
                        "as": "team",
                    }
                },
                {"$unwind": "$team"},
                {
                    "$lookup": {
                        "from": "team_members",
                        "localField": "assigned_to_obj",
                        "foreignField": "_id",
                        "as": "assignee",
                    }
                },
                {"$unwind": "$assignee"},
                {
                    "$project": {
                        "title": 1,
                        "status": 1,
                        "team_name": "$team.name",
                        "team_member": "$assignee.name",
                    }
                },
            ],
        )
        logger.info("Successfully created 'team_tasks_view'.")
    except Exception as e:
        logger.error(f"Error creating 'team_tasks_view': {e}")
        raise
