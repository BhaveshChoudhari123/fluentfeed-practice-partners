# FluentFeed — Practice Partners:

A full-stack prototype for the FluentFeed English Practice Partners assignment.

## What is included:

- React + TypeScript + Tailwind CSS frontend
- Node.js + Express backend
- MongoDB with Mongoose
- Profile create/edit flow
- Top 5 compatibility matching
- Search/filter support from the backend
- Connection request workflow: pending / accepted / rejected
- Practice Mission bonus feature with random topics
- Loading, empty, error, and success states
- Seed script with demo users
- API documentation
- Dockerfiles and `docker-compose.yml` for local development
- Deployment notes for MongoDB Atlas + Render/Railway/Vercel/Netlify

## Assignment coverage

The implementation follows the supplied assignment: profile fields, compatibility scoring, top 5 matches, backend filters, connection requests, practice missions, required APIs, responsive UI, and README documentation.

## Project structure

```text
fluentfeed/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   └── seed.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── lib/
│   │   └── types/
│   ├── .env.example
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
├── docker-compose.yml
└── README.md
```

## Functional flow

1. Select an existing demo user or create/update a profile.
2. Open **Find Partners**.
3. Filters are sent to `GET /api/matches`.
4. The backend calculates compatibility using the assignment scoring rules:
   - Same goal: +40
   - Same English level: +25
   - Same practice time: +20
   - Same country: +10
   - Same native language: +5
5. Results are sorted by score and limited to the Top 5.
6. Click **Connect** to create a pending connection request.
7. Switch to another demo user to accept/reject requests.
8. Once accepted, a connection is shown as active and a Practice Mission becomes available.

## Requirements

- Node.js 18+
- npm 9+
- MongoDB 6+ or MongoDB Atlas

## Backend setup

```bash
cd backend
npm install
cp .env.example .env
npm run seed
npm run dev
```

Backend runs on `http://localhost:5000` by default.

## Frontend setup

Open another terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend runs on `http://localhost:5173` by default.

## Demo users

The seed script creates several realistic users. The frontend includes a user switcher so the assignment can be demonstrated without adding a full authentication system, because authentication is not required by the supplied specification.

## API documentation

### Profile

`POST /api/profile`

Create a profile.

`GET /api/profile`

Get the current profile. The current user is selected through the `X-User-Id` request header.

`PUT /api/profile`

Update the current profile.

### Users

`GET /api/users`

List users with optional query parameters:

- `englishLevel`
- `learningGoal`
- `country`
- `search`

### Matches

`GET /api/matches`

Returns compatible users for the current user. Optional filters:

- `englishLevel`
- `learningGoal`
- `country`

Results are ranked descending by score and limited to five.

### Connections

`POST /api/connections`

Body:

```json
{
  "receiverId": "USER_ID"
}
```

`GET /api/connections`

Returns incoming/outgoing requests and accepted connections for the current user.

`PUT /api/connections/:id`

Body:

```json
{
  "status": "accepted"
}
```

or

```json
{
  "status": "rejected"
}
```

Only the receiver can accept/reject a pending request.

## Matching algorithm

The matching score is the exact sum of matching profile attributes:

```text
same learning goal      +40
same English level      +25
same practice time     +20
same country            +10
same native language     +5
                         ---
maximum                 100
```

A score is displayed as a percentage because the maximum is 100.

## Database design

### User/Profile

- `id`
- `name`
- `englishLevel`
- `learningGoal`
- `nativeLanguage`
- `country`
- `preferredTime`
- `bio`
- `createdAt`
- `updatedAt`

### Connection

- `id`
- `senderId`
- `receiverId`
- `status`
- `createdAt`
- `updatedAt`

## Assumptions

- Full login/authentication is outside the supplied assignment scope, so a demo user switcher is used to demonstrate sender/receiver behavior.
- Every profile is a practice-partner candidate unless it is the current user or already has an active/pending connection relationship. Rejected requests can be sent again.
- The assignment asks for the Top 5 compatible users; the API applies the limit after sorting.
- No real messaging or calling is implemented because the specification explicitly says these are not required.

## What I would improve with more time

- Real authentication using JWT/session cookies
- Profile photos and richer onboarding
- Pagination for larger user datasets
- More advanced availability overlap scoring
- Notifications for new connection requests
- Real-time chat/video after connection
- Automated tests and CI/CD
- Production observability, rate limiting, and audit logging

## Docker

Start MongoDB, backend, and frontend with:

```bash
docker compose up --build
```

Then open `http://localhost:5173`.

## Deployment notes

### MongoDB

Create a MongoDB Atlas cluster and set `MONGODB_URI` in the backend environment.

### Backend

Deploy `backend/` to Render or Railway. Set:

```text
MONGODB_URI=<your Atlas connection string>
PORT=5000
CLIENT_URL=<your deployed frontend URL>
```

### Frontend

Deploy `frontend/` to Vercel, Netlify, or similar. Set:

```text
VITE_API_URL=<your deployed backend URL>/api
```

## Git commands

```bash
git init
git add .
git commit -m "Build FluentFeed practice partners assignment"
git branch -M main
git remote add origin <YOUR_GITHUB_REPOSITORY_URL>
git push -u origin main
```
