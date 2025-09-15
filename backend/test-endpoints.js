// Test script to verify menu endpoints are working
const https = require('https');

const testEndpoints = async () => {
  const baseUrl = 'https://qr-restaurant-menu-app-production.up.railway.app';
  const restaurantId = '68c06ccb91f62a12fa494813';
  
  console.log('🧪 Testing menu endpoints...');
  
  // Test categories endpoint
  try {
    const categoriesResponse = await fetch(`${baseUrl}/api/restaurants/${restaurantId}/categories`);
    console.log('Categories endpoint status:', categoriesResponse.status);
    if (categoriesResponse.ok) {
      const data = await categoriesResponse.json();
      console.log('✅ Categories endpoint working:', data);
    } else {
      console.log('❌ Categories endpoint failed:', await categoriesResponse.text());
    }
  } catch (error) {
    console.log('❌ Categories endpoint error:', error.message);
  }
  
  // Test menu-items endpoint
  try {
    const menuItemsResponse = await fetch(`${baseUrl}/api/restaurants/${restaurantId}/menu-items`);
    console.log('Menu items endpoint status:', menuItemsResponse.status);
    if (menuItemsResponse.ok) {
      const data = await menuItemsResponse.json();
      console.log('✅ Menu items endpoint working:', data);
    } else {
      console.log('❌ Menu items endpoint failed:', await menuItemsResponse.text());
    }
  } catch (error) {
    console.log('❌ Menu items endpoint error:', error.message);
  }
};

testEndpoints();

