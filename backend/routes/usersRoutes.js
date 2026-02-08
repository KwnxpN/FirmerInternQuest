import express from 'express';
import { getAllUsers } from '../controllers/usersController.js';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', adminMiddleware, getAllUsers);

export default router;