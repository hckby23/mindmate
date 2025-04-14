'use client';


import { useState, useEffect } from 'react';
import { PlusCircle, MessageSquare } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

type Chat = {
  id: string;
  title: string;
  created_at: string;
};

export default function Sidebar() {
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch user's previous chats
  const fetchChats = async () => {
      setLoading(true);
      try {
        const { data: userData } = await supabase.auth.getUser();
        
        if (userData?.user) {
          const { data: chatsData, error } = await supabase
            .from('chats')
            .select('id, title, created_at')
            .eq('user_id', userData.user.id)
            .order('created_at', { ascending: false });
          
          if (error) throw error;
          setChats(chatsData || []);
        } else {
          setChats([]);
        }
      } catch (error) {
        console.error('Error fetching chats:', error);
      } finally {
        setLoading(false);
      }
  };

  // Fetch chats on initial load
  useEffect(() => {
    fetchChats();
    
    // Set up listener for chat updates
    const handleChatUpdated = () => {
      console.log('Chat updated event received, refreshing chat list');
      fetchChats();
    };
    
    window.addEventListener('chatUpdated', handleChatUpdated);
    
    return () => {
      window.removeEventListener('chatUpdated', handleChatUpdated);
    };
  }, []);

  const startNewChat = () => {
    // We'll use a custom event to notify the ChatPage component to save the current chat
    // before starting a new one
    console.log('Triggering startNewChat event');
    const event = new CustomEvent('startNewChat');
    window.dispatchEvent(event);
    
    // Refresh the chat list after a short delay to show the newly saved chat
    setTimeout(() => {
      console.log('Refreshing chat list after new chat');
      fetchChats();
    }, 1000);
  };

  const openChat = (chatId: string) => {
    router.push(`/chat?id=${chatId}`);
  };

  return (
    <div className="w-64 h-[calc(100vh-4rem)] bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* New Chat button */}
      <div className="p-4 border-b border-sidebar-border">
        <button 
          onClick={startNewChat}
          className="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground hover:bg-[var(--purple)] p-2 rounded-md transition-colors"
        >
          <PlusCircle className="h-5 w-5" />
          <span>New Chat</span>
        </button>
      </div>
      
      {/* Previous Chats */}
      <div className="flex-1 overflow-y-auto p-2">
        <h3 className="text-xs uppercase text-sidebar-foreground/50 font-semibold px-2 py-1">Previous Chats</h3>
        
        {loading ? (
          <div className="flex justify-center p-4">
            <div className="animate-pulse text-sidebar-foreground/30">Loading...</div>
          </div>
        ) : chats.length === 0 ? (
          <div className="text-center p-4 text-sidebar-foreground/30 text-sm">
            No previous chats
          </div>
        ) : (
          <div className="space-y-1 mt-1">
            {chats.map(chat => (
              <button
                key={chat.id}
                onClick={() => openChat(chat.id)}
                className="flex items-center gap-2 text-sidebar-foreground hover:bg-sidebar-hover p-2 rounded-md transition-colors w-full text-left text-sm truncate"
              >
                <MessageSquare className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{chat.title}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
