---
   mode: agent
   tools: ['codebase', 'githubRepo']
---

- Examine the UI code in frontend/src/ , refactor the code as per the Fast API end points defined by fast API , using them Build the required UI components,pages, integrate them.


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

### Additional instructions
- Front end used blueprint js , react js and vite 
- Add unit test, mock tests, end to end tests