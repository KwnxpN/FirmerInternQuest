import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

dotenv.config();

import logsRoutes from './routes/logsRoutes.js';
import usersRoutes from './routes/usersRoutes.js';
import authRoutes from './routes/authRoute.js';
import { connectDB } from './config/db.js';
import './models/index.js';


const app = express();
const PORT = process.env.PORT || 5001;

connectDB();

app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: process.env.CORS_ORIGIN_LOCAL_NGINX,
  origin: process.env.CORS_ORIGIN_LOCAL,
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));

app.use('/api/logs', logsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});