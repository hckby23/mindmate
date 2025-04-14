'use client';

import { Message } from '@/lib/supabase';
import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
  isAnonymous: boolean;
}

export default function ChatMessage({ message, isAnonymous }: ChatMessageProps) {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex gap-4 p-4 ${isUser ? 'bg-muted/30' : 'bg-background'}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-secondary' : isAnonymous ? 'bg-[var(--purple)]' : 'bg-primary'}`}>
        {isUser ? (
          <User className="h-4 w-4 text-secondary-foreground" />
        ) : (
          <Bot className="h-4 w-4 text-primary-foreground" />
        )}
      </div>
      
      <div className="flex-1">
        <div className="font-medium mb-1">
          {isUser ? 'You' : isAnonymous ? 'MindMate (Anonymous)' : 'MindMate'}
        </div>
        <div className="text-foreground/80 whitespace-pre-wrap">
          {message.content}
        </div>
      </div>
    </div>
  );
}
