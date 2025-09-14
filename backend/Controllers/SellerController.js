import Seller from '../models/SellerSchema.js';
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
            { id: userId, role: 'seller' },
            process.env.JWT_ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' } 
        );

        const refreshToken = jwt.sign(
            { id: userId, role: 'seller' },
            process.env.JWT_REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' } 
        );

        return { accessToken, refreshToken };
    } catch (error) {
        throw new Error("Failed to generate tokens");
    }
};

// --- Seller Registration ---
export const registerSeller = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Name, email, and password are required" });
        }

        const existingSeller = await Seller.findOne({ email });
        if (existingSeller) {
            return res.status(409).json({ success: false, message: "Seller with this email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newSeller = new Seller({
            name,
            email,
            password: hashedPassword,
            refreshToken: ""
        });

        await newSeller.save();

        res.status(201).json({ 
            success: true, 
            message: "Seller registered successfully"
        });
    } catch (error) {
        console.error("Seller registration error:", error.message);
        res.status(500).json({ success: false, message: "Server error during registration." });
    }
};

// --- Seller Login with Email/Password ---
export const loginSeller = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        const seller = await Seller.findOne({ email }).select('+password');
        if (!seller) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, seller.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const { accessToken, refreshToken } = await generateTokens(seller._id);

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        seller.refreshToken = refreshToken;
        await seller.save();

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            accessToken,
            user: {
                id: seller._id,
                name: seller.name,
                email: seller.email,
                profilePhotoUrl: seller.profilePhotoUrl
            }
        });
    } catch (error) {
        console.error("Seller login error:", error.message);
        res.status(500).json({ success: false, message: "Server error during login." });
    }
};

// --- Update Seller Profile ---
export const updateSellerProfile = async (req, res) => {
    try {
        const { name, description, instagramLink } = req.body;
        const sellerId = req.user.id;

        const seller = await Seller.findById(sellerId);
        if (!seller) {
            return res.status(404).json({ success: false, message: "Seller not found" });
        }

        if (name) {
            seller.name = name;
        }
        if (description) {
            seller.description = description;
        }
        if (instagramLink) {
            seller.instagramLink = instagramLink;
        }

        await seller.save();

        res.status(200).json({
            success: true,
            message: "Seller profile updated successfully",
            seller: {
                id: seller._id,
                name: seller.name,
                email: seller.email,
                description: seller.description,
                instagramLink: seller.instagramLink
            }
        });
    } catch (error) {
        console.error("Update seller profile error:", error.message);
        res.status(500).json({ success: false, message: "Server error during profile update." });
    }
};


// --- Upload Seller Profile Image ---
export const uploadProfileImage = async (req, res) => {
    try {
        const sellerId = req.user.id; 
        const seller = await Seller.findById(sellerId);

        if (!seller) {
            return res.status(404).json({ success: false, message: "Seller not found" });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: "No image file provided" });
        }

        const result = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`, {
            folder: 'marketplace_profile_images',
        });

        seller.profilePhotoUrl = result.secure_url;
        await seller.save();

        res.status(200).json({
            success: true,
            message: "Profile image uploaded successfully",
            profilePhotoUrl: seller.profilePhotoUrl
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


// --- Change Seller Password ---
export const changePassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        const sellerId = req.user.id;

        if (!newPassword || newPassword.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });
        }

        const seller = await Seller.findById(sellerId).select('+password');
        if (!seller) {
            return res.status(404).json({ success: false, message: "Seller not found" });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        seller.password = hashedNewPassword;
        await seller.save();

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

        const seller = await Seller.findOne({ refreshToken });
        if (!seller) {
            return res.status(403).json({ success: false, message: "Invalid refresh token" });
        }

        jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET, async (err, decoded) => {
            if (err || decoded.id !== seller._id.toString()) {
                return res.status(403).json({ success: false, message: "Invalid or expired refresh token" });
            }

            const { accessToken, refreshToken: newRefreshToken } = await generateTokens(seller._id);

            res.cookie('jwt', newRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
            
            seller.refreshToken = newRefreshToken;
            await seller.save();

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

// --- Seller Logout ---
export const logoutSeller = async (req, res) => {
    try {
        const refreshToken = req.cookies.jwt;
        
        if (refreshToken) {
            const seller = await Seller.findOne({ refreshToken });
            if (seller) {
                seller.refreshToken = '';
                await seller.save();
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
