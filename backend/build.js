// VERSION 2.0 - NEW BUILD SYSTEM
// This script compiles TypeScript to JavaScript for production deployment
// Railway should use this new version instead of the old file copy approach

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// NEW BUILD SCRIPT - TypeScript compilation with proper error handling
console.log('🚀 NEW BUILD: Starting TypeScript compilation...');

const srcDir = path.join(__dirname, 'src');
const distDir = path.join(__dirname, 'dist');

try {
  // Clean and recreate dist directory
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
    console.log('🧹 Cleaned dist directory');
  }
  
  fs.mkdirSync(distDir, { recursive: true });
  console.log('📁 Created dist directory');

  // Use TypeScript compiler with explicit project file
  console.log('🔨 Compiling TypeScript with tsc...');
  execSync('npx tsc --project tsconfig.json', { 
    stdio: 'inherit', 
    cwd: __dirname,
    env: { ...process.env, NODE_ENV: 'production' }
  });
  
  console.log('✅ TypeScript compilation successful!');
  console.log('📁 JavaScript files generated in dist/ directory');
  
  // Verify the compiled files exist
  const serverJsPath = path.join(distDir, 'server.js');
  if (fs.existsSync(serverJsPath)) {
    console.log('✅ server.js compiled successfully');
  } else {
    throw new Error('server.js was not generated');
  }
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  
  if (error.status !== 0) {
    console.error('\n💡 Troubleshooting tips:');
    console.error('1. Check that all TypeScript files have valid syntax');
    console.error('2. Ensure all imports are correct');
    console.error('3. Verify tsconfig.json settings');
    console.error('4. Run "npm install" to ensure dependencies are installed');
  }
  
  process.exit(1);
}
