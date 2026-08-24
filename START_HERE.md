# FluentFeed — Start Here

## Important
This assignment uses MongoDB. The frontend cannot work until the backend can connect to MongoDB.

## Fastest local setup

### 1. Start MongoDB
Either:
- Run MongoDB locally on `mongodb://127.0.0.1:27017`, or
- Use MongoDB Atlas and put the connection string in `backend/.env`.

### 2. Backend
```bash
cd backend
npm install
# copy .env.example to .env
npm run seed
npm run dev
```

Expected backend URL:
`http://localhost:5000`

Check:
`http://localhost:5000/api/health`

You should see:
```json
{"ok":true,"service":"fluentfeed-backend"}
```

### 3. Frontend
Open a second terminal:
```bash
cd frontend
npm install
# copy .env.example to .env
npm run dev
```

Open the Vite URL shown in the terminal, normally:
`http://localhost:5173`

## If you see "Cannot reach the FluentFeed backend"
Check:
1. Backend terminal is running.
2. MongoDB is running.
3. `frontend/.env` contains `VITE_API_URL=http://localhost:5000/api`.
4. `backend/.env` contains a valid `MONGODB_URI`.

## If you see "MONGODB_URI is not configured"
Copy:
`backend/.env.example` → `backend/.env`

## If you see "Current user not found"
Run:
```bash
cd backend
npm run seed
```
Then refresh the frontend.
