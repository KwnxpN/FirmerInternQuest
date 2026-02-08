import express from 'express';
import { getAllLogs } from '../controllers/logsController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getAllLogs);

export default router;