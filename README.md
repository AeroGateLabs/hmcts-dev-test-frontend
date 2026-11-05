# HMCTS Task Management Frontend - Coding Challenge

Frontend application for the HMCTS coding challenge.

The application provides a GOV.UK-styled interface for creating, viewing, and managing tasks through the backend REST
API.

## Tech stack

- Node.js 20
- TypeScript
- Express
- Nunjucks
- Axios
- GOV.UK Frontend
- Webpack
- Jest
- Supertest
- Yarn 4

## Requirements

- Node.js 20
- Corepack
- Yarn 4
- Backend service running on port `4000`

## Installing dependencies

Enable Corepack if required:

```bash
corepack enable
```

Install dependencies:

```bash
yarn install
```

## Running the application

The frontend expects the backend to be available at:

```text
http://localhost:4000
```

Start the application with:

```bash
yarn start:dev
```

The frontend runs on:

```text
https://localhost:3100
```

The backend URL can be overridden using the `BACKEND_URL` environment variable:

```bash
BACKEND_URL=http://localhost:4000 yarn start:dev
```

For example, when running the frontend inside WSL and the backend on Windows:

```bash
BACKEND_URL=http://host.docker.internal:4000 yarn start:dev
```

## Running tests

Run unit tests:

```bash
yarn test
```

Run route tests:

```bash
yarn test:routes
```

Run all CI checks:

```bash
yarn cichecks
```

## Application routes

| Method | Route                 | Description                  |
| ------ | --------------------- | ---------------------------- |
| GET    | `/tasks`              | View all tasks               |
| GET    | `/tasks/create`       | Display the create task form |
| GET    | `/tasks/:id`          | View task details            |
| POST   | `/tasks`              | Create a task                |
| POST   | `/tasks/:id/assign`   | Assign a task                |
| POST   | `/tasks/:id/unassign` | Unassign a task              |
| POST   | `/tasks/:id/complete` | Complete a task              |
| POST   | `/tasks/:id/delete`   | Delete a task                |

The browser-facing action routes use POST because the standard HTML forms support GET and POST. The frontend service
translates these actions into the appropriate backend PATCH or DELETE requests.

## Architecture

The frontend uses a server-rendered architecture.

```text
Browser
  |
  v
Express route
  |
  v
Task service
  |
  v
Axios
  |
  v
Spring Boot API
  |
  v
PostgreSQL
```

Express routes call the task service, which communicates with the backend REST API using Axios.

The returned task data is passed to Nunjucks templates and rendered as HTML.

## User interface

The application uses GOV.UK frontend styles and components.

The task list displays:

- Task title
- Status
- Due date
- View action

The task details page displays all task fields and only shows actions that are valid for the current task status.

## Task actions

```text
PENDING
  - Assign
  - Delete

ASSIGNED
  - Complete
  - Unassign
  - Delete

COMPLETED
  - Delete
```

## Error handling

The frontend handles common cases including:

- Failed task creation
- Missing tasks
- Empty task lists

Create-form errors are displayed using GOV.UK error styling and previously entered form values are retained.

## Testing

The frontend includes:

- Unit tests for the task service using mocked Axios requests
- Route tests using Jest and Supertest
- Mocked service dependencies so route tests do not require the backend to be running
