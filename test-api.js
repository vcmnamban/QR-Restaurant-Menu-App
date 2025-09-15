// Simple test script to check if the API is working
const https = require('https');

const testAPI = async () => {
  const baseURL = 'https://qr-restaurant-menu-app-production.up.railway.app';
  
  console.log('🔍 Testing API endpoints...');
  
  // Test 1: Basic health check
  try {
    const response1 = await fetch(`${baseURL}/api/restaurants/test`);
    const data1 = await response1.json();
    console.log('✅ Test endpoint:', data1);
  } catch (error) {
    console.log('❌ Test endpoint failed:', error.message);
  }
  
  // Test 2: Fallback test
  try {
    const response2 = await fetch(`${baseURL}/api/restaurants/test-fallback`);
    const data2 = await response2.json();
    console.log('✅ Fallback test:', data2);
  } catch (error) {
    console.log('❌ Fallback test failed:', error.message);
  }
  
  // Test 3: Restaurant endpoint
  try {
    const response3 = await fetch(`${baseURL}/api/restaurants/68c06ccb91f62a12fa494813`);
    const data3 = await response3.json();
    console.log('✅ Restaurant endpoint:', data3);
  } catch (error) {
    console.log('❌ Restaurant endpoint failed:', error.message);
  }
  
  // Test 4: Menu items endpoint
  try {
    const response4 = await fetch(`${baseURL}/api/restaurants/68c06ccb91f62a12fa494813/menu-items`);
    const data4 = await response4.json();
    console.log('✅ Menu items endpoint:', data4);
  } catch (error) {
    console.log('❌ Menu items endpoint failed:', error.message);
  }
  
  // Test 5: Categories endpoint
  try {
    const response5 = await fetch(`${baseURL}/api/restaurants/68c06ccb91f62a12fa494813/categories`);
    const data5 = await response5.json();
    console.log('✅ Categories endpoint:', data5);
  } catch (error) {
    console.log('❌ Categories endpoint failed:', error.message);
  }
};

testAPI();

