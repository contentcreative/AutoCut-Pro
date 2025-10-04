const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

console.log('🔧 Testing Worker Authentication...');
console.log('');

// Check environment variables
console.log('📋 Environment Variables:');
console.log(`WORKER_API_KEY: ${process.env.WORKER_API_KEY ? '✅ Set' : '❌ Missing'}`);
console.log(`WORKER_BASE_URL: ${process.env.WORKER_BASE_URL || 'http://localhost:3030'}`);
console.log('');

// Test the worker endpoint
async function testWorkerAuth() {
  try {
    console.log('🧪 Testing worker authentication...');
    
    const response = await fetch('http://localhost:3030/video/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.WORKER_API_KEY || 'dev-secret'
      },
      body: JSON.stringify({
        jobId: 'test-123',
        projectId: 'test-456',
        inputTopic: 'test topic',
        settings: {}
      })
    });

    const result = await response.text();
    console.log(`Response Status: ${response.status}`);
    console.log(`Response Body: ${result}`);

    if (response.ok) {
      console.log('✅ Worker authentication working!');
    } else {
      console.log('❌ Worker authentication failed');
    }

  } catch (error) {
    console.log('❌ Error testing worker:', error.message);
  }
}

testWorkerAuth();
