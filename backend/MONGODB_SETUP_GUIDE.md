# MongoDB Setup Guide for Railway

## Current Issue
The application is failing with `MongoParseError: URI contained empty userinfo section`, which means the MongoDB connection string is malformed.

## Root Cause
Railway's MongoDB Plugin is providing a connection string with unresolved variables, resulting in a malformed URI like `mongodb://:@host:port`.

## Solution Steps

### Step 1: Remove Current MongoDB Plugin (if exists)
1. Go to your Railway project dashboard
2. Find the MongoDB service (if it exists)
3. Click on it and go to Settings
4. Click "Delete Service" to remove it completely

### Step 2: Add Fresh MongoDB Plugin
1. In your Railway project dashboard, click "New Service"
2. Select "Database" → "MongoDB"
3. Choose your preferred plan (Free tier is fine for development)
4. Click "Deploy"

### Step 3: Configure Environment Variables
1. Go to your main backend service (not the MongoDB service)
2. Click on "Variables" tab
3. Add these environment variables:

```
MONGODB_URI=${{MongoDB.MONGO_URL}}
```

**IMPORTANT**: 
- Use `MONGODB_URI` (not `MONGO_URL`)
- Copy the exact variable reference: `${{MongoDB.MONGO_URL}}`
- Make sure there are no extra spaces or characters

### Step 4: Verify MongoDB Service Variables
1. Go to your MongoDB service
2. Click on "Variables" tab
3. You should see:
   - `MONGO_URL` - The actual connection string
   - `MONGO_INITDB_ROOT_USERNAME` - Username
   - `MONGO_INITDB_ROOT_PASSWORD` - Password
   - `MONGO_INITDB_DATABASE` - Database name

### Step 5: Test Connection
1. Deploy your backend service
2. Check the logs for connection status
3. The new error handling should show detailed connection information

## Alternative: Manual Connection String
If the variable reference doesn't work:

1. Go to MongoDB service variables
2. Copy the actual `MONGO_URL` value (it should look like: `mongodb://username:password@host:port/database`)
3. In your backend service variables, set:
   ```
   MONGODB_URI=mongodb://username:password@host:port/database
   ```
4. Replace `username`, `password`, `host`, `port`, and `database` with actual values

## Expected Connection String Format
```
mongodb://username:password@host:port/database?retryWrites=true&w=majority
```

## Troubleshooting

### If you still get "empty userinfo section":
1. Check if the `MONGO_URL` in MongoDB service actually contains credentials
2. Ensure you're copying the entire string including username:password
3. Verify there are no extra quotes or spaces

### If you get "connection refused":
1. Check if MongoDB service is running (green status)
2. Verify the host and port in the connection string
3. Ensure your backend service can reach the MongoDB service

### If you get "authentication failed":
1. Verify username and password are correct
2. Check if the database name exists
3. Ensure the user has proper permissions

## Code Changes Made
The application has been updated with:
- Better error handling for malformed connection strings
- Automatic retry logic for database connections
- Detailed logging for debugging
- Graceful shutdown handling

## Next Steps
1. Follow the setup steps above
2. Deploy your application
3. Check logs for connection status
4. If successful, you should see: "✅ Successfully connected to MongoDB"

## Support
If issues persist after following this guide:
1. Check Railway's documentation
2. Verify all environment variables are set correctly
3. Ensure MongoDB service is healthy and running

