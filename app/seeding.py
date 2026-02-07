from pymongo import MongoClient
from faker import Faker
from bson import ObjectId
import random
from app.utils import get_password_hash

fake = Faker()
client = MongoClient("mongodb://localhost:27017/")
db = client["task_management_dev"]

# Clear collections
db.users.delete_many({})
db.teams.delete_many({})
db.tasks.delete_many({})

roles = ["project_manager", "team_lead", "developer"]
team_names = [f"{fake.color_name()} Team" for _ in range(10)]

# Step 1: Generate Users
user_ids = []
users = []
for _ in range(50):  # 50 users
    role = random.choice(roles)
    user_id = ObjectId()
    user_ids.append(user_id)
    users.append({
        "_id": user_id,
        "name": fake.name(),
        "email": fake.email(),
        "role": role,
        "hashed_password": get_password_hash("password123"),
        "teams": []  # to be filled later
    })
db.team_members.insert_many(users)

# Step 2: Generate Teams with Members
team_ids = []
teams = []
for name in team_names:
    team_id = ObjectId()
    team_ids.append(team_id)
    members = random.sample(user_ids, k=random.randint(5, 10))
    pm_id = random.choice(members)

    teams.append({
        "_id": team_id,
        "name": name,
        "project_manager": pm_id,
        "members": [
            { "user_id": m_id, "role": random.choice(roles) }
            for m_id in members
        ]
    })

    # Add team ID to each member's `teams` field
    for m_id in members:
        db.team_members.update_one({ "_id": m_id }, { "$addToSet": { "teams": str(team_id) } })

db.teams.insert_many(teams)

# Step 3: Generate Tasks
tasks = []
for _ in range(200):
    team_id = random.choice(team_ids)
    team = db.teams.find_one({ "_id": team_id })
    member_ids = [m["user_id"] for m in team["members"]]
    created_by = random.choice(member_ids)
    assigned_to = random.choice(member_ids)

    tasks.append({
        "_id": ObjectId(),
        "title": fake.sentence(nb_words=6),
        "description": fake.paragraph(),
        "team_id": str(team_id),  # stored as string to demonstrate type conversion later
        "assigned_to": assigned_to,
        "created_by": created_by,
        "status": random.choice(["open", "in_progress", "completed"]),
        "created_at": fake.date_time_this_year(),
        "updated_at": fake.date_time_this_year()
    })

db.tasks.insert_many(tasks)
print("✔️ Seeded users, teams, and tasks successfully!")