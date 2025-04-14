'use client';

import { useState, useEffect, FormEvent, useRef, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import ChatMessage from '@/components/ChatMessage';
import { Ghost, Send, Menu } from 'lucide-react';
import { supabase, Message } from '@/lib/supabase';
import { sendMessageToOpenRouter, ChatMessage as OpenRouterMessage } from '@/lib/openrouter';
import { useSidebar } from '@/lib/sidebar-context';
import { generateUUID } from '@/lib/utils';



// Wrapper component to handle Suspense boundary
export default function ChatPageWrapper() {
  return (
    <Suspense fallback={<ChatPageLoading />}>
      <ChatPage />
    </Suspense>
  );
}

// Loading state component
function ChatPageLoading() {
  return (
    <div className="min-h-screen flex flex-col dark">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-pulse text-primary text-xl">Loading chat...</div>
      </div>
    </div>
  );
}

// Main chat page component
function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toggleSidebar } = useSidebar();
  
  // Load an existing chat from Supabase
  const loadExistingChat = useCallback(async (chatId: string) => {
    setIsLoading(true);
    setChatId(chatId);
    
    try {
      // Fetch messages for this chat
      const { data: messagesData, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at');
      
      if (error) throw error;
      
      if (messagesData && messagesData.length > 0) {
        setMessages(messagesData);
      }
    } catch (error) {
      console.error('Error loading chat:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save the current chat to Supabase
  const saveCurrentChat = useCallback(async () => {
    if (!chatId || messages.length === 0 || isAnonymous) return;

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;

      // Check if chat already exists
      const { data: chatData } = await supabase
        .from('chats')
        .select('id')
        .eq('id', chatId)
        .single();

      if (!chatData) {
        await supabase.from('chats').insert({
          id: chatId,
          user_id: userData.user.id,
          title: messages.length > 0 ? messages[0].content.substring(0, 50) + (messages[0].content.length > 50 ? '...' : '') : 'New Chat',
          is_anonymous: isAnonymous,
          created_at: new Date().toISOString(),
        });
      }

      // Save any unsaved messages
      for (const message of messages) {
        const { data: existingMessage } = await supabase
          .from('messages')
          .select('id')
          .eq('id', message.id)
          .single();

        if (!existingMessage) {
          await supabase.from('messages').insert(message);
        }
      }

      // Notify that a chat has been updated
      window.dispatchEvent(new CustomEvent('chatUpdated'));
    } catch (error) {
      console.error('Error saving chat:', error);
    }
  }, [chatId, messages, isAnonymous]);

  // Handle initial message from URL
  const handleInitialMessage = useCallback(async (initialMessage: string) => {
    // Create a new chat
    const newChatId = generateUUID();
    setChatId(newChatId);

    // Add user message
    const userMessage: Message = {
      id: generateUUID(),
      chat_id: newChatId,
      role: 'user',
      content: initialMessage,
      created_at: new Date().toISOString(),
    };

    setMessages([userMessage]);

    // Get AI response
    setIsLoading(true);
    try {
      // Format message for OpenRouter API
      const openRouterMessages: OpenRouterMessage[] = [
        { role: 'user', content: initialMessage }
      ];

      const aiResponse = await sendMessageToOpenRouter(openRouterMessages);

      const aiMessage: Message = {
        id: generateUUID(),
        chat_id: newChatId,
        role: 'ai',
        content: aiResponse,
        created_at: new Date().toISOString(),
      };

      setMessages(prev => [...prev, aiMessage]);

      // Save to Supabase if user is logged in and not anonymous
      if (!isAnonymous) {
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user) {
          // Save chat
          try {
            // Check if chat already exists
            const { data: chatData } = await supabase
              .from('chats')
              .select('id')
              .eq('id', newChatId)
              .single();

            if (!chatData) {
              await supabase.from('chats').insert({
                id: newChatId,
                user_id: userData.user.id,
                title: initialMessage.substring(0, 50) + (initialMessage.length > 50 ? '...' : ''),
                is_anonymous: isAnonymous,
                created_at: new Date().toISOString(),
              });
            }

            // Save messages
            const { error } = await supabase.from('messages').insert([userMessage, aiMessage]);
            if (error) throw error;

            // Notify that a chat has been updated
            window.dispatchEvent(new CustomEvent('chatUpdated'));
          } catch (error) {
            console.error('Error saving initial chat:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isAnonymous]);

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim() || isLoading) return;

    // Create a new chat if none exists
    if (!chatId) {
      setChatId(generateUUID());
    }

    const userContent = inputValue.trim();

    // Add user message
    const userMessage: Message = {
      id: generateUUID(),
      chat_id: chatId || '',
      role: 'user',
      content: userContent,
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Get AI response
    setIsLoading(true);

    try {
      // Format messages for OpenRouter API
      const openRouterMessages: OpenRouterMessage[] = [
        ...messages.map(msg => ({
          role: msg.role === 'ai' ? 'assistant' as const : 'user' as const,
          content: msg.content
        })),
        { role: 'user', content: userContent }
      ];

      const aiResponse = await sendMessageToOpenRouter(openRouterMessages);

      const aiMessage: Message = {
        id: generateUUID(),
        chat_id: chatId || '',
        role: 'ai',
        content: aiResponse,
        created_at: new Date().toISOString(),
      };

      setMessages(prev => [...prev, aiMessage]);

      // Save to Supabase if user is logged in and not anonymous
      if (!isAnonymous) {
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user) {
          try {
            // Check if chat already exists
            const { data: chatData } = await supabase
              .from('chats')
              .select('id')
              .eq('id', chatId)
              .single();

            if (!chatData) {
              await supabase.from('chats').insert({
                id: chatId,
                user_id: userData.user.id,
                title: messages.length > 0 ? messages[0].content.substring(0, 50) + (messages[0].content.length > 50 ? '...' : '') : 'New Chat',
                is_anonymous: isAnonymous,
                created_at: new Date().toISOString(),
              });
            }

            // Save messages
            const { error } = await supabase.from('messages').insert([userMessage, aiMessage]);
            if (error) throw error;

            // Notify that a chat has been updated
            window.dispatchEvent(new CustomEvent('chatUpdated'));
            console.log('Messages saved and chat updated event triggered');
          } catch (error) {
            console.error('Error saving messages:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle anonymous mode
  const toggleAnonymous = () => {
    setIsAnonymous(prev => !prev);
  };

  // Handle URL parameters on load
  useEffect(() => {
    const initialMessage = searchParams.get('message');
    const chatIdParam = searchParams.get('id');
    const isNew = searchParams.get('new');
    
    // Use a flag in sessionStorage to prevent duplicate processing of the same message
    const processedMessage = sessionStorage.getItem('processedMessage');
    
    if (initialMessage && processedMessage !== initialMessage) {
      // Store the message we're processing to prevent duplicates
      sessionStorage.setItem('processedMessage', initialMessage);
      handleInitialMessage(initialMessage);
    } else if (chatIdParam) {
      loadExistingChat(chatIdParam);
    } else if (isNew) {
      // Clear current chat for a new one
      setMessages([]);
      setChatId(null);
    }
  }, [searchParams, handleInitialMessage, loadExistingChat]);
  
  // Listen for the startNewChat event from the sidebar
  useEffect(() => {
    const handleStartNewChat = async () => {
      // Save the current chat if it exists and has messages
      if (chatId && messages.length > 0) {
        console.log('New chat requested, saving current chat first');
        await saveCurrentChat();
      }
      
      // Clear the current chat and navigate to a new one
      setMessages([]);
      setChatId(null);
      router.push('/chat?new=true');
    };
    
    window.addEventListener('startNewChat', handleStartNewChat);
    
    return () => {
      window.removeEventListener('startNewChat', handleStartNewChat);
    };
  }, [chatId, messages, router, saveCurrentChat]);
  
  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Save messages when they change
  useEffect(() => {
    if (messages.length > 0 && chatId) {
      saveCurrentChat();
    }
  }, [messages, chatId, saveCurrentChat]);
  
  return (
    <div className={`min-h-screen flex flex-col dark ${isAnonymous ? 'anonymous-theme' : ''}`}>
      <Navbar />
      
      <div className="flex-1 flex relative overflow-hidden">
        {/* Sidebar */}
        <div className="md:relative absolute z-30">
          <Sidebar />
        </div>
        
        {/* Chat Area */}
        <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] w-full z-20">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-2 sm:p-4 border-b border-border">
            <button 
              onClick={toggleSidebar}
              className="flex items-center md:cursor-default text-lg sm:text-xl font-semibold hover:text-primary md:hover:text-foreground"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-5 w-5 mr-2 md:hidden" />
              <span>Chat</span>
            </button>
            <button 
              onClick={toggleAnonymous}
              className={`p-2 rounded-full ${isAnonymous ? 'bg-[var(--purple)]/10 text-[var(--purple)]' : 'bg-muted/30 text-foreground/70 hover:text-primary'}`}
              aria-label="Toggle anonymous mode"
            >
              <Ghost className="h-5 w-5" />
            </button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-2 sm:p-4 pb-4 mb-2">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-foreground/50">
                <p className="text-lg mb-2">Start a new conversation</p>
                <p className="text-sm">Your messages will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map(message => (
                  <ChatMessage 
                    key={message.id} 
                    message={message} 
                    isAnonymous={isAnonymous} 
                  />
                ))}
                {isLoading && (
                  <div className="flex items-center justify-center p-4">
                    <div className="animate-pulse text-primary">Thinking...</div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          
          {/* Input Area */}
          <div className="p-2 sm:p-4 border-t border-border sticky bottom-0 bg-background">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 sm:p-3 rounded-lg bg-muted/30 border border-border focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                disabled={isLoading}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck="false"
                inputMode="text"
                style={{ fontSize: '16px' }} /* Prevents iOS zoom */
              />
              <button 
                type="submit" 
                className={`p-2 sm:p-3 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center ${isLoading || !inputValue.trim() ? 'bg-muted/50 text-foreground/30' : 'bg-primary text-primary-foreground hover:bg-[var(--purple)]'}`}
                disabled={isLoading || !inputValue.trim()}
                aria-label="Send message"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
