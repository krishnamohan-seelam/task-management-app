---
   mode: agent
   tools: ['codebase', 'githubRepo']
---
# Instructions: Create & Run React Application (frontend)

## 1. Install Node.js & npm
- Download and install Node.js (includes npm) from [nodejs.org](https://nodejs.org/).

## 2. Install Project Dependencies
Open a terminal in `d:\RestAPIApps\task-management-app\frontend` (Windows) or `~/RestAPIApps/task-management-app/frontend` (macOS/Linux) and run:
```powershell
# Windows (Command Prompt or PowerShell)
npm install

# macOS/Linux (bash/zsh)
npm install
```
This installs all dependencies listed in `package.json`.

## 3. Install Additional Dependencies
If not already present, install these packages (used in your project):
```powershell
# Windows
npm install react react-dom
npm install @blueprintjs/core @blueprintjs/icons
npm install @reduxjs/toolkit react-redux
npm install axios
npm install vite
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event

# macOS/Linux
npm install react react-dom
npm install @blueprintjs/core @blueprintjs/icons
npm install @reduxjs/toolkit react-redux
npm install axios
npm install vite
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

## 4. Run the Development Server
Start the app with Vite:
```powershell
# Windows
npm run dev

# macOS/Linux
npm run dev
```
Open the URL shown in the terminal (usually http://localhost:5173).

## 5. Run Unit & Integration Tests
To run all tests in `__tests__`:
```powershell
# Windows
npm test

# macOS/Linux
npm test
```
Or, if using Vite's test runner:
```powershell
npm run test
```

## 6. Build for Production
To create a production build:
```powershell
# Windows
npm run build

# macOS/Linux
npm run build
```
Output will be in the `dist` folder.

## 7. Refactor & Integrate FastAPI Endpoints
- Review and update code in `src/api.js` to match FastAPI endpoints.
- Refactor UI components and pages in `src/components` and `src/pages` to use these endpoints.
- Ensure Redux slices (`dashboardSlice.js`, `userSlice.js`) handle API data correctly.

## 8. Add & Run Tests
- Add unit tests for components and pages in `__tests__`.
- Add mock API tests using Jest and Testing Library.
- For end-to-end tests, consider using Cypress or Playwright.

## 9. BlueprintJS Integration
- Use BlueprintJS components for UI consistency.
- Import styles in `src/main.jsx` or `src/App.jsx`:
  ```javascript
  import "@blueprintjs/core/lib/css/blueprint.css";
  import "@blueprintjs/icons/lib/css/blueprint-icons.css";
  ```

## 10. Documentation
- Update `README.md` with setup, usage, and testing instructions.

---

**Tip:** If you encounter issues, delete `node_modules` and `package-lock.json` (Windows) or `node_modules` and `package-lock.json` (macOS/Linux), then run `npm install` again.

