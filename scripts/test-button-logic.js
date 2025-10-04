const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

console.log('🧪 Testing Button Logic...');
console.log('');

// Simulate the button disabled logic
const testButtonState = (isGenerating, topic) => {
  const disabled = isGenerating || !topic.trim();
  return {
    isGenerating,
    topic,
    topicTrimmed: topic.trim(),
    topicEmpty: !topic.trim(),
    disabled,
    buttonText: disabled ? 'DISABLED' : 'ENABLED'
  };
};

console.log('📊 Button State Tests:');
console.log('');

// Test case 1: Normal state
const test1 = testButtonState(false, 'Test topic');
console.log('Test 1 - Normal state:');
console.log(`  isGenerating: ${test1.isGenerating}`);
console.log(`  topic: "${test1.topic}"`);
console.log(`  topicTrimmed: "${test1.topicTrimmed}"`);
console.log(`  topicEmpty: ${test1.topicEmpty}`);
console.log(`  disabled: ${test1.disabled}`);
console.log(`  Button: ${test1.buttonText}`);
console.log('');

// Test case 2: Empty topic
const test2 = testButtonState(false, '');
console.log('Test 2 - Empty topic:');
console.log(`  isGenerating: ${test2.isGenerating}`);
console.log(`  topic: "${test2.topic}"`);
console.log(`  topicTrimmed: "${test2.topicTrimmed}"`);
console.log(`  topicEmpty: ${test2.topicEmpty}`);
console.log(`  disabled: ${test2.disabled}`);
console.log(`  Button: ${test2.buttonText}`);
console.log('');

// Test case 3: Generating state
const test3 = testButtonState(true, 'Test topic');
console.log('Test 3 - Generating state:');
console.log(`  isGenerating: ${test3.isGenerating}`);
console.log(`  topic: "${test3.topic}"`);
console.log(`  topicTrimmed: "${test3.topicTrimmed}"`);
console.log(`  topicEmpty: ${test3.topicEmpty}`);
console.log(`  disabled: ${test3.disabled}`);
console.log(`  Button: ${test3.buttonText}`);
console.log('');

// Test case 4: Whitespace only topic
const test4 = testButtonState(false, '   ');
console.log('Test 4 - Whitespace only topic:');
console.log(`  isGenerating: ${test4.isGenerating}`);
console.log(`  topic: "${test4.topic}"`);
console.log(`  topicTrimmed: "${test4.topicTrimmed}"`);
console.log(`  topicEmpty: ${test4.topicEmpty}`);
console.log(`  disabled: ${test4.disabled}`);
console.log(`  Button: ${test4.buttonText}`);
console.log('');

console.log('🎯 Expected behavior:');
console.log('  - Button should be ENABLED when topic has content and not generating');
console.log('  - Button should be DISABLED when topic is empty or generating');
console.log('');
console.log('🔍 If button is greyed out in browser:');
console.log('  1. Check if isGenerating is stuck as true');
console.log('  2. Check if topic input is not updating formData');
console.log('  3. Check browser console for React errors');
console.log('  4. Try entering text in topic field - button should become enabled');
