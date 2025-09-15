import express from 'express';
import {
    createProduct,
    getAllProducts,
    getSellerProducts,
    getProductById,
    getTrendingProducts,
    generateAIdescription,
    generateAIPrice,
    editProductImage,
    editTrendVideo,
} from '../Controllers/ProductController.js';
import { authenticateToken, isSeller } from '../middlewares/AuthMiddleware.js';
import { uploadImage, uploadVideo } from '../middlewares/CloudinaryUploadMIddleware.js';

const router = express.Router();


router.get('/', getAllProducts);

router.get('/trending', getTrendingProducts);

// --- Seller-only Routes (protected) ---
router.get('/seller/my-products', authenticateToken, isSeller, getSellerProducts);

// Create a new product with image uploads
router.post('/', authenticateToken, isSeller, uploadImage.array('images', 5), createProduct);

router.get('/:productId', getProductById);

// --- AI-powered Features (Seller-only) ---
router.post('/ai/description', authenticateToken, isSeller, generateAIdescription);

router.post('/ai/price-suggestion', authenticateToken, isSeller, generateAIPrice);

router.post('/:productId/ai/image-edit', authenticateToken, isSeller, uploadImage.single('image'), editProductImage);

router.post('/trends/:trendId/ai/video-edit', authenticateToken, isSeller, editTrendVideo);


export default router;
