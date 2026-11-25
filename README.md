# Hackathon Organizing and Judging Platform

End-to-end platform to run hackathons with role-based access, event management, judge-specific queues, and live scoring powered by AWS.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![AWS Lambda](https://img.shields.io/badge/AWS-Lambda%20%C2%B7%20API%20Gateway%20%C2%B7%20DynamoDB%20%C2%B7%20Cognito-FF9900?logo=amazonwebservices&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss&logoColor=white)

---

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
hackathon-platform/
├─ backend/
│  └─ lambdas/
│     ├─ getJudges.mjs
│     └─ getTeams.mjs
├─ frontend/
│  ├─ src/
│  │  ├─ components/ProtectedRoute.jsx
│  │  ├─ context/AuthContext.jsx
│  │  ├─ pages/          # Landing, Login, AdminDashboard, JudgeDashboard, Leaderboard,
│  │  │                  # ManageEvents, CreateEvent, AddTeam, AddJudge
│  │  ├─ aws-exports.js  # Cognito user pool configuration
│  │  ├─ config.js       # API base URL (VITE_API_BASE_URL)
│  │  ├─ App.jsx
│  │  └─ main.jsx        # attaches the Cognito ID token to every API request
│  └─ package.json
└─ README.md
```

> Only the `getJudges` and `getTeams` Lambda handlers are in this repository. The other routes the frontend calls (`getEvents`, `createEvent`, `addTeam`, `addJudge`, `submitScore`, `leaderboard`) are deployed in AWS but their source has not been added yet.

## API Contract

Base URL example:

`https://<api-id>.execute-api.<region>.amazonaws.com`

Required endpoints:

- `GET /getEvents`, `POST /createEvent`
- `GET /getTeams`, `POST /addTeam`
- `GET /getJudges`, `POST /addJudge`
- `POST /submitScore`
- `GET /leaderboard?eventId=<id>`

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

- `frontend/src/aws-exports.js` points to your Cognito user pool.
- `VITE_API_BASE_URL` (in `frontend/.env.local`) points to your deployed API Gateway stage. Without it, `src/config.js` falls back to the original deployment.
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

## Author

Built by [Rishikesh](https://github.com/Rishikesh10925), mentored by Naresh Vurukonda.
