# MindMate - Mental Wellness Platform for Students

MindMate is a mental wellness platform tailored for college students, providing stigma-free support and resources. This application is built with Next.js, Tailwind CSS (via ShadCN UI), and Supabase for backend services.

## Features

- **Chat Interface**: AI-powered chat for mental wellness support using OpenRouter API
- **Anonymous Mode**: Toggle between regular and anonymous chat sessions
- **User Authentication**: Optional login via Supabase Auth (Google, Email)
- **Professional Help**: Directory of verified psychiatrists in Dehradun
- **Modern UI**: Dark theme with cool blue primary color and purple hover effects

## Tech Stack

- **Frontend**: Next.js 15.3.0 + Tailwind CSS 4 (via ShadCN UI)
- **Backend**: Supabase (Auth + Database)
- **Hosting**: Vercel
- **LLM API**: OpenRouter API
- **UI Design**: Dark theme with cool blue primary (hover = purple)

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm or yarn
- Supabase account
- OpenRouter API key

### Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENROUTER_API_KEY=your_openrouter_api_key
```

### Installation

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Database Schema

The application uses the following Supabase tables:

- **users**: User authentication data
- **chats**: Chat sessions with anonymity flag
- **messages**: Individual messages within chats
- **psychiatrists**: Professional help directory

## Deployment

This application is configured for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set the environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `OPENROUTER_API_KEY`

## Design Notes

- Optimized for laptop resolution (1024px+)
- No mobile responsiveness required
- Dark theme with cool blue primary color
- Purple accents for hover states and anonymous mode
