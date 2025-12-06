require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const postsRouter = require('./routes/posts');
const generateRouter = require('./routes/generate');

const app = express();

// --- 🔍 DEBUG: STARTUP SYSTEM CHECK ---
console.log("==================================================");
console.log("🚀 TECHFLOW BACKEND STARTING...");
console.log(`📌 Platform: ${process.env.RENDER ? 'Render Cloud' : 'Self-Hosted/Local'}`);
console.log(`📌 Node Version: ${process.version}`);

const hasMongo = !!process.env.MONGO_URI;
const hasApiKey = !!process.env.API_KEY;
let hasAiLib = "NO ❌";

// Check if AI Library is installed
try {
  require.resolve('@google/genai');
  hasAiLib = "YES ✅";
} catch (e) {
  hasAiLib = "NO ❌ (Missing @google/genai)";
}

console.log(`📌 MONGO_URI Detected: ${hasMongo ? "YES ✅" : "NO ❌"}`);
console.log(`📌 API_KEY Detected: ${hasApiKey ? "YES ✅" : "NO ❌"}`);
console.log(`📌 AI Library Installed: ${hasAiLib}`);

if (hasApiKey) {
  // Print first 4 chars only for verification
  const keySample = process.env.API_KEY.substring(0, 4);
  console.log(`   Key verification: Starts with '${keySample}...' (Length: ${process.env.API_KEY.length})`);
} else {
  console.error("   ⚠️  WARNING: AI features will fail. Go to Render Dashboard > Environment to add API_KEY.");
}
console.log("==================================================");

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

// Helper function to get consistent status
const getSystemStatus = () => {
  const dbStatus = mongoose.connection.readyState;
  const statusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  // Re-check env vars at runtime to catch any updates or scope issues
  const currentApiKey = process.env.API_KEY;
  const currentMongo = process.env.MONGO_URI;

  return { 
    status: 'running', 
    platform: process.env.RENDER ? 'Render' : 'Self-Hosted',
    database: statusMap[dbStatus] || 'unknown',
    env_check: {
      mongo: !!currentMongo,
      api_key: !!currentApiKey && currentApiKey.trim().length > 0
    },
    message: 'TechFlow Backend is Running 🚀', 
    timestamp: new Date().toISOString() 
  };
};

// --- ROUTES ---

// 1. Health Check Route (Root)
app.get('/', (req, res) => {
  res.json(getSystemStatus());
});

// 2. API Health Check
app.get('/api', (req, res) => {
  console.log("➡️ Health Check Request on /api");
  const status = getSystemStatus();
  res.json(status);
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

// Database Connection Logic (Non-Blocking)
const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
      console.error('❌ CRITICAL ERROR: MONGO_URI is missing in environment variables.');
      return; 
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s so we don't hang indefinitely
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ Database connection error:', err.message);
    // We DO NOT exit process here. We keep the server running so the frontend 
    // receives a proper error response instead of a network timeout.
  }
};

// Start Server IMMEDIATELY (Do not wait for DB)
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  
  // Initiate DB connection after server is up
  connectDB();
});
