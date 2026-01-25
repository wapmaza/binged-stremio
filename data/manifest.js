const manifest = {
  id: "org.stremio.kdramas",
  version: "1.0.1",
  background:
    "https://images.unsplash.com/photo-1655105677154-0811fc163a7a?q=80&w=407&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  // logo: "https://raw.githubusercontent.com/frodkata/stremio-bg-movies/main/assets/logo.png",
  name: "K-Dramas Binged",
  description: "Catalog of Latest K-Dramas. Stay uptodate with Latest Kdramas streaming online.",
  resources: ["catalog", "meta", "stream"],
  types: ["movies", "series"],
  catalogs: [
    {
      type: "series",
      id: "K-Dramas",
    },
    // {
    //   type: "movie",
    //   id: "Movies",
    // },
  ],

  // // prefix of item IDs
  // idPrefixes: ["tt"],
};

module.exports = manifest;