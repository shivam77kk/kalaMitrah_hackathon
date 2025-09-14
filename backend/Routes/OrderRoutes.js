import express from 'express';
import { 
    placeOrder, 
    getBuyerOrders, 
    getSellerSales, 
    updateOrderStatus 
} from '../Controllers/OrderController.js';
import { authenticateToken, isSeller } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

router.post('/place-order', authenticateToken,  placeOrder);

router.get('/my-orders', authenticateToken,  getBuyerOrders);

router.get('/seller-sales', authenticateToken, isSeller, getSellerSales);

router.patch('/:orderId/status', authenticateToken, isSeller, updateOrderStatus);

export default router;
