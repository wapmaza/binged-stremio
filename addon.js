const { addonBuilder } = require("stremio-addon-sdk");
const axios = require("axios");
const manifest = require("./data/manifest");
const { getMovies } = require("./data/movies");

const builder = new addonBuilder(manifest);

builder.defineStreamHandler(async function (args) {
	const movies = await getMovies();
	if (movies[args.id]) {
		return Promise.resolve({ streams: [movies[args.id]] });
	} else {
		return Promise.resolve({ streams: [] });
	}
});

builder.defineMetaHandler(async function (args) {
	const movies = await getMovies();
	if (movies[args.id]) {
		const value = movies[args.id];
		const tmdbId = args.id; // Use the actual ID from catalog, not split by ":"
		
		// Fetch IMDB ID from TMDB API only when viewing movie details
		let imdbId = null;
		try {
			const response = await axios.get(`https://api.themoviedb.org/3/tv/${tmdbId}/external_ids?api_key=b371be5ee4ee121e9ed7aad89c098bda`);
			imdbId = response.data.imdb_id;
		} catch (error) {
			console.error(`Error fetching IMDB ID for TMDB ID ${tmdbId}:`, error);
		}
		
		// Use TMDB ID as fallback if IMDB ID is not available
		const idToUse = imdbId || tmdbId;
		
		return Promise.resolve({
			meta: {
				id: idToUse,
				type: value.type,
				name: value.name,
				poster: METAHUB_URL + "/poster/medium/" + idToUse + "/img",
				logo: METAHUB_URL + "/poster/medium/" + idToUse + "/img",
				// add more meta fields as needed
			}
		});
	} else {
		return Promise.resolve({ meta: null });
	}
});

const METAHUB_URL = "https://images.metahub.space";

// Function to fetch IMDB ID from TMDB API
async function fetchImdbIdFromTmdb(tmdbId) {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/tv/${tmdbId}/external_ids?api_key=b371be5ee4ee121e9ed7aad89c098bda`);
        return response.data.imdb_id;
    } catch (error) {
        console.error(`Error fetching IMDB ID for TMDB ID ${tmdbId}:`, error);
        return null;
    }
}

const generateMetaPreview = async function (value, key) {
	const tmdbId = key.split(":")[0];

    // Fetch IMDB ID from TMDB API
    const imdbId = await fetchImdbIdFromTmdb(tmdbId);
    
    // Use TMDB ID as fallback if IMDB ID is not available
    const idToUse = imdbId || tmdbId;
	
	return {
		id: idToUse,
		type: value.type,
		name: value.name,
		poster: METAHUB_URL + "/poster/medium/" + idToUse + "/img",
		logo: METAHUB_URL + "/poster/medium/" + idToUse + "/img",
	};
};

builder.defineCatalogHandler(async function (args, cb) {
	// Get page number from args, default to 1
	const page = args.extra && args.extra.page ? parseInt(args.extra.page) : 1;
	const movies = await getMovies(page);
	
	const metas = await Promise.all(
		Object.entries(movies)
			.filter(([_, value]) => value.type === args.type)
			.map(([key, value]) => generateMetaPreview(value, key))
	);

	// Add pagination info to response
	return Promise.resolve({ 
		metas: metas,
		next: page + 1  // Indicate next page available
	});
});

module.exports = builder.getInterface();
