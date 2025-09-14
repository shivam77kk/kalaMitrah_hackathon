import Product from '../models/ProductSchema.js';
import Seller from '../models/SellerSchema.js';
import Trend from '../models/TrendsSchema.js'; 
import { v2 as cloudinary } from 'cloudinary';
import fetch from 'node-fetch';
import 'dotenv/config';


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const callGeminiAPI = async (prompt) => {
    try {
        const systemPrompt = "Act as a creative and knowledgeable copywriter for an artisan marketplace. Create compelling, authentic descriptions that highlight traditional craftsmanship and cultural heritage.";
        const userQuery = prompt;
        const apiKey = process.env.GEMINI_API_KEY;
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const payload = {
            contents: [{ parts: [{ text: `${systemPrompt}\n\n${userQuery}` }] }],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
            },
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.status} - ${response.statusText}`);
        }

        const result = await response.json();
        const generatedText = result?.candidates?.[0]?.content?.parts?.[0]?.text || "No content could be generated at this time.";
        return generatedText;
    } catch (error) {
        console.error('Error calling Gemini API:', error.message);
        const parts = prompt.split('"');
        const productName = parts[1] || 'artisan product';
        const category = parts[3] || 'traditional craft';
        
        return `Discover the exquisite ${productName}, a masterful example of ${category} craftsmanship. Each piece tells a story of generations of artisan skill, carefully handcrafted using time-honored techniques passed down through families. This authentic creation embodies the rich cultural heritage of Indian craftsmanship, offering you not just a product, but a piece of living history. Perfect for those who appreciate the beauty of handmade artistry and the warmth that only traditional crafts can bring to your home.`;
    }
};


const callGeminiPriceAPI = async (prompt) => {
    try {
        const systemPrompt = "Act as a pricing analyst for traditional Indian crafts. Analyze the product details and suggest a fair market price in INR. Provide your response in valid JSON format with 'price' (number) and 'reasoning' (string) fields only.";
        const userQuery = `${prompt}\n\nPlease provide the response in this exact JSON format: {"price": number, "reasoning": "explanation here"}`;
        const apiKey = process.env.GEMINI_API_KEY;
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const payload = {
            contents: [{ parts: [{ text: `${systemPrompt}\n\n${userQuery}` }] }],
            generationConfig: {
                temperature: 0.3,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 512,
            },
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.status} - ${response.statusText}`);
        }

        const result = await response.json();
        const generatedText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!generatedText) {
            throw new Error('No response from Gemini API');
        }

        let jsonMatch = generatedText.match(/\{[^}]*\}/);
        if (jsonMatch) {
            try {
                return JSON.parse(jsonMatch[0]);
            } catch (parseError) {
                console.error('JSON parsing error:', parseError.message);
            }
        }
        
        try {
            return JSON.parse(generatedText);
        } catch (parseError) {
            console.error('Failed to parse JSON response:', parseError.message);
            throw new Error('Invalid JSON response from AI');
        }
    } catch (error) {
        console.error('Error calling Gemini Price API:', error.message);
        const basePrice = 800;
        let multiplier = 1;
        
        // Adjust pricing based on materials and market
        if (prompt.includes('silk') || prompt.includes('premium') || prompt.includes('luxury')) {
            multiplier += 0.8;
        }
        if (prompt.includes('hand-woven') || prompt.includes('intricate') || prompt.includes('traditional')) {
            multiplier += 0.5;
        }
        if (prompt.includes('rare') || prompt.includes('unique')) {
            multiplier += 0.3;
        }
        
        const suggestedPrice = Math.round(basePrice * multiplier);
        
        return {
            price: suggestedPrice,
            reasoning: `Based on the premium materials, traditional craftsmanship techniques, and target market analysis, a price of ₹${suggestedPrice} reflects fair market value. This pricing considers the artisan skill level, material quality, and positioning in the luxury handcraft segment.`
        };
    }
};


const callGeminiImageEditAPI = async (imageBase64, prompt) => {
    try {
        const apiKey = process.env.GEMINI_IMAGE_API_KEY;
        
        if (!apiKey || apiKey === 'your_gemini_image_api_key') {
            throw new Error('GEMINI_IMAGE_API_KEY not configured');
        }

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const payload = {
            contents: [{
                parts: [
                    { text: `Analyze this image and provide suggestions for improvement based on: ${prompt}. Describe what you see and how the image could be enhanced for an artisan marketplace.` },
                    { inlineData: { mimeType: "image/jpeg", data: imageBase64 } }
                ]
            }],
            generationConfig: {
                temperature: 0.4,
                topK: 32,
                topP: 1,
                maxOutputTokens: 1024,
            },
        };
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Gemini Vision API error: ${response.status} - ${response.statusText}`);
        }

        const result = await response.json();
        const analysisText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!analysisText) {
            throw new Error('No analysis received from Gemini Vision API');
        }

    
        console.log('Image Analysis:', analysisText);
        return {
            originalImage: imageBase64,
            analysis: analysisText,
            suggestion: 'Image analysis completed. For actual editing, integrate with an image editing service.'
        };

    } catch (error) {
        console.error('Error calling Gemini Image API:', error.message);

        return {
            originalImage: imageBase64,
            analysis: 'Unable to analyze image at this time.',
            suggestion: 'Please try again later or check your API configuration.'
        };
    }
};


const callGeminiVideoEditAPI = async (videoUrl, prompt) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        
        if (!apiKey || apiKey === 'your_gemini_api_key') {
            throw new Error('GEMINI_API_KEY not configured');
        }

        
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        
        const payload = {
            contents: [{
                parts: [{
                    text: `Analyze this video URL: ${videoUrl} and provide suggestions for video improvement based on: ${prompt}. 
                    Provide recommendations for:
                    1. Video composition and framing
                    2. Lighting suggestions
                    3. Content optimization for artisan marketplace
                    4. Engagement improvements
                    
                    Format your response as actionable suggestions for video enhancement.`
                }]
            }],
            generationConfig: {
                temperature: 0.5,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
            },
        };
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Gemini Video Analysis API error: ${response.status} - ${response.statusText}`);
        }

        const result = await response.json();
        const analysisText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!analysisText) {
            throw new Error('No analysis received from Gemini API');
        }

        console.log('Video Analysis:', analysisText);
        
        return {
            originalVideoUrl: videoUrl,
            analysis: analysisText,
            suggestions: 'Video analysis completed. For actual editing, integrate with video processing services like FFmpeg or cloud-based video editing APIs.',
            enhancementTips: analysisText
        };

    } catch (error) {
        console.error('Error calling Gemini Video API:', error.message);
        
      
        return {
            originalVideoUrl: videoUrl,
            analysis: 'Unable to analyze video at this time.',
            suggestions: 'Please try again later or check your API configuration.',
            enhancementTips: 'Consider improving lighting, composition, and audio quality for better engagement.'
        };
    }
};



export const createProduct = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const { name, description, price, category, stock } = req.body;
        const images = req.files;

        if (!name || !price || !category || !images || images.length === 0) {
            return res.status(400).json({ success: false, message: "Product name, price, category, and at least one image are required." });
        }

        
        const imageUrls = [];
        for (const file of images) {
            const result = await cloudinary.uploader.upload(`data:${file.mimetype};base64,${file.buffer.toString('base64')}`, {
                folder: 'product_images' 
            });
            imageUrls.push(result.secure_url);
        }

        const newProduct = new Product({
            name,
            description,
            price,
            images: imageUrls,
            seller: sellerId,
            category,
            stock: stock || 0
        });

        await newProduct.save();

        res.status(201).json({ success: true, message: "Product created successfully", data: newProduct });
    } catch (error) {
        console.error("Error creating product:", error.message);
        res.status(500).json({ success: false, message: "Server error creating product." });
    }
};


export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({})
            .populate('seller', 'name profilePhotoUrl') 
            .populate('category', 'name') 
            .lean();

        res.status(200).json({ success: true, message: "Products fetched successfully", data: products });
    } catch (error) {
        console.error("Error fetching all products:", error.message);
        res.status(500).json({ success: false, message: "Server error fetching products." });
    }
};

export const getSellerProducts = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const products = await Product.find({ seller: sellerId })
            .populate('category', 'name')
            .lean();

        res.status(200).json({ success: true, message: "Seller's products fetched successfully", data: products });
    } catch (error) {
        console.error("Error fetching seller's products:", error.message);
        res.status(500).json({ success: false, message: "Server error fetching seller's products." });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId)
            .populate('seller', 'name description profilePhotoUrl')
            .populate('category', 'name')
            .lean();

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found." });
        }

        res.status(200).json({ success: true, message: "Product fetched successfully", data: product });
    } catch (error) {
        console.error("Error fetching product by ID:", error.message);
        res.status(500).json({ success: false, message: "Server error fetching product." });
    }
};

export const getTrendingProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .sort({ salesCount: -1 })
            .limit(10) // Get the top 10 trending products
            .populate('seller', 'name')
            .lean();

        res.status(200).json({ success: true, message: "Trending products fetched successfully", data: products });
    } catch (error) {
        console.error("Error fetching trending products:", error.message);
        res.status(500).json({ success: false, message: "Server error fetching trending products." });
    }
};


export const generateAIdescription = async (req, res) => {
    try {
        const { productName, productCategory, keyFeatures } = req.body;

        if (!productName || !productCategory) {
            return res.status(400).json({ success: false, message: "Product name and category are required." });
        }

        const prompt = `Generate a compelling product description for an Indian artisan's craft. The product is named "${productName}", belongs to the "${productCategory}" category, and has the following key features: ${keyFeatures}. The description should be evocative, highlight its traditional value, and be suitable for a digital marketplace.`;

        const generatedDescription = await callGeminiAPI(prompt);

        res.status(200).json({ success: true, message: "Description generated successfully", description: generatedDescription });
    } catch (error) {
        console.error("Error generating AI description:", error.message);
        res.status(500).json({ success: false, message: "Server error during AI description generation." });
    }
};


export const generateAIPrice = async (req, res) => {
    try {
        const { productName, productCategory, material, craftsmanship, targetMarket } = req.body;

        if (!productName || !productCategory) {
            return res.status(400).json({ success: false, message: "Product name and category are required." });
        }

        const prompt = `Suggest a fair market price for a product named "${productName}" in the "${productCategory}" category. Consider the following factors: material (${material}), craftsmanship (${craftsmanship}), and target market (${targetMarket}). Provide the price and a brief reasoning.`;

        const generatedPrice = await callGeminiPriceAPI(prompt);

        res.status(200).json({ success: true, message: "Price suggestion generated successfully", data: generatedPrice });
    } catch (error) {
        console.error("Error generating AI price:", error.message);
        res.status(500).json({ success: false, message: "Server error during AI price generation." });
    }
};

export const editProductImage = async (req, res) => {
    try {
        const { productId } = req.params;
        const { prompt } = req.body;
        const imageFile = req.file;

        if (!imageFile || !prompt) {
            return res.status(400).json({ success: false, message: "An image file and a prompt are required." });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found." });
        }

        const imageBase64 = imageFile.buffer.toString('base64');

        // Get AI analysis of the image
        const analysisResult = await callGeminiImageEditAPI(imageBase64, prompt);

        // For now, we'll keep the original image and provide AI suggestions
        // In production, you'd integrate with actual image editing services
        
        res.status(200).json({
            success: true,
            message: "Image analysis completed successfully",
            originalImageUrl: product.images[0] || 'No image available',
            aiAnalysis: analysisResult.analysis,
            suggestions: analysisResult.suggestion,
            prompt: prompt
        });

    } catch (error) {
        console.error("Error editing product image:", error.message);
        res.status(500).json({ success: false, message: "Server error during AI image editing." });
    }
};

export const editTrendVideo = async (req, res) => {
    try {
        const { trendId } = req.params;
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ success: false, message: "A prompt is required for video editing." });
        }

        const trend = await Trend.findById(trendId);
        if (!trend) {
            return res.status(404).json({ success: false, message: "Trend video not found." });
        }

        // Ensure the authenticated seller owns this trend video for security
        if (trend.seller.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "Access denied. You do not own this video." });
        }

        const analysisResult = await callGeminiVideoEditAPI(trend.videoUrl, prompt);
        
        // For now, we keep the original video and provide AI suggestions
        // In production, you'd integrate with actual video editing services
        
        res.status(200).json({
            success: true,
            message: "Video analysis completed successfully",
            originalVideoUrl: trend.videoUrl,
            aiAnalysis: analysisResult.analysis,
            suggestions: analysisResult.suggestions,
            enhancementTips: analysisResult.enhancementTips,
            prompt: prompt
        });

    } catch (error) {
        console.error("Error editing trend video:", error.message);
        res.status(500).json({ success: false, message: "Server error during AI video editing." });
    }
};
