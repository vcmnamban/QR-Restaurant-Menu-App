const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Simple and reliable TypeScript build script
console.log('🚀 Starting TypeScript build...');

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

  // Try TypeScript compilation
  console.log('🔨 Compiling TypeScript...');
  execSync('npx tsc --project .', { 
    stdio: 'inherit', 
    cwd: __dirname,
    env: { ...process.env, NODE_ENV: 'production' }
  });
  
  console.log('✅ TypeScript compilation successful!');
  console.log('📁 JavaScript files generated in dist/ directory');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  
  // If TypeScript compilation fails, provide helpful error message
  if (error.status !== 0) {
    console.error('\n💡 Troubleshooting tips:');
    console.error('1. Check that all TypeScript files have valid syntax');
    console.error('2. Ensure all imports are correct');
    console.error('3. Verify tsconfig.json settings');
    console.error('4. Run "npm install" to ensure dependencies are installed');
  }
  
  process.exit(1);
}
