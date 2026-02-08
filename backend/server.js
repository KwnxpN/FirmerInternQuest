import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import logsRoutes from './routes/logsRoutes.js';
import usersRoutes from './routes/usersRoutes.js';
import authRoutes from './routes/authRoute.js';
import { connectDB } from './config/db.js';
import './models/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

connectDB();

app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
}));

app.use('/api/logs', logsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});