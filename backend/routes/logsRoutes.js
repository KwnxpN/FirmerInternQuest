import express from 'express';
import { getAllLogs, generate } from '../controllers/logsController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getAllLogs);
router.get('/generate', generate);

export default router;