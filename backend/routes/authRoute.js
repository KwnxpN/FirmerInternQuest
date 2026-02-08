import express from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { login, logout, me } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/me', authMiddleware, me);

export default router;