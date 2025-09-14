import jwt from 'jsonwebtoken';
import Seller from '../models/SellerSchema.js';
import 'dotenv/config';

export const authenticateToken = (req, res, next) => {
   
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).json({ success: false, message: "Authentication token missing" });
    }


    jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ success: false, message: "Invalid or expired token" });
        }
        

        req.user = decoded;
        next();
    });
};


export const isSeller = async (req, res, next) => {
    try {
        if (!req.user || req.user.role !== 'seller') {
            return res.status(403).json({ success: false, message: "Access denied. Not a seller." });
        }
        
        const seller = await Seller.findById(req.user.id);
        if (!seller) {
            return res.status(404).json({ success: false, message: "Seller not found" });
        }

        next();
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error during seller verification." });
    }
};
