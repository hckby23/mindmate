'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserCircle } from 'lucide-react';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['700', '800'],
});

export default function Navbar() {
  const pathname = usePathname();
  
  return (
    <nav className="w-full h-16 flex items-center justify-between px-6 border-b border-border">
      {/* Left: MindMate logo */}
      <Link href="/" className={`text-xl font-extrabold ${montserrat.className}`}>
        <span className="text-primary">Mind</span>
        <span className="text-[var(--purple)]">Mate</span>
      </Link>
      
      {/* Right: Navigation links */}
      <div className="flex items-center gap-6">
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
    </nav>
  );
}
