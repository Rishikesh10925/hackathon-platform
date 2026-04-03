# Hackathon Organizing and Judging Platform

End-to-end platform to run hackathons with role-based access, event management, judge-specific queues, and live scoring powered by AWS.

## Maintainer

- **Author:** Rishikesh
- **Role:** Full-Stack Developer (Frontend + AWS Serverless)
- **Focus Areas:** React, AWS Lambda, API Gateway, DynamoDB, Cognito

## Overview

This project helps organizers operate hackathons from one place:

- Admins create and manage events, teams, and judges.
- Judges only see teams from their assigned event.
- Scoring is submitted through API endpoints and reflected in dashboards.
- Authentication and identity are handled using Cognito + Amplify.

## Highlights

- Event-scoped judging model (strict `Email` + `EventID` mapping).
- Real API integration (no mock fallback in key flows).
- Defensive response parsing for API Gateway (`body` wrapped and direct JSON).
- Clean admin and judge UX with responsive components and animated interactions.

## Built With

### Frontend
- React 19
- Vite 8
- React Router
- Tailwind CSS 4
- Framer Motion
- Axios
- AWS Amplify UI
- React Hot Toast

### Backend
- AWS Lambda (Node.js)
- AWS API Gateway
- Amazon DynamoDB
- AWS SDK v3

### Authentication
- Amazon Cognito
- Amplify Auth session integration

## Architecture

```text
Frontend (React + Amplify)
	|
	| HTTPS (JWT headers via Amplify session)
	v
API Gateway
	|
	v
Lambda Functions
	|
	v
DynamoDB Tables (Events, Teams, Judges)
```

## Project Structure

```text
Vcc/
├─ backend/
│  └─ lambdas/
│     ├─ getJudges.mjs
│     └─ getTeams.mjs
├─ frontend/
│  ├─ src/
│  │  ├─ components/
│  │  ├─ context/
│  │  ├─ pages/
│  │  │  ├─ AdminDashboard.jsx
│  │  │  ├─ JudgeDashboard.jsx
│  │  │  ├─ Leaderboard.jsx
│  │  │  ├─ ManageEvents.jsx
│  │  │  ├─ CreateEvent.jsx
│  │  │  ├─ AddTeam.jsx
│  │  │  └─ AddJudge.jsx
│  │  ├─ App.jsx
│  │  └─ main.jsx
│  ├─ aws-exports.js
│  └─ package.json
└─ README.md
```

## Key Features

### Admin Dashboard
- Live event, team, and judge metrics.
- Event-level team/judge counts.
- Direct action route to event leaderboard.

### Judge Dashboard
- Resolves current signed-in identity from Cognito attributes.
- Finds judge assignment via `Judges.Email` to `EventID`.
- Filters queue to teams only in assigned event.
- Submits score payloads to `/submitScore`.

### Leaderboard + Event Management
- Event-aware leaderboard route with query param support.
- Manage Events page for browsing and handling event records.

## API Contract

Base URL example:

`https://<api-id>.execute-api.<region>.amazonaws.com`

Required endpoints:

- `GET /getEvents`
- `GET /getTeams`
- `GET /getJudges`
- `POST /submitScore`

Supported response formats:

- Direct JSON: `{ "judges": [...] }`
- Proxy JSON body: `{ "body": "{\"judges\":[...]}" }`

## DynamoDB Schema Expectations

### Judges
- `Email` (string)
- `EventID` (string)
- Optional: `JudgeName`, `Expertise`, `Organization`

### Teams
- `TeamID` (string)
- `EventID` (string)
- `TeamName` (string)
- Optional: `ProjectName` or `ProjectTitle`, `status`

### Events
- `EventID` or `id` (string)
- `EventName` or `name` (string)

## Quick Start

### Prerequisites
- Node.js 18+
- npm 9+
- AWS account with Cognito, API Gateway, Lambda, DynamoDB configured

### 1) Run Frontend

```bash
cd frontend
npm install
npm run dev
```

### 2) Build Frontend

```bash
npm run build
npm run preview
```

### 3) Deploy Backend

Deploy each Lambda in `backend/lambdas`, create corresponding API Gateway routes, enable CORS, and deploy the stage.

## Configuration Checklist

- `frontend/src/aws-exports.js` points to your Cognito setup.
- Frontend endpoint URLs match your deployed API Gateway stage.
- Cognito users include role metadata (`custom:role` recommended).
- Judge email in Cognito matches `Judges.Email` in DynamoDB.
- Judge row has a valid `EventID`.

## Production Deployment

### Frontend
- Build output: `frontend/dist`
- Host on S3 + CloudFront, Netlify, Vercel, or similar.

### Backend
- Deploy Lambda functions.
- Attach methods/routes in API Gateway.
- Verify permissions and CORS.
- Smoke-test each endpoint before release.

## Test Checklist

- Admin dashboard loads live metrics.
- Admin action button opens event-specific leaderboard.
- Judge login resolves to actual email.
- Judge sees only assigned event teams.
- Score submit works for valid teams.
- No CORS or 404 errors in browser network panel.

## Troubleshooting

### Judge Access Not Configured
- Check Cognito email exists and is verified.
- Check exact same email exists in `Judges.Email`.
- Check the judge row contains `EventID`.

### API Connection Error
- Confirm route exists and stage is deployed.
- Confirm Lambda role can read DynamoDB.
- Confirm CORS response headers are present.

### Empty Dashboard Data
- Validate response keys (`events`, `teams`, `judges`).
- Confirm API returns expected shape (direct or body-wrapped JSON).

## Security Notes

- Never store user passwords in DynamoDB.
- Use Cognito for credentials and identity lifecycle.
- Protect write operations with JWT validation.

## Roadmap

- Rubric builder per event
- Judge assignment UI with clash detection
- CSV/Excel export for scorecards
- Audit trail for score edits
- E2E test suite

## License

MIT (recommended). Add a `LICENSE` file before public release.
