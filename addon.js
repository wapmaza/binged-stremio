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
		const imdbId = args.id.split(":")[0];
		return Promise.resolve({
			meta: {
				id: imdbId,
				type: value.type,
				name: value.name,
				poster: METAHUB_URL + "/poster/medium/" + imdbId + "/img",
				logo: METAHUB_URL + "/poster/medium/" + imdbId + "/img",
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
	const movies = await getMovies();
	const metas = await Promise.all(
		Object.entries(movies)
			.filter(([_, value]) => value.type === args.type)
			.map(([key, value]) => generateMetaPreview(value, key))
	);

	return Promise.resolve({ metas: metas });
});

module.exports = builder.getInterface();
