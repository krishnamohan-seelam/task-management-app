# Frontend Analysis and PRD

## Overview
The frontend is a React application using Vite, Redux Toolkit, and BlueprintJS. It interfaces with a FastAPI backend to manage tasks, teams, and users.

## Identified Issues

### 1. Bugs
*   **Persistent Login Failure**: The application stores the authentication token in Redux state but does not persist it (e.g., to `localStorage`). A page refresh wipes the state, forcing the user to log in again.
*   **UI/Logic Mismatch for Project Managers**: `ProjectManagerTasksPage.jsx` includes forms to "Create Task" and "Assign Task", but the corresponding API functions in `api.js` are hardcoded to throw errors ("Project managers are not allowed..."). This results in a broken UI for Project Managers.
*   **Stale Closures/Dependencies**: `useEffect` hooks often miss dependencies (like `token`), potentially leading to stale data or missed updates.

### 2. Security Flaws
*   **Missing Role-Based Route Protection**: The `RequireAuth` component only checks if a user is logged in. It does not verify if the user has the correct role for the route. A "Developer" can access `/pm/teams` by manually entering the URL.
*   **Hardcoded API URL**: The API base URL is hardcoded to `http://localhost:8000` in `api.js`.

### 3. Design Flaws
*   **Manual Token Handling**: The JWT token is manually retrieved from the state and passed as an argument to every API function call. This is repetitive and error-prone.
*   **Inconsistent Error Handling**: API errors are often swallowed or replaced with generic messages, making debugging difficult.

## Product Requirements (PRD)

### Task 1: Fix State Persistence
**Objective**: Ensure users remain logged in after a page refresh.
*   **Action**: Update `store.js` or `userSlice.js` to initialize state from `localStorage`.
*   **Action**: Update `login` reducer to save to `localStorage` and `logout` to clear it.

### Task 2: Implement Role-Based Access Control (RBAC) for Routes
**Objective**: Prevent unauthorized access to role-specific pages.
*   **Action**: Create a `RequireRole` component (or update `RequireAuth`) that accepts a list of allowed roles.
*   **Action**: Apply this wrapper to routes in `App.jsx` (e.g., `/pm/*` requires `project_manager`).

### Task 3: Refactor API Client
**Objective**: Simplify API calls and improve maintainability.
*   **Action**: Create a centralized Axios instance in `api.js`.
*   **Action**: Add an interceptor to automatically attach the `Authorization` header from the stored token.
*   **Action**: Remove the `token` argument from individual API functions.
*   **Action**: Use environment variables (`import.meta.env.VITE_API_URL`) for the base URL.

### Task 4: Fix Project Manager Tasks Page
**Objective**: Align UI with business rules.
*   **Action**: Remove "Create Task" and "Assign Task" forms from `ProjectManagerTasksPage.jsx`.
*   **Action**: Ensure the page strictly displays the list of tasks (read-only view or status updates if allowed).

### Task 5: Improve Error Handling
**Objective**: Provide better feedback to users.
*   **Action**: Update API calls to propagate backend error messages (e.g., `err.response.data.detail`) to the UI instead of generic "Failed" messages.

## Implementation Steps
1.  **Environment Setup**: Create `.env` file for API URL.
2.  **API Refactor**: Refactor `api.js` to use Axios interceptors.
3.  **State Management**: Update Redux logic for persistence.
4.  **Routing**: Implement `RequireRole` in `App.jsx`.
5.  **UI Cleanup**: Fix `ProjectManagerTasksPage.jsx`.
