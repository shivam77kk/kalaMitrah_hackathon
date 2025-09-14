import express from 'express';
import {
    createCategory,
    getAllCategories,
    getProductsByCategory,
} from '../Controllers/CategoryController.js';
import { authenticateToken, isSeller } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

router.post('/', authenticateToken, isSeller, createCategory);

router.get('/', getAllCategories);

router.get('/:categoryId/products', getProductsByCategory);

export default router;
