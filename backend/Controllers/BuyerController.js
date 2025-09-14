import Buyer from '../models/BuyerSchema.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import 'dotenv/config';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const generateTokens = async (userId) => {
    try {
        const accessToken = jwt.sign(
            { id: userId, role: 'buyer' },
            process.env.JWT_ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { id: userId, role: 'buyer' },
            process.env.JWT_REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        );

        return { accessToken, refreshToken };
    } catch (error) {
        throw new Error("Failed to generate tokens");
    }
};

// --- Buyer Registration ---
export const registerBuyer = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Name, email, and password are required" });
        }

        const existingBuyer = await Buyer.findOne({ email });
        if (existingBuyer) {
            return res.status(409).json({ success: false, message: "Buyer with this email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newBuyer = new Buyer({
            name,
            email,
            password: hashedPassword,
            refreshToken: ""
        });

        await newBuyer.save();

        res.status(201).json({
            success: true,
            message: "Buyer registered successfully"
        });
    } catch (error) {
        console.error("Buyer registration error:", error.message);
        res.status(500).json({ success: false, message: "Server error during registration." });
    }
};

// --- Buyer Login with Email/Password ---
export const loginBuyer = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        const buyer = await Buyer.findOne({ email }).select('+password');
        if (!buyer) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, buyer.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const { accessToken, refreshToken } = await generateTokens(buyer._id);

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        buyer.refreshToken = refreshToken;
        await buyer.save();

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            accessToken,
            user: {
                id: buyer._id,
                name: buyer.name,
                email: buyer.email,
                profilePhotoUrl: buyer.profilePhotoUrl
            }
        });
    } catch (error) {
        console.error("Buyer login error:", error.message);
        res.status(500).json({ success: false, message: "Server error during login." });
    }
};

// --- Update Buyer Profile ---
export const updateBuyerProfile = async (req, res) => {
    try {
        const { name, description } = req.body;
        const buyerId = req.user.id;

        const buyer = await Buyer.findById(buyerId);
        if (!buyer) {
            return res.status(404).json({ success: false, message: "Buyer not found" });
        }

        if (name) {
            buyer.name = name;
        }
        if (description) {
            buyer.description = description;
        }

        await buyer.save();

        res.status(200).json({
            success: true,
            message: "Buyer profile updated successfully",
            buyer: {
                id: buyer._id,
                name: buyer.name,
                email: buyer.email,
                description: buyer.description,
                profilePhotoUrl: buyer.profilePhotoUrl
            }
        });
    } catch (error) {
        console.error("Update buyer profile error:", error.message);
        res.status(500).json({ success: false, message: "Server error during profile update." });
    }
};

// --- Upload Buyer Profile Image ---
export const uploadProfileImage = async (req, res) => {
    try {
        const buyerId = req.user.id;
        const buyer = await Buyer.findById(buyerId);

        if (!buyer) {
            return res.status(404).json({ success: false, message: "Buyer not found" });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: "No image file provided" });
        }

        const result = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`, {
            folder: 'marketplace_buyer_profile_images',
        });

        buyer.profilePhotoUrl = result.secure_url;
        await buyer.save();

        res.status(200).json({
            success: true,
            message: "Profile image uploaded successfully",
            profilePhotoUrl: buyer.profilePhotoUrl
        });

    } catch (error) {
        console.error("Cloudinary upload error:", {
            message: error.message,
            stack: error.stack,
            name: error.name,
            http_code: error.http_code
        });
        res.status(500).json({ success: false, message: "Error uploading image to Cloudinary", error: error.message });
    }
};


// --- Change Buyer Password ---
export const changePassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        const buyerId = req.user.id;

        if (!newPassword || newPassword.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });
        }

        const buyer = await Buyer.findById(buyerId).select('+password');
        if (!buyer) {
            return res.status(404).json({ success: false, message: "Buyer not found" });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        buyer.password = hashedNewPassword;
        await buyer.save();

        res.status(200).json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        console.error("Change password error:", error.message);
        res.status(500).json({ success: false, message: "Server error during password change." });
    }
};

// --- Refresh Access Token ---
export const refreshAccessToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.jwt;
        if (!refreshToken) {
            return res.status(401).json({ success: false, message: "Refresh token is missing" });
        }

        const buyer = await Buyer.findOne({ refreshToken });
        if (!buyer) {
            return res.status(403).json({ success: false, message: "Invalid refresh token" });
        }

        jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET, async (err, decoded) => {
            if (err || decoded.id !== buyer._id.toString()) {
                return res.status(403).json({ success: false, message: "Invalid or expired refresh token" });
            }

            const { accessToken, refreshToken: newRefreshToken } = await generateTokens(buyer._id);

            res.cookie('jwt', newRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            buyer.refreshToken = newRefreshToken;
            await buyer.save();

            res.status(200).json({
                success: true,
                message: "Tokens refreshed successfully",
                accessToken,
            });
        });

    } catch (error) {
        console.error("Refresh token error:", error.message);
        res.status(500).json({ success: false, message: "Server error during token refresh." });
    }
};

// --- Buyer Logout ---
export const logoutBuyer = async (req, res) => {
    try {
        const refreshToken = req.cookies.jwt;

        if (refreshToken) {
            const buyer = await Buyer.findOne({ refreshToken });
            if (buyer) {
                buyer.refreshToken = '';
                await buyer.save();
            }
        }

        res.clearCookie('jwt', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
        });

        res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error.message);
        res.status(500).json({ success: false, message: "Error during logout." });
    }
};
