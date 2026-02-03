import express from 'express';
import { getAllLogs } from '../controllers/logsController.js';

const router = express.Router();

router.get('/', getAllLogs);

export default router;