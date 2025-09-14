import ArtisanInsight from '../models/ArtisanInsightsSchema.js';
import Seller from '../models/SellerSchema.js';
import 'dotenv/config';


const callGeminiAPI = async (prompt) => {

    /*
    const systemPrompt = "Act as a world-class business growth strategist for local artisans. Provide a concise, actionable growth plan.";
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
    const generatedText = result?.candidates?.[0]?.content?.parts?.[0]?.text || "No plan could be generated at this time.";
    return generatedText;
    */

    // Returning a mock response for now
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(`This is a mock AI-generated growth plan. To increase sales by 20% in the next quarter, focus on creating high-quality, short-form video content for your top 3 products. Partner with local influencers and offer a limited-time discount code. Analyze customer feedback to refine your product descriptions and improve SEO.`);
        }, 1000);
    });
};

export const getArtisanInsights = async (req, res) => {
    try {
        const sellerId = req.user.id;

        const insights = await ArtisanInsight.findOne({ seller: sellerId })
            .populate('suggestedPrices.productId')
            .populate('productPerformance.productId')
            .lean(); 

        if (!insights) {
           
            const newInsights = await ArtisanInsight.create({ seller: sellerId });
            return res.status(200).json({ success: true, message: "New insights profile created.", data: newInsights });
        }

        res.status(200).json({ success: true, message: "Insights fetched successfully", data: insights });
    } catch (error) {
        console.error("Error fetching artisan insights:", error.message);
        res.status(500).json({ success: false, message: "Server error fetching insights." });
    }
};


export const generateGrowthPlan = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const { businessData } = req.body; 

        const prompt = `Generate a growth plan for a local artisan with the following data: ${JSON.stringify(businessData)}`;

        const generatedPlan = await callGeminiAPI(prompt);

        let insights = await ArtisanInsight.findOne({ seller: sellerId });

        if (!insights) {
            insights = await ArtisanInsight.create({ seller: sellerId });
        }

        insights.growthPlan = generatedPlan;
        insights.lastUpdated = new Date();
        await insights.save();

        res.status(200).json({ success: true, message: "Growth plan generated and saved.", growthPlan: generatedPlan });
    } catch (error) {
        console.error("Error generating growth plan:", error.message);
        res.status(500).json({ success: false, message: "Server error during AI plan generation." });
    }
};
