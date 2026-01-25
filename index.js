const addonInterface = require("./addon");
const express = require("express");
const landingTemplate = require("stremio-addon-sdk/src/landingTemplate");
const getRouter = require("stremio-addon-sdk/src/getRouter");
const opn = require("opn");
const app = express();
const nameToImdb = require('name-to-imdb');

if (addonInterface.constructor.name !== "AddonInterface") {
	throw new Error("first argument must be an instance of AddonInterface");
}
app.use((_, res, next) => {
	next();
});

const titleToImdb = name => new Promise((resolve, reject) =>
	nameToImdb(name, (err, res) => {
		if (err) {
			reject(new Error(err.message));
		}
		resolve(res);
}));

// // Test the function
// console.log("Testing titleToImdb function...");
// titleToImdb("south park").then(imdbId => {
// 	console.log("IMDb ID for 'south park':", imdbId);
// }).catch(error => {
// 	console.error("Error:", error.message);
// });

app.use(getRouter(addonInterface));

// landing page
const landingHTML = landingTemplate(addonInterface.manifest);
app.get("/", (_, res) => {
	res.setHeader("content-type", "text/html");
	res.end(landingHTML);
});

const port = process.env.PORT || 8180;
app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
module.exports = app;
