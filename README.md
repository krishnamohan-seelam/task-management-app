# Task Management App

A collaborative task management system built with FastAPI and MongoDB. Designed for teams, it enables project managers to assign tasks, team leads to delegate and monitor, and team members to update progress.

## Project Structure

```
task-management-app
├── app
│   ├── main.py                  # FastAPI application entry point
│   ├── models
│   │   └── task.py              # Task data model definitions & schemas for validation
│   │   └── team.py              # Team and team member data models & validation
│   ├── repositories
│   │   ├── task_repository.py   # Data access logic for tasks
│   │   ├── team_repository.py   # Data access logic for teams
│   │   └── team_member_repository.py # Data access for team members
│   ├── routes
│   │   ├── team_lead.py         # Endpoints for team leads
│   │   ├── team_member.py       # Endpoints for team members
│   │   └── project_manager.py   # Endpoints for project managers
│   └── services
│       ├── task_service.py      # Business logic for tasks
│       ├── team_service.py      # Business logic for teams
│       └── team_member_service.py # Business logic for team members
├── config
│   └── database.py              # MongoDB connection setup
├── requirements.txt             # Python dependencies
├── README.md                    # Project documentation
└── .env                         # Environment variables
```

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd task-management-app
```

### 2. Set up a virtual environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure MongoDB

Add your MongoDB connection string to the `.env` file:

```
MONGODB_URL=<your_mongodb_connection_string>
```

### 5. Run the application

```bash
uvicorn app.main:app --reload
```

## API Endpoints

### Project Manager

- `POST /project-manager/tasks/` — Create a new task
- `POST /project-manager/assign-task` — Assign a task to a user
- `GET /project-manager/tasks` — View all tasks and progress
- `GET /project-manager/task/{task_id}` — Get a specific task by ID
- `POST /project-manager/team-member` — Create a team member
- `POST /project-manager/add-team-members` — Assign existing members to a team
- `POST /project-manager/remove-team-members` — Remove members from a team
- `GET /project-manager/team-members` — List all team members or by team

### Team Lead

- `POST /team-lead/assign-task` — Assign a task to a team member
- `GET /team-lead/tasks` — View tasks assigned by the team lead
- `PUT /team-lead/update-task/{task_id}` — Update a task
- `GET /team-lead/track-tasks` — Track all team tasks
- `POST /team-lead/create-team` — Create a new team
- `POST /team-lead/add-team-members` — Add members to a team
- `POST /team-lead/team-member` — Create a team member
- `GET /team-lead/team-members` — List all team members
- `GET /team-lead/team-member/{team_member_id}` — Get a team member by ID
- `PUT /team-lead/team-member/{team_member_id}` — Update a team member
- `DELETE /team-lead/team-member/{team_member_id}` — Delete a team member

### Team Member

- `GET /team-member/tasks/` — List assigned tasks
- `PUT /team-member/tasks/{task_id}` — Update task status
- `POST /team-member/team-member` — Create a team member
- `GET /team-member/team-members` — List all team members
- `GET /team-member/team-member/{team_member_id}` — Get a team member by ID

## Define required views
``` python
from pymongo import MongoClient

# Requires the PyMongo package.
# https://api.mongodb.com/python/current

client = MongoClient('mongodb://localhost:27017/')
result = client['task_management_dev']['tasks'].aggregate([
    {
        '$addFields': {
            'team_id_obj': {
                '$toObjectId': '$team_id'
            }, 
            'assigned_to_obj': {
                '$toObjectId': '$assigned_to'
            }
        }
    }, {
        '$lookup': {
            'from': 'teams', 
            'localField': 'team_id_obj', 
            'foreignField': '_id', 
            'as': 'team'
        }
    }, {
        '$unwind': '$team'
    }, {
        '$lookup': {
            'from': 'team_members', 
            'localField': 'assigned_to_obj', 
            'foreignField': '_id', 
            'as': 'assignee'
        }
    }, {
        '$unwind': '$assignee'
    }, {
        '$project': {
            'title': 1, 
            'status': 1, 
            'team_name': '$team.name', 
            'team_member': '$assignee.name'
        }
    }
])
```
## Code Documentation

All modules and methods include up-to-date docstrings describing their purpose, arguments, return values, and exceptions. See the code for details.

## License

This project is licensed under the MIT License. See the LICENSE file for details.