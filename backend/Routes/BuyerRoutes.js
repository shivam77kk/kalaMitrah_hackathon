import express from 'express';
import {
    registerBuyer,
    loginBuyer,
    updateBuyerProfile,
    uploadProfileImage,
    changePassword,
    refreshAccessToken,
    logoutBuyer
} from '../Controllers/BuyerController.js';
import { authenticateToken } from '../middlewares/AuthMiddleware.js';
import { uploadImage } from '../middlewares/CloudinaryUploadMIddleware.js';

const router = express.Router();

// Public routes for authentication
router.post('/register', registerBuyer);
router.post('/login', loginBuyer);

// Protected routes for profile management
router.post('/profile/update', authenticateToken, updateBuyerProfile);
router.post('/profile/upload-image', authenticateToken, uploadImage.single('image'), uploadProfileImage);
router.post('/profile/change-password', authenticateToken, changePassword);

// Token management routes
router.get('/refresh-token', refreshAccessToken);
router.get('/logout', logoutBuyer);

export default router;
