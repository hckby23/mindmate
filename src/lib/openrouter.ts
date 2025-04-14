/**
 * OpenRouter API client for MindMate
 * This handles sending messages to the OpenRouter API and receiving responses
 * Uses a server-side API route to avoid CORS issues and protect API key
 */

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

// Fallback responses in case the API fails
const fallbackResponses = {
  general: "I'm MindMate, your mental wellness companion. How can I support you today?",
  error: "I apologize, but I'm having trouble connecting to my knowledge base right now. Please try again in a moment."
};

export async function sendMessageToOpenRouter(messages: ChatMessage[]): Promise<string> {
  try {
    console.log('Sending messages to API route:', messages);
    
    // Use our server-side API route instead of calling OpenRouter directly
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API route error:', response.status, errorData);
      return fallbackResponses.error;
    }

    const data = await response.json();
    console.log('API response:', JSON.stringify(data));
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Unexpected response format:', data);
      return fallbackResponses.error;
    }
    
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error sending message to OpenRouter:', error);
    return 'Sorry, I encountered an error processing your message. Please try again.';
  }
}
