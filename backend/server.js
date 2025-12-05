require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const postsRouter = require('./routes/posts');
const generateRouter = require('./routes/generate');

const app = express();

// Middleware
// Allow all origins to prevent CORS issues
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Handle Preflight requests explicitly
app.options('*', cors());

app.use(express.json({ limit: '50mb' }));

// Debug Middleware to log requests
app.use((req, res, next) => {
  console.log(`[Request] ${req.method} ${req.path}`);
  next();
});

// --- ROUTES ---

// 1. Health Check Route (Root) - Moved to top for priority
app.get('/', (req, res) => {
  res.json({ 
    status: 'running', 
    message: 'TechFlow Backend is Running 🚀', 
    env_check: {
      has_mongo_uri: !!process.env.MONGO_URI,
      has_api_key: !!process.env.API_KEY,
      node_env: process.env.NODE_ENV
    },
    timestamp: new Date().toISOString() 
  });
});

// 2. API Health Check
app.get('/api', (req, res) => {
  res.json({ status: 'ok', message: 'API is accessible' });
});

// 3. Mount Routers (Support both /api and root paths)
app.use('/api/posts', postsRouter);
app.use('/posts', postsRouter);

app.use('/api/generate', generateRouter);
app.use('/generate', generateRouter);

// 4. Global Catch-All 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found', 
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    suggestion: 'Try GET / or GET /api/posts'
  });
});

// Database Connection Logic (Cached for Serverless)
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  // Check if we are in a Vercel/Production environment
  const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;

  let mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
      if (isProduction) {
        // Critical error in production
        throw new Error("CRITICAL CONFIG ERROR: MONGO_URI is missing in Vercel Environment Variables. Please add it in Vercel Project Settings.");
      }
      // Local fallback
      console.warn('⚠️  Warning: MONGO_URI not found in backend/.env');
      mongoUri = 'mongodb://127.0.0.1:27017/techflow';
  }

  try {
    // CONNECT WITH SHORT TIMEOUT
    // Vercel functions timeout quickly (10s), so we must fail fast (5s) to see the error.
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000, // Fail after 5 seconds if IP is blocked
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    if (err.name === 'MongooseServerSelectionError') {
      console.error('❌ DB CONNECTION TIMEOUT: Your IP might be blocked by MongoDB Atlas.');
      console.error('👉 ACTION: Go to MongoDB Atlas > Network Access > Add IP > Allow Access From Anywhere (0.0.0.0/0)');
    } else if (err.code === 8000 || (err.message && err.message.includes('bad auth'))) {
      console.error('❌ DB AUTH ERROR: Incorrect Password/Username in MONGO_URI.');
    } else {
      console.error('❌ Database connection error:', err);
    }
    // Re-throw so the serverless handler knows we failed
    throw err;
  }
};

// Vercel Serverless Handler
module.exports = async (req, res) => {
  try {
    await connectDB();
    app(req, res);
  } catch (error) {
    console.error("Serverless Handler Crash:", error);
    // Return a 500 error compatible with JSON clients
    res.status(500).json({ 
      error: "Internal Server Error", 
      message: error.message || "Database connection failed",
      tip: "Check Vercel Function Logs for 'DB CONNECTION TIMEOUT' or 'AUTH ERROR'"
    });
  }
};

// Local Development Server
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  }).catch(err => {
    console.error("Failed to start local server:", err.message);
  });
}
