import express from 'express';
import { authenticateToken, isBuyer } from '../middlewares/AuthMiddleware.js';
import { createCheckoutSession, handleWebhook } from '../Controllers/PaymentController.js';
import raw from 'body-parser';

const router = express.Router();

router.post('/create-checkout-session', authenticateToken, isBuyer, createCheckoutSession);

router.post('/webhook', raw.text({type: 'application/json'}), handleWebhook);

export default router;
