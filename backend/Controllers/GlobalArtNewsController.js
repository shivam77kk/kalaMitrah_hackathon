import 'dotenv/config';

const NEWS_API_URL = "https://newsapi.org/v2/everything";
const NEWS_API_KEY = process.env.NEWS_API_KEY;


const fetchArtNews = async () => {
    //
    // TODO: REPLACE THIS MOCK FUNCTION WITH YOUR ACTUAL API CALL
    //
    // A real API call would look something like this:
    /*
    const query = 'artisan OR "Indian art" OR "global art"';
    const response = await fetch(`${NEWS_API_URL}?q=${query}&apiKey=${NEWS_API_KEY}`);
    if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
    }
    const data = await response.json();
    return data.articles;
    */
    return new Promise(resolve => {
        setTimeout(() => {
            const mockArticles = [
                {
                    title: "The Revival of Traditional Indian Handicrafts",
                    source: { name: "Art Magazine" },
                    author: "Jane Doe",
                    description: "A look at how modern trends are revitalizing ancient Indian craft techniques.",
                    url: "https://example.com/article1",
                    urlToImage: "https://placehold.co/600x400/FF5733/FFFFFF?text=Article+Image+1",
                    publishedAt: "2023-10-27T10:00:00Z"
                },
                {
                    title: "Exhibition of South Indian Folk Art",
                    source: { name: "Cultural Times" },
                    author: "John Smith",
                    description: "Details on a new exhibition showcasing rare folk art from Southern India.",
                    url: "https://example.com/article2",
                    urlToImage: "https://placehold.co/600x400/C70039/FFFFFF?text=Article+Image+2",
                    publishedAt: "2023-10-26T15:30:00Z"
                }
            ];
            resolve(mockArticles);
        }, 1000);
    });
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
