
let imdbId = null;
try {
	const response = await axios.get(`https://api.themoviedb.org/3/tv/${tmdbId}/external_ids?api_key=b371be5ee4ee121e9ed7aad89c098bda`);
	imdbId = response.data.imdb_id;
} catch (error) {
	console.error(`Error fetching IMDB ID for TMDB ID ${tmdbId}:`, error);
}

titleToImdb("south park").then(imdbId => {
	console.log("IMDb ID for 'south park':", imdbId);
}).catch(error => {
	console.error("Error:", error.message);
});