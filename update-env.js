// Script to update environment variables
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Get the current API key
const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;

if (!apiKey) {
  console.error('ERROR: NEXT_PUBLIC_OPENROUTER_API_KEY is not set in .env.local');
  process.exit(1);
}

// Create or update .env.local file
const envPath = path.join(__dirname, '.env.local');
let envContent = '';

// Read existing content if file exists
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
}

// Update or add the OPENROUTER_API_KEY
if (envContent.includes('OPENROUTER_API_KEY=')) {
  // Replace existing value
  envContent = envContent.replace(
    /OPENROUTER_API_KEY=.*/,
    `OPENROUTER_API_KEY=${apiKey}`
  );
} else {
  // Add new entry
  envContent += `\nOPENROUTER_API_KEY=${apiKey}\n`;
}

// Write back to file
fs.writeFileSync(envPath, envContent);

console.log('Successfully updated OPENROUTER_API_KEY in .env.local');
console.log('Please restart your Next.js server for changes to take effect.');
