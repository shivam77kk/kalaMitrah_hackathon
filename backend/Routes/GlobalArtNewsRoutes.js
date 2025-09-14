import express from 'express';
import { getGlobalArtNews } from '../Controllers/GlobalArtNewsController.js';
import { authenticateToken, isSeller } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

router.get('/', authenticateToken, isSeller, getGlobalArtNews);

export default router;
