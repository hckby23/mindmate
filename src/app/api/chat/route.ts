import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();
    
    // Format messages for OpenRouter
    const formattedMessages = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role === 'ai' ? 'assistant' : 'user',
      content: msg.content
    }));

    // Add system message
    formattedMessages.unshift({
      role: 'system',
      content: 'You are MindMate, a humane and caring wellness guide for students. Be genuine and conversational.\n\nKEEP RESPONSES RELATIVELY SHORT (2-3 sentences for general questions, 1-2 sentences for mental health support).\n\nFor mental health or emotional support questions:\n1. Briefly acknowledge their feelings\n2. Ask "why" they might feel this way OR what triggered it\n3. Offer ONE practical suggestion\n\nFor general questions:\n1. Provide a helpful, accurate response\n2. When relevant, connect your answer back to mental well-being\n\nBe warm but not overly formal. Write like a supportive friend would text - brief, caring, and real.\n\nNever give medical diagnoses.'
    });
    
    console.log('Sending to OpenRouter:', JSON.stringify(formattedMessages));
    
    // Get API key from environment variables
    const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY;
    
    console.log('API Key available:', !!apiKey);
    
    if (!apiKey) {
      console.error('OpenRouter API key is missing');
      return NextResponse.json(
        { error: 'API key configuration error' },
        { status: 500 }
      );
    }
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://mindmate.app', // Your app's URL
        'X-Title': 'MindMate' // Your app's name
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-small:free', // Using Mistral Small model - better for conversational applications
        messages: formattedMessages,
        temperature: 0.7, // Balanced between creativity and consistency
        max_tokens: 1024, // Reasonable response length
        top_p: 0.9, // Slightly more focused responses
        presence_penalty: 0.6 // Encourage some topic variation
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);
      return NextResponse.json(
        { error: 'Error from OpenRouter API', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('OpenRouter response:', JSON.stringify(data));
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in chat API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
