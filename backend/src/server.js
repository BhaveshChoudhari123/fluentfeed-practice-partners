import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import profileRoutes from './routes/profileRoutes.js';
import userRoutes from './routes/userRoutes.js';
import matchRoutes from './routes/matchRoutes.js';
import connectionRoutes from './routes/connectionRoutes.js';
import missionRoutes from './routes/missionRoutes.js';

const app = express();
const port = Number(process.env.PORT || 5000);

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked origin: ${origin}`));
  }
}));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'fluentfeed-backend' });
});

app.use('/api/profile', profileRoutes);
app.use('/api/users', userRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/missions', missionRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use((error, _req, res, _next) => {
  console.error(error);

  if (error.message?.startsWith('CORS blocked origin:')) {
    return res.status(403).json({ message: error.message });
  }

  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map((item) => item.message);
    return res.status(400).json({ message: messages.join(' ') });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid identifier supplied.' });
  }

  res.status(500).json({ message: error.message || 'Unexpected server error.' });
});

async function start() {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`FluentFeed API running on http://localhost:${port}`);
      console.log(`Allowed frontend origins: ${allowedOrigins.join(', ')}`);
    });
  } catch (error) {
    console.error('\nFluentFeed backend could not start.');
    console.error(error.message);
    console.error('Make sure MongoDB is running and MONGODB_URI is correct.\n');
    process.exit(1);
  }
}

start();
