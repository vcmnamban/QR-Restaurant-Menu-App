# 🚨 DEPLOYMENT FIXES - QR Restaurant Menu Backend

## ✅ **Issues Fixed**

### 1. **MongoDB Connection Error: `option buffermaxentries is not supported`**
- **Problem**: Using deprecated `bufferMaxEntries: 0` option that was removed in MongoDB 4.0+
- **Solution**: Removed the deprecated option from database connection options
- **File**: `src/config/database.ts` - Line 78

### 2. **Duplicate Index Warning: `Duplicate schema index on {"email":1} found`**
- **Problem**: Email field had both `unique: true` in schema AND `userSchema.index({ email: 1 })`
- **Solution**: Removed the duplicate `userSchema.index({ email: 1 })` call
- **File**: `src/models/User.ts` - Line 147

### 3. **Production Build Configuration**
- **Problem**: Using `ts-node` in production which is not recommended
- **Solution**: Updated to proper TypeScript compilation with `tsc`
- **Files**: 
  - `package.json` - Updated scripts and main field
  - `railway.json` - Added build command

### 4. **MongoDB Connection Options**
- **Problem**: Basic connection options without production optimizations
- **Solution**: Added production-ready MongoDB options:
  - `w: 'majority'` - Write concern for data durability
  - `readPreference: 'primary'` - Read from primary node
  - `maxIdleTimeMS: 30000` - Connection pool management
  - `minPoolSize: 2` - Minimum connection pool size

## 🔧 **Files Modified**

### `src/config/database.ts`
```typescript
// BEFORE (deprecated options)
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  bufferMaxEntries: 0,        // ❌ REMOVED - Deprecated
  bufferCommands: false,
  retryWrites: true,
};

// AFTER (modern options)
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  bufferCommands: false,
  retryWrites: true,
  w: 'majority',              // ✅ ADDED - Write concern
  readPreference: 'primary',  // ✅ ADDED - Read preference
  maxIdleTimeMS: 30000,       // ✅ ADDED - Connection management
  minPoolSize: 2,             // ✅ ADDED - Pool management
};
```

### `src/models/User.ts`
```typescript
// BEFORE (duplicate index)
email: {
  type: String,
  required: [true, 'Email is required'],
  unique: true,               // ✅ Schema-level unique constraint
  // ... other options
}

// Later in the file...
userSchema.index({ email: 1 }); // ❌ REMOVED - Duplicate index

// AFTER (single index)
email: {
  type: String,
  required: [true, 'Email is required'],
  unique: true,               // ✅ Only schema-level unique constraint
  // ... other options
}

// No duplicate index() call
```

### `package.json`
```json
// BEFORE
{
  "main": "src/server.ts",
  "scripts": {
    "start": "ts-node src/server.ts",
    "build": "echo 'Build completed - using ts-node for production'"
  }
}

// AFTER
{
  "main": "dist/server.js",
  "scripts": {
    "start": "node dist/server.js",
    "build": "tsc",
    "build:prod": "tsc && npm run clean"
  }
}
```

### `railway.json`
```json
// BEFORE
{
  "build": {
    "builder": "NIXPACKS"
  }
}

// AFTER
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm run build"
  }
}
```

## 🚀 **Deployment Process**

### 1. **Build Process**
```bash
npm run build    # Compiles TypeScript to JavaScript
npm start        # Runs compiled JavaScript from dist/ folder
```

### 2. **Railway Deployment**
- Railway will automatically run `npm run build` during build phase
- Production server will run `npm start` which executes compiled code
- No more `ts-node` in production

### 3. **MongoDB Connection**
- Modern connection options for better performance and reliability
- Proper error handling and retry logic
- Production-ready connection pool management

## 📋 **Verification Checklist**

- [ ] MongoDB connection options updated (no deprecated options)
- [ ] Duplicate email index removed from User model
- [ ] Package.json scripts updated for production build
- [ ] Railway.json includes build command
- [ ] TypeScript compilation configured properly
- [ ] .dockerignore file created for optimized builds

## 🎯 **Expected Results**

After these fixes, your deployment should:
1. ✅ Connect to MongoDB successfully without deprecated option errors
2. ✅ No more duplicate index warnings
3. ✅ Proper production build process
4. ✅ Faster deployment with optimized Docker builds
5. ✅ Better MongoDB connection performance and reliability

## 🔍 **Monitoring**

Watch for these success indicators in Railway logs:
```
✅ Successfully connected to MongoDB
📊 Database: qr-restaurant-menu
🔗 Host: mongodb.railway.internal
🚪 Port: 27017
🚀 Server is running on port 5000
```

## 🆘 **If Issues Persist**

1. **Check Railway MongoDB Plugin status**
2. **Verify environment variables are set correctly**
3. **Check if MongoDB Plugin needs to be re-added**
4. **Review Railway service logs for other errors**
5. **Ensure MongoDB Plugin is healthy and accessible**
