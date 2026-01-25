const nameToImdb = require('name-to-imdb');

const titleToImdb = name => new Promise((resolve, reject) =>
	nameToImdb(name, (err, res) => {
		if (err) {
			reject(new Error(err.message));
		}
		resolve(res);
}));

// Test the function
console.log("Testing titleToImdb function...");
titleToImdb("south park").then(imdbId => {
	console.log("IMDb ID for 'south park':", imdbId);
}).catch(error => {
	console.error("Error:", error.message);
});

// Test with another title
titleToImdb("breaking bad").then(imdbId => {
	console.log("IMDb ID for 'breaking bad':", imdbId);
}).catch(error => {
	console.error("Error:", error.message);
});