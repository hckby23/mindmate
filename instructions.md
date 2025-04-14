MindMate – Full Build Instructions (Laptop-Only Version)

Project Overview

You are building MindMate, a mental wellness platform tailored for college students.
	•	Frontend: Next.js + Tailwind CSS (via ShadCN UI)
	•	Backend: Supabase (Auth + Database)
	•	Hosting: Vercel
	•	LLM API: OpenRouter API
	•	UI Design: Dark theme with cool blue primary (hover = purple)
	•	Login: Optional — users can use anonymously or log in for chat history

Pages to Build
	•	MainPage.tsx
	•	ChatPage.tsx
	•	LoginPage.tsx
	•	ProfessionalHelpPage.tsx

General UI Guidelines

Navbar (Top):
	•	Left: “MindMate” (click → homepage)
	•	Right (rightmost order):
Therapize → Professional Help → Login Icon

Sidebar (ChatPage only):
	•	Top: New Chat, Professional Help
	•	Bottom: Logout

Style & Layout
	•	Dark background
	•	Cool Blue as primary color
→ Changes to Purple on hover
	•	Smooth transitions (e.g., hover, load, scroll)
	•	MindMate Logo:
	•	Mind = cool blue
	•	Mate = purple
	•	Laptop resolution optimized (1024px+), no mobile responsiveness required
	•	Use full-screen width and height where needed (e.g., Chat layout)

⸻

Main Page (MainPage.tsx)
	•	Centered MindMate logo
	•	Centered chat input bar
	•	When user types and submits → redirect to ChatPage.tsx
	•	Auto-start a new chat, show bot response
	•	Below: Scrollable 5-section layout
Each block summarizing a pitch segment:

Scroll Blocks (in order):
	1.	Intro
MindMate is a wellness platform made for students — stigma-free and always available.
	2.	Problem
Over 30% of students face mental health challenges. Most don’t get help due to stigma, delays, or lack of access.
	3.	Solution
Peer-to-peer chats, AI check-ins, mindfulness tools, and licensed therapists — all within one app.
	4.	Business Model
Freemium: free features for all; paid therapy via college partnerships.
	5.	Vision
Every student should have proactive, stigma-free support — MindMate makes that possible.

⸻

Chat Page (ChatPage.tsx)
	•	UI inspired by Claude chat layout
	•	Top Right: Anonymous toggle (ghost icon)
	•	When enabled: switch entire color palette from Blue → Purple
	•	Chat cards for past sessions (load from Supabase)
	•	New chats auto-saved with timestamp and anonymized if needed
	•	Bottom input bar for sending messages
	•	Scrollable full-height chat area
	•	AI response inserted after user message via OpenRouter API

⸻

Professional Help Page (ProfessionalHelpPage.tsx)
	•	List verified psychiatrists (Dehradun only)
	•	Display as simple cards with:
	•	Name
	•	License ID
	•	Available time slots
	•	Contact/Booking link (optional)
	•	No photos

⸻

Login Page (LoginPage.tsx)
	•	Optional login page via Supabase Auth
	•	Allow:
	•	Social login (Google, etc.)
	•	Email login
	•	If logged in:
	•	Store chat history
	•	Tag chats to user ID
	•	Track personal settings (anonymous toggle, etc.)
-----
Supabase Schema (Suggested Tables)
users: 
  - id (UUID)
  - email
  - created_at

chats:
  - id
  - user_id (nullable)
  - title
  - is_anonymous (boolean)
  - created_at

messages:
  - id
  - chat_id
  - role (user/ai)
  - content
  - created_at

psychiatrists:
  - id
  - name
  - license_id
  - location
  - availability
  - contact
-----
OpenRouter API Integration
	•	Endpoint: https://openrouter.ai/api/v1/chat/completions
	•	Headers:
	•	Authorization: Bearer <your-openrouter-api-key>
	•	Content-Type: application/json
	•	Body Example:(
        {
  "model": "mistral", // or gemini-pro, gpt-4, etc.
  "messages": [
    { "role": "user", "content": "I'm feeling really overwhelmed with work." }
  ]
}
	•	Append AI response to messages list in ChatPage.tsx


⸻

Deployment Steps
	1.	Build frontend in Windsurf
	2.	Connect to Supabase (Auth + DB)
	3.	Push to GitHub
	4.	Link repo to Vercel
	5.	Set environment variables in Vercel:
	•	NEXT_PUBLIC_SUPABASE_URL
	•	NEXT_PUBLIC_SUPABASE_ANON_KEY
	•	OPENROUTER_API_KEY

⸻

Change File (CHANGELOG.md)

Track every version and update. Sample:
## [v1.0.0] - 2025-04-14
### Added
- Initial 4 pages (Main, Chat, Login, Professional Help)
- Claude-style Chat UI with anonymous toggle
- Therapist cards for Dehradun

### Changed
- Navbar layout with Login Icon
- Optional login via Supabase
- Color hover effect from blue to purple

Final Notes
	•	Design ONLY for laptop resolution (1024px and up)
	•	Use /components folder (Windsurf convention) for UI building blocks
	•	Use shadcn/ui for polished components and transitions
	•	Keep everything smooth, minimal, elegant
	•	Ensure anonymous toggle updates chat theme live