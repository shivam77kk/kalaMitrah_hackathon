import express from 'express';
import { getArtisanInsights, generateGrowthPlan } from '../Controllers/ArtisanInsightsController.js';
import { authenticateToken, isSeller } from '../middlewares/AuthMiddleware.js';

const router = express.Router();


router.use(authenticateToken);
router.use(isSeller);

router.get('/insights', getArtisanInsights);

router.post('/insights/generate-plan', generateGrowthPlan);

export default router;
