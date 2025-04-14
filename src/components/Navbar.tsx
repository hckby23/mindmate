'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserCircle, Menu, X } from 'lucide-react';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['700', '800'],
});

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);
  
  // Close menu when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMenuOpen && !target.closest('nav')) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuOpen]);
  
  return (
    <nav className="w-full h-16 flex items-center justify-between px-4 sm:px-6 border-b border-border relative z-50">
      {/* Left: MindMate logo */}
      <Link href="/" className={`text-xl font-extrabold ${montserrat.className}`}>
        <span className="text-primary">Mind</span>
        <span className="text-[var(--purple)]">Mate</span>
      </Link>
      
      {/* Mobile menu button */}
      <button 
        className="md:hidden p-2 text-foreground hover:text-primary"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
      >
        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>
      
      {/* Desktop Navigation links */}
      <div className="hidden md:flex items-center gap-6">
        <Link 
          href="/chat" 
          className={`transition-colors hover:text-primary ${pathname === '/chat' ? 'text-primary' : 'text-foreground'}`}
        >
          Therapize
        </Link>
        <Link 
          href="/professional-help" 
          className={`transition-colors hover:text-primary ${pathname === '/professional-help' ? 'text-primary' : 'text-foreground'}`}
        >
          Professional Help
        </Link>
        <Link 
          href="/login" 
          className="text-foreground hover:text-primary"
          aria-label="Login"
        >
          <UserCircle className="h-6 w-6" />
        </Link>
      </div>
      
      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="absolute top-16 right-4 md:hidden bg-background border border-border rounded-lg shadow-lg z-50">
          <div className="flex flex-col p-2 min-w-[180px]">
            <Link 
              href="/chat" 
              className={`transition-colors hover:text-primary p-3 rounded-md ${pathname === '/chat' ? 'text-primary bg-muted/30' : 'text-foreground'}`}
            >
              Therapize
            </Link>
            <Link 
              href="/professional-help" 
              className={`transition-colors hover:text-primary p-3 rounded-md ${pathname === '/professional-help' ? 'text-primary bg-muted/30' : 'text-foreground'}`}
            >
              Professional Help
            </Link>
            <Link 
              href="/login" 
              className={`text-foreground hover:text-primary p-3 rounded-md flex items-center gap-2 ${pathname === '/login' ? 'text-primary bg-muted/30' : ''}`}
            >
              <UserCircle className="h-5 w-5" />
              <span>Login</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
