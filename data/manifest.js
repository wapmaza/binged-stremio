const manifest = {
  id: "org.stremio.kdramas",
  version: "1.0.1",
  background:
    "https://raw.githubusercontent.com/frodkata/stremio-bg-movies/main/assets/background.jpg",
  // logo: "https://raw.githubusercontent.com/frodkata/stremio-bg-movies/main/assets/logo.png",
  name: "K-Dramas",
  description:
    "Catalog of popular K-Dramas. https://github.com/wapmaza/binged-stremio",

  resources: ["catalog", "meta", "stream"],

  types: ["movies", "series"],

  catalogs: [
    {
      type: "series",
      id: "K-Dramas",
    },
    {
      type: "movie",
      id: "Movies",
    },
  ],

  // // prefix of item IDs
  idPrefixes: ["kd"],
};

module.exports = manifest;