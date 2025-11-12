import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { setupRoutes } from './routes';
import { setupSocketIO } from './socket';

// Load environment variables from .env file in server directory
import path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env') });

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingEnvVars.length > 0 && process.env.NODE_ENV === 'production') {
  console.error(`❌ Missing required environment variables: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

// Warn about weak JWT secret in production
if (process.env.NODE_ENV === 'production' && process.env.JWT_SECRET === 'your-secret-key-change-in-production') {
  console.error('❌ WARNING: Using default JWT_SECRET in production! This is insecure!');
  process.exit(1);
}

const app = express();
const server = http.createServer(app);
const defaultOrigins = ['http://20.244.41.209:3000/', 'https://vele-teal.vercel.app'];
const envOrigins = (process.env.CLIENT_URLS || process.env.CLIENT_URL || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);
console.log('envOrigins', envOrigins);
console.log('defaultOrigins', defaultOrigins);

const allowedOrigins: string[] = Array.from(new Set([...defaultOrigins, ...envOrigins]));

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

console.log(allowedOrigins);
console.log(defaultOrigins);


const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vele';

// Trust proxy (required for Render and other cloud platforms)
app.set('trust proxy', true);

// Middleware
// CORS must come before other middleware
// app.use(cors({
//   origin: allowedOrigins,
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
//   exposedHeaders: ['Content-Type'],
// }));


app.use(cors({
  origin: "http://20.244.41.209:3000",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  // allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  // exposedHeaders: ['Content-Type'],
}));


app.get("/debug",(req,res)=>{
res.send(
JSON.stringify({
  allowedOrigins,
  defaultOrigins,
  envOrigins,
})
)
})

// Configure Helmet to allow CORS
// app.use(helmet({
//   crossOriginResourcePolicy: { policy: "cross-origin" },
//   crossOriginEmbedderPolicy: false,
// }));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from client build (if exists)
const clientBuildPath = path.join(__dirname, '../../client/out');
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(clientBuildPath));
}

// Routes
setupRoutes(app);

// Serve client app for all non-API routes (SPA fallback)
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    // Don't serve client for API routes
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}
setupSocketIO(io);

// MongoDB Connection
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(async () => {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});

