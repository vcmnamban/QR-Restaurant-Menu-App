const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Simple user schema for the script
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, enum: ['customer', 'restaurant_owner', 'admin'], default: 'customer' },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);

async function createTestUser() {
  try {
    // Connect to MongoDB using Railway's MONGODB_URI
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/qr-restaurant-menu';
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'test@example.com' });
    if (existingUser) {
      console.log('✅ Test user already exists:');
      console.log('   Email: test@example.com');
      console.log('   Password: password123');
      process.exit(0);
    }

    // Create test user
    console.log('Creating test user...');
    const testUser = new User({
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      phone: '0501234567',
      role: 'customer',
      isVerified: true,
      isActive: true
    });

    await testUser.save();
    console.log('✅ Test user created successfully!');
    console.log('   Email: test@example.com');
    console.log('   Password: password123');
    console.log('   Role: customer');

  } catch (error) {
    console.error('❌ Error creating test user:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
}

createTestUser();
