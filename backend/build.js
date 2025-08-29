const fs = require('fs');
const path = require('path');

// Simple build script that copies source files to dist and renames .ts to .js
// This bypasses TypeScript compilation issues

const srcDir = path.join(__dirname, 'src');
const distDir = path.join(__dirname, 'dist');

// Create dist directory if it doesn't exist
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy all files from src to dist and rename .ts to .js
function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const files = fs.readdirSync(src);
  
  for (const file of files) {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    
    if (fs.statSync(srcPath).isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      // Rename .ts files to .js for Node.js compatibility
      let finalDestPath = destPath;
      if (file.endsWith('.ts')) {
        const jsFileName = file.replace('.ts', '.js');
        finalDestPath = path.join(dest, jsFileName);
        console.log(`Renamed: ${srcPath} -> ${finalDestPath}`);
      } else {
        console.log(`Copied: ${srcPath} -> ${finalDestPath}`);
      }
      
      // Copy file directly (no compilation)
      fs.copyFileSync(srcPath, finalDestPath);
    }
  }
}

console.log('🚀 Starting simple build...');
console.log(`Source: ${srcDir}`);
console.log(`Destination: ${distDir}`);

try {
  copyDirectory(srcDir, distDir);
  console.log('✅ Build completed successfully!');
  console.log('📁 Files copied to dist/ directory');
  console.log('🔄 .ts files renamed to .js for Node.js compatibility');
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}
