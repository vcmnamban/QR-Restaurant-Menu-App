import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Get MongoDB URI from multiple possible environment variables
const getMongoUri = (): string => {
  // Priority order for MongoDB connection string
  const possibleUris = [
    process.env.MONGODB_URI,
    process.env.MONGO_URL,
    process.env.MONGODB_URL,
    process.env.DATABASE_URL,
    process.env.DB_URI
  ];

  // Find the first valid URI
  for (const uri of possibleUris) {
    if (uri && uri.trim() !== '') {
      console.log(`🔍 Found MongoDB URI from environment variable`);
      return uri.trim();
    }
  }

  // Fallback for local development
  console.log('⚠️  No MongoDB URI found in environment variables, using localhost fallback');
  return 'mongodb://localhost:27017/qr-restaurant-menu';
};

// Clean and validate the connection string
const cleanConnectionString = (uri: string): string => {
  try {
    console.log(`🔧 Processing connection string: ${uri.substring(0, 20)}...`);
    
    // Check for common Railway MongoDB Plugin patterns
    if (uri.includes('${{') || uri.includes('mongodb.railway.internal')) {
      console.warn('⚠️  Detected Railway variable reference - this should be resolved automatically');
    }

    // Check for empty userinfo section (common Railway issue)
    if (uri.includes('://:@') || uri.includes('://:@')) {
      console.error('❌ Malformed URI detected: empty userinfo section');
      console.error('💡 This usually means Railway variables are not being resolved');
      console.error('💡 Please check your Railway MongoDB Plugin configuration');
      throw new Error('MongoDB URI contains empty userinfo section - Railway variables not resolved');
    }

    // Check for basic MongoDB URI format
    if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
      console.error('❌ Invalid MongoDB URI format');
      throw new Error('Invalid MongoDB URI format - must start with mongodb:// or mongodb+srv://');
    }

    console.log('✅ Connection string validation passed');
    return uri;
  } catch (error) {
    console.error('❌ Connection string validation failed:', error.message);
    throw error;
  }
};

// Get the final MongoDB URI
const MONGODB_URI = getMongoUri();

export const connectDatabase = async (): Promise<void> => {
  try {
    console.log('🔌 Attempting to connect to MongoDB...');
    
    // Clean and validate the connection string
    const cleanUri = cleanConnectionString(MONGODB_URI);
    
    // Log connection attempt (mask credentials)
    const maskedUri = cleanUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
    console.log(`📡 Connection string: ${maskedUri}`);

    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      bufferMaxEntries: 0,
      bufferCommands: false,
      retryWrites: true,
      w: 'majority',
    };

    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(cleanUri, options);

    console.log('✅ Successfully connected to MongoDB');
    console.log(`📊 Database: ${mongoose.connection.name}`);
    console.log(`🔗 Host: ${mongoose.connection.host}`);
    console.log(`🚪 Port: ${mongoose.connection.port}`);

    // Set up connection event handlers
    mongoose.connection.on('error', (error) => {
      console.error('❌ MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });

    // Handle process termination
    const gracefulShutdown = async (signal: string) => {
      console.log(`\n🛑 Received ${signal}. Closing MongoDB connection...`);
      try {
        await mongoose.connection.close();
        console.log('✅ MongoDB connection closed gracefully');
        process.exit(0);
      } catch (error) {
        console.error('❌ Error closing MongoDB connection:', error);
        process.exit(1);
      }
    };

    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

  } catch (error: any) {
    console.error('❌ Failed to connect to MongoDB:', error.message);

    // Provide specific troubleshooting guidance
    if (error.message.includes('empty userinfo section')) {
      console.error('\n🔧 TROUBLESHOOTING: Empty userinfo section detected');
      console.error('💡 This means Railway MongoDB Plugin variables are not being resolved');
      console.error('💡 Solutions:');
      console.error('   1. Check if MongoDB Plugin is properly installed in Railway');
      console.error('   2. Verify MONGODB_URI environment variable is set correctly');
      console.error('   3. Try removing and re-adding the MongoDB Plugin');
      console.error('   4. Check Railway logs for MongoDB Plugin status');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.error('\n🔧 TROUBLESHOOTING: Connection refused');
      console.error('💡 This means the MongoDB server is not accessible');
      console.error('💡 Solutions:');
      console.error('   1. Check if MongoDB service is running in Railway');
      console.error('   2. Verify network configuration (Public vs Private)');
      console.error('   3. Check if MongoDB Plugin is healthy');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('\n🔧 TROUBLESHOOTING: Hostname not found');
      console.error('💡 This means the MongoDB hostname cannot be resolved');
      console.error('💡 Solutions:');
      console.error('   1. Check if MongoDB Plugin is properly configured');
      console.error('   2. Verify the connection string format');
      console.error('   3. Try refreshing Railway environment variables');
    } else if (error.message.includes('authentication failed')) {
      console.error('\n🔧 TROUBLESHOOTING: Authentication failed');
      console.error('💡 This means the username/password is incorrect');
      console.error('💡 Solutions:');
      console.error('   1. Check MongoDB Plugin credentials');
      console.error('   2. Verify MONGODB_URI contains correct username/password');
      console.error('   3. Try regenerating MongoDB Plugin credentials');
    }

    console.error('\n📋 CURRENT ENVIRONMENT VARIABLES:');
    console.error(`   MONGODB_URI: ${process.env.MONGODB_URI ? 'SET' : 'NOT SET'}`);
    console.error(`   MONGO_URL: ${process.env.MONGO_URL ? 'SET' : 'NOT SET'}`);
    console.error(`   NODE_ENV: ${process.env.NODE_ENV || 'NOT SET'}`);
    console.error(`   RAILWAY_ENVIRONMENT: ${process.env.RAILWAY_ENVIRONMENT || 'NOT SET'}`);

    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed');
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', error);
    throw error;
  }
};

// Export mongoose instance for use in models
export { mongoose };
