import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import 'dotenv/config';

import { authenticateToken, isSeller } from './middlewares/AuthMiddleware.js';
import { uploadImage, uploadVideo } from './middlewares/CloudinaryUploadMIddleware.js';

import buyerRoutes from './Routes/BuyerRoutes.js';
import sellerRoutes from './Routes/SellerRoutes.js';
import productRoutes from './Routes/ProductRoutes.js';
import trendsRoutes from './Routes/TrendsRoutes.js';
import orderRoutes from './Routes/OrderRoutes.js';
import categoryRoutes from './Routes/CategoryRoutes.js';
import newsRoutes from './Routes/GlobalArtNewsRoutes.js';
import artisanInsightsRoutes from './Routes/ArtisanInsightsRoutes.js';
import cartRoutes from './Routes/CartRoutes.js';
import paymentRoutes from './Routes/PaymentRoutes.js';

import buyerGoogleAuthRoutes from './Routes/BuyerGoogleAuthRoutes.js';
import sellerGoogleAuthRoutes from './Routes/SellerGoogleAuthRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
    },
}));
app.use(passport.initialize());
app.use(passport.session());

// Passport serialization
passport.serializeUser((user, done) => {
    done(null, { id: user._id, role: user.googleId ? (user.businessName ? 'seller' : 'buyer') : user.role });
});

passport.deserializeUser(async (sessionUser, done) => {
    try {
        let user;
        if (sessionUser.role === 'buyer') {
            const { default: Buyer } = await import('./models/BuyerSchema.js');
            user = await Buyer.findById(sessionUser.id);
        } else if (sessionUser.role === 'seller') {
            const { default: Seller } = await import('./models/SellerSchema.js');
            user = await Seller.findById(sessionUser.id);
        }
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// Authentication Routes (Email/Password)
app.use('/api/auth/buyers', buyerRoutes);
app.use('/api/auth/sellers', sellerRoutes);

// Google Authentication Routes
app.use('/api/auth/google', buyerGoogleAuthRoutes);
app.use('/api/auth/google', sellerGoogleAuthRoutes);

// Product, Trends, and Marketplace Routes
app.use('/api/products', productRoutes);
app.use('/api/trends', trendsRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/artisan', artisanInsightsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/payment', paymentRoutes);

app.get('/protected-route', authenticateToken, (req, res) => {
    res.status(200).json({ message: `Welcome ${req.user.role}, you have access!`, user: req.user });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
