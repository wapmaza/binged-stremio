import pkg from "stremio-addon-sdk";
import { ipAddress } from '@vercel/functions';
import express from 'express';

const { addonBuilder, serveHTTP } = pkg;


console.log("ip address");

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Static movie data - no external API calls
const STATIC_MOVIES = [
  {
    id: "movie-001",
    title: "The Last Guardian",
    year: "2025",
    genres: ["Action", "Adventure", "Fantasy"],
    cast: ["John Smith", "Jane Doe", "Bob Wilson"],
    directors: ["Alice Johnson"],
    writers: ["Charlie Brown"],
    description:
      "A epic fantasy adventure about a young hero who must save the world from an ancient evil.",
    runtime: 145,
    certification: "PG-13",
    tmdbRating: 8.2,
    tmdbVotes: 1250,
    poster:
      "https://moviereelist.com/wp-content/uploads/2019/07/poster-placeholder.jpg",
    background:
      "https://moviereelist.com/wp-content/uploads/2019/07/poster-placeholder.jpg",
    trailer: "https://www.youtube.com/watch?v=dummy_trailer_001",
  },
  {
    id: "movie-003",
    title: "Love in Paris",
    year: "2025",
    genres: ["Romance", "Drama"],
    cast: ["Margot Robbie", "Ryan Gosling", "Anne Hathaway"],
    directors: ["Greta Gerwig"],
    writers: ["Nick Hornby"],
    description:
      "A heartwarming love story set against the backdrop of beautiful Paris.",
    runtime: 110,
    certification: "PG",
    tmdbRating: 7.5,
    tmdbVotes: 890,
    poster:
      "https://moviereelist.com/wp-content/uploads/2019/07/poster-placeholder.jpg",
    background:
      "https://moviereelist.com/wp-content/uploads/2019/07/poster-placeholder.jpg",
    trailer: "https://www.youtube.com/watch?v=dummy_trailer_003",
  },
  {
    id: "movie-005",
    title: "The Detective",
    year: "2025",
    genres: ["Mystery", "Crime", "Drama"],
    cast: ["Daniel Craig", "Ana de Armas", "Rami Malek"],
    directors: ["Denis Villeneuve"],
    writers: ["Agatha Christie"],
    description:
      "A brilliant detective solves a complex murder case with unexpected twists.",
    runtime: 130,
    certification: "PG-13",
    tmdbRating: 7.9,
    tmdbVotes: 1890,
    poster:
      "https://moviereelist.com/wp-content/uploads/2019/07/poster-placeholder.jpg",
    background:
      "https://moviereelist.com/wp-content/uploads/2019/07/poster-placeholder.jpg",
    trailer: "https://www.youtube.com/watch?v=dummy_trailer_005",
  },
  {
    id: "movie-007",
    title: "Comedy Club",
    year: "2025",
    genres: ["Comedy", "Romance"],
    cast: ["Adam Sandler", "Jennifer Aniston", "Kevin James"],
    directors: ["Frank Coraci"],
    writers: ["Adam Sandler"],
    description:
      "A hilarious comedy about friendship, love, and following your dreams.",
    runtime: 105,
    certification: "PG",
    tmdbRating: 6.8,
    tmdbVotes: 1100,
    poster:
      "https://moviereelist.com/wp-content/uploads/2019/07/poster-placeholder.jpg",
    background:
      "https://moviereelist.com/wp-content/uploads/2019/07/poster-placeholder.jpg",
    trailer: "https://www.youtube.com/watch?v=dummy_trailer_007",
  },
  {
    id: "movie-009",
    title: "Superhero Origins",
    year: "2025",
    genres: ["Action", "Superhero", "Adventure"],
    cast: ["Robert Downey Jr.", "Chris Evans", "Mark Ruffalo"],
    directors: ["Joss Whedon"],
    writers: ["Stan Lee"],
    description:
      "The origin story of how an ordinary person became an extraordinary hero.",
    runtime: 140,
    certification: "PG-13",
    tmdbRating: 8.5,
    tmdbVotes: 3200,
    poster:
      "https://moviereelist.com/wp-content/uploads/2019/07/poster-placeholder.jpg",
    background:
      "https://moviereelist.com/wp-content/uploads/2019/07/poster-placeholder.jpg",
    trailer: "https://www.youtube.com/watch?v=dummy_trailer_009",
  },
];

// Static stream data - dummy MP4 links
const STATIC_STREAMS = [
  {
    id: "stream-001",
    title: "The Last Guardian - 1080p",
    url: "https://example.com/dummy_streams/the_last_guardian_1080p.mp4",
    quality: "1080p",
  },
  {
    id: "stream-003",
    title: "The Last Guardian - 480p",
    url: "https://example.com/dummy_streams/the_last_guardian_480p.mp4",
    quality: "480p",
  },
  {
    id: "stream-005",
    title: "Cyber City - 720p",
    url: "https://example.com/dummy_streams/cyber_city_720p.mp4",
    quality: "720p",
  },
  {
    id: "stream-007",
    title: "Space Odyssey - 1080p",
    url: "https://example.com/dummy_streams/space_odyssey_1080p.mp4",
    quality: "1080p",
  },
  {
    id: "stream-009",
    title: "Ancient Warriors - 1080p",
    url: "https://example.com/dummy_streams/ancient_warriors_1080p.mp4",
    quality: "1080p",
  },
];

// Define Stremio Add-on
const manifest = {
  id: "com.stremio.testing",
  version: "1.0.8",
  name: "Test App",
  description: "Static Movie Collection - No External APIs",
  resources: ["stream", "catalog", "meta"],
  types: ["movie"],
  catalogs: [
    {
      type: "movie",
      id: "static-movies-2025",
      name: "Static Movies 2025",
      extra: [{ name: "skip", isRequired: false }],
    },
  ],
};

const builder = new addonBuilder(manifest);

// Catalog resource - returns static movies
builder.defineCatalogHandler(async (args) => {
  if (args.type !== "movie") return { metas: [] };

  // Log IP address when catalog is accessed
  console.log('IP Address (Catalog Handler):', args.ip || 'Unknown');
  console.log('Catalog request details:', {
    type: args.type,
    id: args.id,
    skip: args.extra?.skip,
    userAgent: args.headers?.['user-agent'] || 'Unknown'
  });

  // Use skip parameter for pagination (10 movies per page)
  const skip = parseInt(args.extra?.skip || "0", 10) || 0;
  const pageSize = 10;

  // Filter movies based on catalog type
  let filteredMovies = STATIC_MOVIES;

  if (args.id === "static-movies-2025") {
    filteredMovies = STATIC_MOVIES.filter((movie) => movie.year === "2025");
  }

  // Apply pagination
  const startIndex = skip;
  const endIndex = skip + pageSize;
  const pageMovies = filteredMovies.slice(startIndex, endIndex);

  // Map to Stremio meta format
  const metas = pageMovies.map((movie) => ({
    id: movie.id,
    name: movie.title,
    poster: movie.poster,
    background: movie.background,
    releaseInfo: movie.year,
    type: "movie",
    genres: movie.genres,
    cast: movie.cast,
    directors: movie.directors,
    writers: movie.writers,
    description: movie.description,
    runtime: movie.runtime,
    certification: movie.certification,
    imdbRating: movie.tmdbRating,
    votes: movie.tmdbVotes,
  }));

  return { metas };
});

// Meta resource - returns detailed movie information
builder.defineMetaHandler(async ({ id }) => {
  const movie = STATIC_MOVIES.find((m) => m.id === id);

  if (!movie) {
    return { meta: null };
  }

  const meta = {
    id: movie.id,
    type: "movie",
    name: movie.title,
    poster: movie.poster,
    background: movie.background,
    releaseInfo: movie.year,
    description: movie.description,
    runtime: movie.runtime,
    genres: movie.genres,
    cast: movie.cast,
    directors: movie.directors,
    writers: movie.writers,
    certification: movie.certification,
    imdbRating: movie.tmdbRating,
    votes: movie.tmdbVotes,
    trailer: movie.trailer,
  };

  return { meta };
});

// Stream resource - returns dummy MP4 stream links
builder.defineStreamHandler(async function (args) {
  if (args.type === "movie") {
    // Log IP address when stream is accessed
    console.log('IP Address (Stream Handler):', args.ip || 'Unknown');
    console.log('Stream request details:', {
      type: args.type,
      id: args.id,
      userAgent: args.headers?.['user-agent'] || 'Unknown'
    });

    // Find streams for the movie
    const movieStreams = STATIC_STREAMS.filter(
      (stream) =>
        stream.title.toLowerCase().includes(args.id.toLowerCase()) ||
        (args.id.includes("movie-001") &&
          stream.title.includes("The Last Guardian")) ||
        (args.id.includes("movie-002") &&
          stream.title.includes("Cyber City")) ||
        (args.id.includes("movie-003") &&
          stream.title.includes("Love in Paris")) ||
        (args.id.includes("movie-004") &&
          stream.title.includes("Space Odyssey")) ||
        (args.id.includes("movie-005") &&
          stream.title.includes("The Detective")) ||
        (args.id.includes("movie-006") &&
          stream.title.includes("Ancient Warriors")) ||
        (args.id.includes("movie-007") &&
          stream.title.includes("Comedy Club")) ||
        (args.id.includes("movie-008") &&
          stream.title.includes("Horror House")) ||
        (args.id.includes("movie-009") &&
          stream.title.includes("Superhero Origins")) ||
        (args.id.includes("movie-010") &&
          stream.title.includes("Animated Adventure"))
    );

    // If no specific streams found, return all streams
    const streamsToReturn =
      movieStreams.length > 0 ? movieStreams : STATIC_STREAMS;

    const streams = streamsToReturn.map((stream) => ({
      url: stream.url,
      title: stream.title,
      name: stream.quality,
    }));

    return Promise.resolve({ streams });
  } else {
    return Promise.resolve({ streams: [] });
  }
});

// Add middleware to log IP addresses for all requests
app.use((req, res, next) => {
  // Method 5: Comprehensive IP detection
  const getRealIP = (request) => {
    // Check various headers that might contain the real IP
    const forwarded = request.headers['x-forwarded-for'];
    const realIP = request.headers['x-real-ip'];
    const cfConnectingIP = request.headers['cf-connecting-ip'];
    const trueClientIP = request.headers['true-client-ip'];
    
    // Return the first available IP from the chain
    if (forwarded) {
      return forwarded.split(',')[0].trim();
    } else if (realIP) {
      return realIP;
    } else if (cfConnectingIP) {
      return cfConnectingIP;
    } else if (trueClientIP) {
      return trueClientIP;
    } else {
      return request.ip || request.connection.remoteAddress;
    }
  };

  const realIP = getRealIP(req);
  console.log('IP Address (Method 5 - Comprehensive):', realIP);
  console.log('Full headers:', JSON.stringify(req.headers, null, 2));
  
  next();
});

// Express routes
app.get('/', (req, res) => {
  // Method 1: Using @vercel/functions package
  const ip1 = ipAddress(req);
  console.log('IP Address (Method 1 - @vercel/functions):', ip1);
  
  res.json({
    message: 'Hello World!',
    status: 'success',
    timestamp: new Date().toISOString()
  });
});

app.get('/hello', (req, res) => {
  // Method 2: Using req.ip (Express default)
  const ip2 = req.ip;
  console.log('IP Address (Method 2 - req.ip):', ip2);
  
  // Method 3: Using req.connection.remoteAddress
  const ip3 = req.connection.remoteAddress;
  console.log('IP Address (Method 3 - req.connection.remoteAddress):', ip3);
  
  // Method 4: Using req.headers['x-forwarded-for']
  const forwarded = req.headers['x-forwarded-for'];
  const ip4 = forwarded ? forwarded.split(',')[0].trim() : null;
  console.log('IP Address (Method 4 - x-forwarded-for):', ip4);
  
  res.send('Hello World from /hello route!');
});

// Serve the add-on on a different port to avoid conflicts
serveHTTP(builder.getInterface(), { port: 8181 });

// Start Express server
app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
  console.log(`Stremio addon accessible at: http://localhost:8181/manifest.json`);
});
