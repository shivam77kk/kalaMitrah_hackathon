import express from 'express';
import { authenticateToken, isSeller, isBuyer } from '../middlewares/AuthMiddleware.js';
import {
    placeOrder,
    getBuyerOrders,
    getSellerSales,
    getOrderById,
    updateOrderStatus
} from '../Controllers/OrderController.js';

const router = express.Router();

// --- Buyer-specific routes ---
router.post('/place', authenticateToken, isBuyer, placeOrder);
router.get('/my-orders', authenticateToken, isBuyer, getBuyerOrders);

// --- Seller-specific routes ---
router.get('/sales', authenticateToken, isSeller, getSellerSales);

// --- Common routes (for both buyers and sellers) ---
router.get('/:orderId', authenticateToken, getOrderById);
router.put('/:orderId/status', authenticateToken, isSeller, updateOrderStatus);

export default router;
