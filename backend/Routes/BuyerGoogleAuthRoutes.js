import express from 'express';
import passport from 'passport';
import { initializeBuyerGoogleStrategy, googleBuyerCallbackHandler, googleBuyerLogoutHandler } from '../Controllers/BuyerGoogleAuthController.js';

const router = express.Router();

initializeBuyerGoogleStrategy();

router.get('/google',
    passport.authenticate('google-buyer', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
    passport.authenticate('google-buyer', { failureRedirect: 'http://localhost:3000/login' }),
    googleBuyerCallbackHandler
);

router.post('/logout', googleBuyerLogoutHandler);

export default router;
