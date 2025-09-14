import express from 'express';
import passport from 'passport';
import { initializeSellerGoogleStrategy, googleSellerCallbackHandler, googleSellerLogoutHandler } from '../Controllers/SellerGoogleAuthController.js';

const router = express.Router();

initializeSellerGoogleStrategy();

router.get('/google',
    passport.authenticate('google-seller', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
    passport.authenticate('google-seller', { failureRedirect: 'http://localhost:3000/login' }),
    googleSellerCallbackHandler
);

router.post('/logout', googleSellerLogoutHandler);

export default router;
