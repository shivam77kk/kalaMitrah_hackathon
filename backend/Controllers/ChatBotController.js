import 'dotenv/config';
import fetch from 'node-fetch';

// Gemini API call implementation
const callGeminiChatAPI = async (message) => {
    try {
        // If Gemini API key is available, use the real API
        if (process.env.GEMINI_API_KEY) {
            const systemPrompt = "Act as a helpful and knowledgeable assistant for an artisan marketplace. Answer questions about products, help with marketing, and provide creative ideas. Keep responses concise and friendly.";
            const userQuery = message;
            const apiKey = process.env.GEMINI_API_KEY;
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

            const payload = {
                contents: [{ parts: [{ text: userQuery }] }],
                systemInstruction: { parts: [{ text: systemPrompt }] },
            };

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Gemini API error: ${response.status}`);
            }

            const result = await response.json();
            const generatedText = result?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response at this time.";
            return generatedText;
        }
    } catch (error) {
        console.error('Gemini API error:', error.message);
        // Fall back to mock responses
    }

    // Fallback mock responses
    return new Promise(resolve => {
        setTimeout(() => {
            const mockResponses = {
                "hello": "Hello! Welcome to KalaMitraah! How can I help you with your artisan needs today?",
                "hi": "Hi there! I'm here to help you discover amazing artisan products. What are you looking for?",
                "what is a kurta": "A kurta is a traditional piece of clothing, often worn in India. It's a loose-fitting shirt or tunic, typically worn over pants like churidars or pajamas. Many of our talented sellers offer beautiful hand-embroidered kurtas!",
                "tell me a story": "Once upon a time, a skilled weaver crafted a sari so beautiful that its threads seemed to hold the colors of the dawn. Every morning, the sun would rise just to see its reflection in the fabric, and in the evening, the stars would whisper their secrets to its intricate patterns.",
                "help": "I can help you with product information, artisan stories, crafting techniques, and marketplace guidance. Just ask me anything!",
                "products": "We have a wonderful variety of handcrafted products including textiles, pottery, jewelry, paintings, and traditional crafts. What type of product interests you?",
                "default": "I am your KalaMitraah chatbot, designed to help you explore the world of artisan crafts and connect with talented creators. What would you like to know?"
            };
            const lowerCaseMessage = message.toLowerCase();
            let response = mockResponses["default"];
            
            // Check for partial matches
            for (const [key, value] of Object.entries(mockResponses)) {
                if (lowerCaseMessage.includes(key)) {
                    response = value;
                    break;
                }
            }
            
            resolve(response);
        }, 300);
    });
};

export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        
        // Validate message input
        if (!message || typeof message !== 'string') {
            return res.status(400).json({ 
                success: false, 
                message: "A valid message string is required." 
            });
        }
        
        // Trim and check if message is not empty
        const trimmedMessage = message.trim();
        if (trimmedMessage.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Message cannot be empty." 
            });
        }
        
        // Check message length (optional)
        if (trimmedMessage.length > 1000) {
            return res.status(400).json({ 
                success: false, 
                message: "Message is too long. Please keep it under 1000 characters." 
            });
        }

        console.log(`Chatbot received message: "${trimmedMessage}"`);
        const botResponse = await callGeminiChatAPI(trimmedMessage);
        console.log(`Chatbot response generated: "${botResponse.substring(0, 50)}..."`);

        res.status(200).json({ 
            success: true, 
            message: "Response generated successfully", 
            data: { text: botResponse } 
        });
    } catch (error) {
        console.error("Error sending message to chatbot:", error.message);
        res.status(500).json({ 
            success: false, 
            message: "Server error during chatbot interaction. Please try again." 
        });
    }
};
