from pymongo.asynchronous.database import AsyncDatabase
from app.logging_config import logger

# Define your views and their pipelines here
VIEW_DEFINITIONS = {
    "team_tasks_view": {
        "viewOn": "tasks",
        "pipeline": [
            {
                "$addFields": {
                    "team_id_obj": {
                        "$convert": {
                            "input": "$team_id",
                            "to": "objectId",
                            "onError": "",
                            "onNull": "",
                        }
                    },
                    "assigned_to_obj": {
                        "$convert": {
                            "input": "$assigned_to",
                            "to": "objectId",
                            "onError": "",
                            "onNull": "",
                        }
                    },
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
    },
    # Add more views here as needed
    # "another_view": {
    #     "viewOn": "another_collection",
    #     "pipeline": [...],
    # },
    "teams_view": {
        "viewOn": "teams",
        "pipeline": [
            {
                "$lookup": {
                    "from": "team_members",
                    "localField": "members.user_id",
                    "foreignField": "_id",
                    "as": "memberDetails",
                }
            },
            {
                "$lookup": {
                    "from": "team_members",
                    "localField": "project_manager",
                    "foreignField": "_id",
                    "as": "pmDetails",
                }
            },
            {
                "$addFields": {
                    "members": {
                        "$map": {
                            "input": "$members",
                            "as": "member",
                            "in": {
                                "_id": {"$toString": "$$member.user_id"},
                                "role": "$$member.role",
                                "name": {
                                    "$arrayElemAt": [
                                        "$memberDetails.name",
                                        {
                                            "$indexOfArray": [
                                                "$memberDetails._id",
                                                "$$member.user_id",
                                            ]
                                        },
                                    ]
                                },
                                "email": {
                                    "$arrayElemAt": [
                                        "$memberDetails.email",
                                        {
                                            "$indexOfArray": [
                                                "$memberDetails._id",
                                                "$$member.user_id",
                                            ]
                                        },
                                    ]
                                },
                            },
                        }
                    },
                    "project_manager_name": {"$arrayElemAt": ["$pmDetails.name", 0]},
                }
            },
            {
                "$project": {
                    "_id": 1,
                    "name": "$name",
                    "project_manager_id": {"$toString": "$project_manager"},
                    "project_manager_name": 1,
                    "members": 1,
                }
            },
        ],
    },
}


async def create_views(db: AsyncDatabase):
    logger.info("Attempting to create or update MongoDB views...")

    collections = await db.list_collection_names()

    for view_name, view_def in VIEW_DEFINITIONS.items():
        if view_name in collections:
            logger.info(f"View '{view_name}' exists in the database.")
            continue

        try:
            # Drop the view if it already exists to ensure a clean creation/update
            await db.command({"drop": view_name})
            logger.info(f"Dropped existing '{view_name}'.")
        except Exception as e:
            logger.info(f"'{view_name}' did not exist or could not be dropped: {e}")

        try:
            await db.create_collection(
                view_name,
                viewOn=view_def["viewOn"],
                pipeline=view_def["pipeline"],
            )
            logger.info(f"Successfully created '{view_name}'.")
        except Exception as e:
            logger.error(f"Error creating '{view_name}': {e}")
            raise
