// Script to check API key in environment variables
require('dotenv').config({ path: '.env.local' });

console.log('Checking API key in environment variables:');
console.log('NEXT_PUBLIC_OPENROUTER_API_KEY exists:', !!process.env.NEXT_PUBLIC_OPENROUTER_API_KEY);
console.log('OPENROUTER_API_KEY exists:', !!process.env.OPENROUTER_API_KEY);

// Print the first few characters of the key for verification (if it exists)
if (process.env.NEXT_PUBLIC_OPENROUTER_API_KEY) {
  const key = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
  console.log('NEXT_PUBLIC_OPENROUTER_API_KEY starts with:', key.substring(0, 10) + '...');
}

if (process.env.OPENROUTER_API_KEY) {
  const key = process.env.OPENROUTER_API_KEY;
  console.log('OPENROUTER_API_KEY starts with:', key.substring(0, 10) + '...');
}
