'use client';

import { useState, FormEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Montserrat } from 'next/font/google';
import Navbar from '@/components/Navbar';
import { ArrowDown, ArrowUp } from 'lucide-react';

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['700', '800'],
});

export default function MainPage() {
  const [inputValue, setInputValue] = useState('');
  const [currentSection, setCurrentSection] = useState(0);
  const router = useRouter();
  const sectionsRef = useRef<HTMLDivElement>(null);
  
  // Section data
  const sections = [
    {
      id: 'intro',
      title: 'Intro',
      content: 'MindMate is a wellness platform made for students — stigma-free and always available.',
      details: 'Our platform provides a safe space for students to express their feelings, get support, and access resources to improve their mental well-being. We believe that mental health support should be accessible to everyone, regardless of their background or circumstances.'
    },
    {
      id: 'problem',
      title: 'Problem',
      content: 'Over 30% of students face mental health challenges. Most don\'t get help due to stigma, delays, or lack of access.',
      details: 'College students face unique pressures: academic stress, social challenges, financial concerns, and uncertainty about the future. Many students suffer in silence, afraid of judgment or unaware of available resources. Traditional mental health services often have long wait times and can be expensive, creating barriers to getting help when it\'s needed most.'
    },
    {
      id: 'solution',
      title: 'Solution',
      content: 'Peer-to-peer chats, AI check-ins, mindfulness tools, and licensed therapists — all within one app.',
      details: 'MindMate combines technology and human connection to provide multi-layered support. Our AI-powered chat offers immediate, 24/7 guidance for everyday concerns. For deeper issues, we connect students with trained peer supporters and licensed professionals. Our mindfulness tools and resources help students develop healthy coping strategies and resilience.'
    },
    {
      id: 'business',
      title: 'Business Model',
      content: 'Freemium: free features for all; paid therapy via college partnerships.',
      details: 'We believe in making basic mental wellness support free for everyone. Our core features—including AI chat support, community forums, and basic resources—are available at no cost. We partner with universities to provide premium features like professional therapy sessions, advanced tools, and specialized programs, creating a sustainable model that serves students while supporting our mission.'
    },
    {
      id: 'vision',
      title: 'Vision',
      content: 'Every student should have proactive, stigma-free support — MindMate makes that possible.',
      details: 'We envision a world where mental health is treated with the same importance as physical health. Where seeking help is normalized and accessible. Where students don\'t have to choose between their education and their wellbeing. MindMate is working to create this reality by breaking down barriers, changing conversations around mental health, and providing tools that empower students to thrive.'
    }
  ];
  
  // Handle scroll to next/previous section
  const scrollToSection = (direction: 'next' | 'prev') => {
    if (!sectionsRef.current) return;
    
    const newSection = direction === 'next' 
      ? Math.min(currentSection + 1, sections.length - 1)
      : Math.max(currentSection - 1, 0);
    
    setCurrentSection(newSection);
    
    const sectionElement = document.getElementById(sections[newSection].id);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      // Redirect to chat page with initial message
      router.push(`/chat?message=${encodeURIComponent(inputValue)}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col dark bg-background text-foreground overflow-hidden">
      <Navbar />
      
      <main className="flex-1 flex flex-col">
        {/* Hero Section with Centered Logo and Search */}
        <div className="h-screen flex flex-col items-center justify-center px-4">
          <div className="flex flex-col items-center max-w-2xl w-full">
            {/* Larger Logo */}
            <h1 className={`text-8xl font-extrabold mb-16 tracking-tight ${montserrat.className}`}>
              <span className="text-primary">Mind</span>
              <span className="text-[var(--purple)]">Mate</span>
            </h1>
            
            {/* Search Form */}
            <form onSubmit={handleSubmit} className="w-full mb-16">
              <div className="relative w-full">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="How are you feeling today?"
                  className="w-full p-5 pr-12 rounded-lg bg-muted/30 border border-border focus:outline-none focus:ring-2 focus:ring-primary text-lg"
                />
                <button 
                  type="submit" 
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-primary hover:text-[var(--purple)]"
                  disabled={!inputValue.trim()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 2L11 13"/>
                    <path d="M22 2l-7 20-4-9-9-4 20-7z"/>
                  </svg>
                </button>
              </div>
            </form>
            
            {/* Scroll Down Indicator */}
            <button 
              onClick={() => scrollToSection('next')} 
              className="animate-bounce text-primary hover:text-[var(--purple)] transition-colors"
              aria-label="Scroll down"
            >
              <ArrowDown size={32} />
            </button>
          </div>
        </div>
        
        {/* Scrollable Detailed Pages */}
        <div ref={sectionsRef} className="relative">
          {sections.map((section, index) => (
            <section 
              key={section.id} 
              id={section.id}
              className="min-h-screen flex flex-col items-center justify-center p-8 relative"
            >
              <div className="max-w-3xl w-full bg-muted/10 border border-border rounded-xl p-10 backdrop-blur-sm">
                <h2 className={`text-4xl font-bold mb-6 ${montserrat.className} text-primary`}>{section.title}</h2>
                <p className="text-xl mb-6 font-medium">{section.content}</p>
                <p className="text-lg leading-relaxed">{section.details}</p>
              </div>
              
              {/* Navigation Controls */}
              <div className="absolute bottom-10 right-10 flex gap-4">
                {index > 0 && (
                  <button 
                    onClick={() => scrollToSection('prev')} 
                    className="p-3 rounded-full bg-muted/30 text-primary hover:text-[var(--purple)] hover:bg-muted/50 transition-colors"
                    aria-label="Previous section"
                  >
                    <ArrowUp size={24} />
                  </button>
                )}
                {index < sections.length - 1 && (
                  <button 
                    onClick={() => scrollToSection('next')} 
                    className="p-3 rounded-full bg-muted/30 text-primary hover:text-[var(--purple)] hover:bg-muted/50 transition-colors"
                    aria-label="Next section"
                  >
                    <ArrowDown size={24} />
                  </button>
                )}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
