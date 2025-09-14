import Trend from '../models/TrendsSchema.js';
import Seller from '../models/SellerSchema.js';
import Buyer from '../models/BuyerSchema.js';
import { v2 as cloudinary } from 'cloudinary';
import 'dotenv/config';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


export const createTrend = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const { title, description } = req.body;
        const videoFile = req.file;

        if (!title || !videoFile) {
            return res.status(400).json({ success: false, message: "A title and a video file are required." });
        }

        const seller = await Seller.findById(sellerId);
        if (!seller) {
            return res.status(404).json({ success: false, message: "Seller not found." });
        }

        const result = await cloudinary.uploader.upload(`data:${videoFile.mimetype};base64,${videoFile.buffer.toString('base64')}`, {
            resource_type: "video",
            folder: 'trends'
        });

        const newTrend = new Trend({
            title,
            description,
            videoUrl: result.secure_url,
            seller: sellerId
        });

        await newTrend.save();

        seller.trendsVideos.push(newTrend._id);
        await seller.save();

        res.status(201).json({ success: true, message: "Trend created successfully", data: newTrend });
    } catch (error) {
        console.error("Error creating trend:", error.message);
        res.status(500).json({ success: false, message: "Server error creating trend." });
    }
};


export const getAllTrends = async (req, res) => {
    try {
        const trends = await Trend.find({})
            .populate('seller', 'name profilePhotoUrl')
            .sort({ createdAt: -1 })
            .lean();

        res.status(200).json({ success: true, message: "Trends fetched successfully", data: trends });
    } catch (error) {
        console.error("Error fetching all trends:", error.message);
        res.status(500).json({ success: false, message: "Server error fetching trends." });
    }
};


export const likeTrend = async (req, res) => {
    try {
        const { trendId } = req.params;
        const buyerId = req.user.id;

        const trend = await Trend.findById(trendId);
        if (!trend) {
            return res.status(404).json({ success: false, message: "Trend not found." });
        }

        const buyer = await Buyer.findById(buyerId);
        if (!buyer) {
            return res.status(404).json({ success: false, message: "Buyer not found." });
        }
        
        if (buyer.likedTrends.includes(trendId)) {
            return res.status(409).json({ success: false, message: "You have already liked this trend." });
        }

        trend.likesCount += 1;
        buyer.likedTrends.push(trendId);

        await trend.save();
        await buyer.save();

        res.status(200).json({ success: true, message: "Trend liked successfully", likesCount: trend.likesCount });
    } catch (error) {
        console.error("Error liking trend:", error.message);
        res.status(500).json({ success: false, message: "Server error liking trend." });
    }
};
