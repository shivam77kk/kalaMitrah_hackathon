import 'dotenv/config';
import fetch from 'node-fetch';

const NEWS_API_URL = "https://newsapi.org/v2/everything";
const NEWS_API_KEY = process.env.NEWS_API_KEY;


const fetchArtNews = async () => {
    try {
        if (!NEWS_API_KEY || NEWS_API_KEY === 'your_news_api_key') {
            throw new Error('NEWS_API_KEY not configured');
        }

        const queries = [
            'artisan OR "Indian art" OR "global art" OR "handicraft" OR "traditional craft"',
            '"art exhibition" OR "cultural heritage" OR "folk art" OR "handmade" OR "craftsperson"'
        ];
        
        const query = queries[0]; 
        const url = `${NEWS_API_URL}?q=${encodeURIComponent(query)}&apiKey=${NEWS_API_KEY}&language=en&sortBy=publishedAt&pageSize=20`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`News API error: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.status === 'error') {
            throw new Error(`News API error: ${data.message}`);
        }
       
        const filteredArticles = data.articles
            .filter(article => 
                article.title && 
                article.description && 
                article.url &&
                !article.title.toLowerCase().includes('[removed]') &&
                !article.description.toLowerCase().includes('[removed]')
            )
            .slice(0, 10) 
            .map(article => ({
                title: article.title,
                source: article.source,
                author: article.author || 'Unknown',
                description: article.description,
                url: article.url,
                urlToImage: article.urlToImage || 'https://placehold.co/600x400/FF5733/FFFFFF?text=Art+News',
                publishedAt: article.publishedAt
            }));
        
        return filteredArticles;
        
    } catch (error) {
        console.error('Error fetching news from API:', error.message);
        
        return [
            {
                title: "The Revival of Traditional Indian Handicrafts",
                source: { name: "Art Magazine" },
                author: "Jane Doe",
                description: "A look at how modern trends are revitalizing ancient Indian craft techniques.",
                url: "https://example.com/article1",
                urlToImage: "https://placehold.co/600x400/FF5733/FFFFFF?text=Article+Image+1",
                publishedAt: new Date().toISOString()
            },
            {
                title: "Exhibition of South Indian Folk Art",
                source: { name: "Cultural Times" },
                author: "John Smith",
                description: "Details on a new exhibition showcasing rare folk art from Southern India.",
                url: "https://example.com/article2",
                urlToImage: "https://placehold.co/600x400/C70039/FFFFFF?text=Article+Image+2",
                publishedAt: new Date(Date.now() - 86400000).toISOString() 
            },
            {
                title: "Modern Artisans Embracing Digital Platforms",
                source: { name: "Craft Weekly" },
                author: "Artisan Reporter",
                description: "How traditional craftspeople are leveraging e-commerce and social media to reach global markets.",
                url: "https://example.com/article3",
                urlToImage: "https://placehold.co/600x400/900C3F/FFFFFF?text=Digital+Craft",
                publishedAt: new Date(Date.now() - 172800000).toISOString() 
            }
        ];
    }
};


export const getGlobalArtNews = async (req, res) => {
    try {
        if (!NEWS_API_KEY) {
            console.warn("NEWS_API_KEY is not set. Using mock data.");
        }
        
        const news = await fetchArtNews();
        
        res.status(200).json({ success: true, message: "Global art news fetched successfully", data: news });
    } catch (error) {
        console.error("Error fetching global art news:", error.message);
        res.status(500).json({ success: false, message: "Server error fetching news." });
    }
};
