import Product from '../models/ProductSchema.js';
import Seller from '../models/SellerSchema.js';
import Trend from '../models/TrendsSchema.js'; 
import { v2 as cloudinary } from 'cloudinary';
import 'dotenv/config';


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const callGeminiAPI = async (prompt) => {
    //
    // TODO: REPLACE THIS MOCK FUNCTION WITH YOUR ACTUAL API CALL
    //
    /*
    const systemPrompt = "Act as a creative and knowledgeable copywriter for an artisan marketplace.";
    const userQuery = prompt;
    const apiKey = process.env.GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
    };

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    const result = await response.json();
    const generatedText = result?.candidates?.[0]?.content?.parts?.[0]?.text || "No content could be generated at this time.";
    return generatedText;
    */
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(`This is a mock AI-generated description. This handcrafted item, born from generations of tradition, embodies the spirit of our heritage. Each piece is a unique work of art, meticulously crafted to bring warmth and story to your home.`);
        }, 1000);
    });
};


const callGeminiPriceAPI = async (prompt) => {
    //
    // TODO: REPLACE THIS MOCK FUNCTION WITH YOUR ACTUAL API CALL
    // The Gemini API call for structured JSON response would look like this:
    /*
    const systemPrompt = "Act as a pricing analyst for traditional Indian crafts. Provide a suggested price and a brief reasoning in JSON format.";
    const userQuery = prompt;
    const apiKey = process.env.GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "OBJECT",
                properties: {
                    price: { "type": "NUMBER" },
                    reasoning: { "type": "STRING" }
                }
            }
        }
    };

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    const result = await response.json();
    const generatedJson = result?.candidates?.[0]?.content?.parts?.[0]?.text;
    return JSON.parse(generatedJson);
    */
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                price: 1500,
                reasoning: "Based on the rarity of materials and the intricate craftsmanship involved, a price of 1500 INR is suggested to reflect fair value and market demand."
            });
        }, 1000);
    });
};


const callGeminiImageEditAPI = async (imageBase64, prompt) => {
    //
    // TODO: REPLACE THIS MOCK FUNCTION WITH YOUR ACTUAL API CALL TO Gemini 2.5 Flash Image Preview (Nano Banana)
    //
    /*
    const apiKey = process.env.GEMINI_IMAGE_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${apiKey}`;

    const payload = {
        contents: [{
            parts: [{ text: prompt }, { inlineData: { mimeType: "image/jpeg", data: imageBase64 } }]
        }],
        generationConfig: {
            responseModalities: ["TEXT", "IMAGE"]
        },
    };
    
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    const result = await response.json();
    const editedImageBase64 = result?.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;
    return editedImageBase64;
    */
    return new Promise(resolve => {
        setTimeout(() => {
            // This is a mock base64 string for a placeholder image
            const mockEditedImage = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='; 
            resolve(mockEditedImage);
        }, 1500);
    });
};


const callGeminiVideoEditAPI = async (videoUrl, prompt) => {
    //
    // TODO: REPLACE THIS MOCK FUNCTION WITH YOUR ACTUAL API CALL TO A GOOGLE CLOUD VIDEO MODEL (e.g., in Vertex AI)
    // The implementation would be similar to the image editing call but with a video input payload.
    //
    console.log(`Simulating AI video edit for video: ${videoUrl} with prompt: "${prompt}"`);
    return new Promise(resolve => {
        setTimeout(() => {
          
            const mockEditedVideoUrl = 'https://mock-edited-video.com/new-video.mp4'; 
            resolve(mockEditedVideoUrl);
        }, 3000);
    });
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

       
        const editedImageBase64 = await callGeminiImageEditAPI(imageBase64, prompt);

        const result = await cloudinary.uploader.upload(`data:${imageFile.mimetype};base64,${editedImageBase64}`, {
            folder: 'edited_product_images'
        });

        product.images[0] = result.secure_url;
        await product.save();

        res.status(200).json({
            success: true,
            message: "Image edited and updated successfully",
            editedImageUrl: result.secure_url
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

        const editedVideoUrl = await callGeminiVideoEditAPI(trend.videoUrl, prompt);
        
        trend.videoUrl = editedVideoUrl;
        await trend.save();

        res.status(200).json({
            success: true,
            message: "Video edited and updated successfully",
            editedVideoUrl: editedVideoUrl
        });

    } catch (error) {
        console.error("Error editing trend video:", error.message);
        res.status(500).json({ success: false, message: "Server error during AI video editing." });
    }
};
