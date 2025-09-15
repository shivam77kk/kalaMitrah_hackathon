import express from 'express';
import { authenticateToken, isSeller } from '../middlewares/AuthMiddleware.js';
import {
    placeOrder,
    getBuyerOrders,
    getSellerSales,
    updateOrderStatus
} from '../Controllers/OrderController.js';

const router = express.Router();

// --- Buyer-specific routes ---
router.post('/place', authenticateToken, placeOrder);
router.get('/my-orders', authenticateToken, getBuyerOrders);

// --- Seller-specific routes ---
router.get('/sales', authenticateToken, isSeller, getSellerSales);
router.put('/:orderId/status', authenticateToken, isSeller, updateOrderStatus);

export default router;
