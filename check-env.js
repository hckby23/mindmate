// Simple script to check environment variables
require('dotenv').config({ path: '.env.local' });

console.log('Checking environment variables...');
console.log('NEXT_PUBLIC_OPENROUTER_API_KEY:', process.env.NEXT_PUBLIC_OPENROUTER_API_KEY ? 'Set (value hidden for security)' : 'Not set');
