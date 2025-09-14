import express from 'express';
import { 
    createTrend, 
    getAllTrends, 
    likeTrend 
} from '../Controllers/TrendsController.js';
import { authenticateToken, isSeller } from '../middlewares/AuthMiddleware.js';
import { uploadVideo } from '../middlewares/CloudinaryUploadMIddleware.js';

const router = express.Router();


router.get('/', getAllTrends);

router.post('/', authenticateToken, isSeller, uploadVideo.single('video'), createTrend);

router.patch('/:trendId/like', authenticateToken,  likeTrend);

export default router;
