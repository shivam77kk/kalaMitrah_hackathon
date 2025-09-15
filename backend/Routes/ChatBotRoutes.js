import express from 'express';
import { sendMessage } from '../Controllers/ChatBotController.js';
import { authenticateToken } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

// Test route without authentication for debugging
router.post('/test', sendMessage);

// Authenticated route
router.post('/send', authenticateToken, sendMessage);

export default router;
