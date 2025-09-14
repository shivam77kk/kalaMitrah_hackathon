import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import Buyer from '../models/BuyerSchema.js';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const initializeBuyerGoogleStrategy = () => {
    passport.use('google-buyer', new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:5000/api/auth/google/callback/buyer'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            // Validate required profile data
            if (!profile.emails || profile.emails.length === 0) {
                return done(new Error('No email provided by Google'), null);
            }

            let buyer = await Buyer.findOne({ googleId: profile.id });
            if (!buyer) {
                buyer = await Buyer.findOne({ email: profile.emails[0].value });
                if (buyer) {
                    buyer.googleId = profile.id;
                    await buyer.save();
                } else {
                    const newBuyer = {
                        googleId: profile.id,
                        name: profile.displayName || 'Unknown User',
                        email: profile.emails[0].value,
                        profilePhotoUrl: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : '',
                        refreshToken: ''
                    };
                    buyer = new Buyer(newBuyer);
                    await buyer.save();
                }
            }
            done(null, buyer);
        } catch (error) {
            done(error, null);
        }
    }));
};

export const googleBuyerCallbackHandler = async (req, res) => {
    try {
        const accessToken = jwt.sign(
            { id: req.user._id, role: 'buyer' },
            process.env.JWT_ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        );
        const refreshToken = jwt.sign(
            { id: req.user._id, role: 'buyer' },
            process.env.JWT_REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        req.user.refreshToken = refreshToken;
        await req.user.save();

        // Redirect to a frontend page with the access token
        res.redirect(`http://localhost:3000/dashboard?token=${accessToken}`);
    } catch (error) {
        res.status(500).json({ message: 'Error during Google login', error: error.message });
    }
};

export const googleBuyerLogoutHandler = (req, res) => {
    try {
        req.logout((err) => {
            if (err) {
                return res.status(500).json({ message: 'Error during logout', error: err.message });
            }
            res.clearCookie('jwt');
            res.status(200).json({ message: 'Logged out successfully' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Error during logout', error: error.message });
    }
};
