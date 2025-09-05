import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import authRoutes from './routes/auth';
import restaurantRoutes from './routes/restaurants';
import menuRoutes from './routes/menus';
import orderRoutes from './routes/orders';
import userRoutes from './routes/users';
import paymentRoutes from './routes/payments';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);
const HOST = process.env.HOST || '0.0.0.0';
const NODE_ENV = process.env.NODE_ENV || 'development';

// Trust proxy for Railway deployment
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());
app.use(compression());

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://qr-restaurant-menu-app-01.vercel.app',
  'https://qr-restaurant-menu-app-01-git-ph-b80017-vaseem-nambans-projects.vercel.app',
  'https://qr-restaurant-menu-app-01-ks2gcm4wd-vaseem-nambans-projects.vercel.app',
  'https://qr-restaurant-menu-app-01-ffrod815p-vaseem-nambans-projects.vercel.app'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow localhost for development
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    
    // Allow all Vercel domains
    if (origin.includes('vercel.app')) {
      return callback(null, true);
    }
    
    // Allow specific domains from environment variable
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use(morgan('combined'));

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'QR Restaurant Menu API',
    version: '1.0.0',
    status: 'OK',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      restaurants: '/api/restaurants',
      menus: '/api/menus',
      orders: '/api/orders',
      users: '/api/users'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

const startServer = async (): Promise<void> => {
  try {
    // Connect to database with retry logic
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount < maxRetries) {
      try {
        console.log(`🔄 Database connection attempt ${retryCount + 1}/${maxRetries}`);
        await connectDatabase();
        break; // Success, exit retry loop
      } catch (error) {
        retryCount++;
        console.error(`❌ Database connection attempt ${retryCount} failed:`, error.message);
        
        if (retryCount >= maxRetries) {
          console.error('💥 Maximum database connection retries reached. Exiting...');
          process.exit(1);
        }
        
        // Wait before retrying (exponential backoff)
        const waitTime = Math.min(1000 * Math.pow(2, retryCount), 10000);
        console.log(`⏳ Waiting ${waitTime}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }

    // Start the server
    const server = app.listen(PORT, HOST, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`🌍 Environment: ${NODE_ENV}`);
      console.log(`📊 Database: ${mongoose.connection.name || 'Connecting...'}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
      
      server.close(async () => {
        console.log('🔄 HTTP server closed');
        
        try {
          if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
            console.log('🔄 MongoDB connection closed');
          }
          console.log('✅ Graceful shutdown completed');
          process.exit(0);
        } catch (error) {
          console.error('❌ Error during graceful shutdown:', error);
          process.exit(1);
        }
      });
      
      // Force shutdown after 30 seconds
      setTimeout(() => {
        console.error('💥 Forced shutdown after timeout');
        process.exit(1);
      }, 30000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

export default app;
