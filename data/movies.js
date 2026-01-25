const axios = require("axios");

// Cache for API data
let moviesCache = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Function to fetch movies from API with pagination support
async function getMovies(page = 1) {
    const now = Date.now();
    
    // For pagination, don't use cache for different pages
    // Only cache the first page to avoid stale data issues
    if (page === 1 && moviesCache && (now - cacheTimestamp) < CACHE_DURATION) {
        return moviesCache;
    }
    
    try {
        const response = await axios.get(`https://tmdbimg.vercel.app/api/kdramas?page=${page}`, {
            headers: {
                'app_key': 'kdramas'
            }
        });
        
        // Transform API response to match expected format
        const movies = {};
        let data = response.data;
        
        console.log('API Response:', JSON.stringify(response.data, null, 2));
        
        // Handle different response formats
        if (Array.isArray(data)) {
            // Array of items
            console.log(`Processing ${data.length} items from array`);
            data.forEach((item, index) => {
                console.log(`Item ${index}:`, item);
                const key = item.id || item.imdb_id || `kd_${Math.random().toString(36).substr(2, 9)}`;
                movies[key] = {
                    type: item.type || "series",
                    name: item.name || item.title || item.original_title || `Item ${index + 1}`,
                    url: item.stream_url || item.url || '',
                    title: item.title || "HD Stream"
                };
            });
        } else if (data && typeof data === 'object') {
            // Check if it's a paginated response with results array
            if (data.results && Array.isArray(data.results)) {
                console.log(`Processing ${data.results.length} items from data.results`);
                data.results.forEach((item, index) => {
                    console.log(`Item ${index}:`, item);
                    const key = item.tmdbId || item.id || `kd_${Math.random().toString(36).substr(2, 9)}`;
                    movies[key] = {
                        type: item.type || "series",
                        name: item.title || item.name || item.original_title || `Item ${index + 1}`,
                        url: item.stream_url || item.url || 'https://example.com/stream.m3u8',
                        title: item.title || "HD Stream"
                    };
                });
            } else if (data.items && Array.isArray(data.items)) {
                console.log(`Processing ${data.items.length} items from data.items`);
                data.items.forEach((item, index) => {
                    console.log(`Item ${index}:`, item);
                    const key = item.id || item.imdb_id || `kd_${Math.random().toString(36).substr(2, 9)}`;
                    movies[key] = {
                        type: item.type || "series",
                        name: item.name || item.title || item.original_title || `Item ${index + 1}`,
                        url: item.stream_url || item.url || 'https://example.com/stream.m3u8',
                        title: item.title || "HD Stream"
                    };
                });
            } else {
                // Single item
                console.log('Processing single item:', data);
                const key = data.id || data.imdb_id || `kd_${Math.random().toString(36).substr(2, 9)}`;
                movies[key] = {
                    type: data.type || "series",
                    name: data.name || data.title || data.original_title || 'Unknown Title',
                    url: data.stream_url || data.url || 'https://example.com/stream.m3u8',
                    title: data.title || "HD Stream"
                };
            }
        } else {
            console.log('Unexpected data format:', typeof data, data);
        }
        
        moviesCache = movies;
        cacheTimestamp = now;
        return movies;
    } catch (error) {
        console.error('Error fetching movies from API:', error);
        // Return empty object if API fails
        return {};
    }
}

// Static fallback data
const staticMovies = {};

module.exports = { getMovies, staticMovies };