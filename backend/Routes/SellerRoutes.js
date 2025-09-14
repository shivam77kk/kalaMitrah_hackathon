import express from 'express';
import {
    registerSeller,
    loginSeller,
    logoutSeller,
    updateSellerProfile,
    uploadProfileImage,
    changePassword,
    refreshAccessToken
} from '../Controllers/SellerController.js';
import { authenticateToken, isSeller } from '../middlewares/AuthMiddleware.js';
import { uploadImage } from '../middlewares/CloudinaryUploadMIddleware.js';

const router = express.Router();

router.post('/register', registerSeller);

router.post('/login', loginSeller);

router.post('/refresh', refreshAccessToken);

// --- Protected Routes (Profile Management) ---
// All routes below this line will require a valid token to access
router.use(authenticateToken);

// Route for a seller to update their profile information and Instagram link
router.put('/profile', isSeller, updateSellerProfile);

router.post('/profile/image', isSeller, uploadImage.single('image'), uploadProfileImage);

router.put('/password', isSeller, changePassword);

router.post('/logout', isSeller, logoutSeller);

export default router;
