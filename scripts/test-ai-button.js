const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

async function testAIButton() {
  console.log('🧪 Testing AI Video Creation Setup...');
  
  // Check if Next.js is likely running
  console.log('📋 Manual Testing Instructions:');
  console.log('');
  console.log('1. 🌐 Open your browser and go to: http://localhost:3000/dashboard/ai-create');
  console.log('');
  console.log('2. 📝 Fill out the form:');
  console.log('   - Topic: "The Future of AI in Daily Life"');
  console.log('   - Voice Style: Female Narrator');
  console.log('   - Aspect Ratio: 9:16 (Vertical)');
  console.log('   - Duration: 30 seconds');
  console.log('');
  console.log('3. 🎬 Click "Generate AI Video" button');
  console.log('');
  console.log('4. 👀 Watch for:');
  console.log('   ✅ Button shows "Generating..." with spinning icon');
  console.log('   ✅ Success toast appears');
  console.log('   ❌ Any error messages in browser console');
  console.log('');
  console.log('5. 📊 Check browser Network tab for API calls to:');
  console.log('   - POST requests to /api/ai-video (if any)');
  console.log('   - Any error responses');
  console.log('');
  console.log('🔧 If button does nothing:');
  console.log('   - Check browser console (F12) for JavaScript errors');
  console.log('   - Verify you are logged in with Clerk');
  console.log('   - Check if database tables exist');
  console.log('');
  console.log('📞 Report back what happens when you click the button!');
}

testAIButton();
