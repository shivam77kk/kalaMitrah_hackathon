import express from 'express';
import { authenticateToken } from '../middlewares/AuthMiddleware.js';
import {
    getCart,
    addItemToCart,
    updateCartItem,
    removeItemFromCart
} from '../Controllers/CartController.js';

const router = express.Router();

router.get('/', authenticateToken,  getCart);

router.post('/add', authenticateToken, addItemToCart);

router.put('/update', authenticateToken, updateCartItem);

router.delete('/remove/:productId', authenticateToken, removeItemFromCart);

export default router;
