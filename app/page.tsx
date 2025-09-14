'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useEffect, useRef } from 'react';

//The useChat hook enables the streaming of chat messages from your AI provider (you will be using OpenAI), manages the state for chat input, and updates the UI automatically as new messages are received. https://ai-sdk.dev/docs/reference/ai-sdk-ui/use-chat
export default function Chat() {
  const [input, setInput] = useState('');
  //By default, useChat will send a POST request to the /api/chat endpoint with the messages as the request body. You can see that both in the SDK docs as well as in the file hover over SendMessage, go to Definition, see in line 4283 that call out. 
  const { messages, sendMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatMessageTime = (index: number) => {
    const messageDate = new Date();
    messageDate.setMinutes(messageDate.getMinutes() - (messages.length - index) * 2);
    return formatTime(messageDate);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <p className="text-lg font-medium">Start a conversation</p>
              <p className="text-sm mt-1">Ask any question</p>
            </div>
          )}
          
          {messages.map((m, index) => {
            const isBot = m.role === 'assistant';
            const name = isBot ? 'Assistant' : 'You';
            const avatarBg = isBot ? 'bg-purple-500' : 'bg-blue-500';
            const avatarText = isBot ? 'A' : 'U';
            
            return (
              <div key={m.id} className="flex space-x-3">
                <div className={`w-10 h-10 ${avatarBg} rounded-full flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white text-sm font-semibold">{avatarText}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline space-x-2">
                    <span className="font-semibold text-gray-100">{name}</span>
                    <span className="text-xs text-gray-400">{formatMessageTime(index)}</span>
                  </div>

                  {/* Shows what tool is called */}
                  
                  <div className="mt-1 text-gray-200">
                    {m.parts.map((part, partIndex) => {
                      switch (part.type) {
                        case 'text':
                          return <p key={partIndex} className="whitespace-pre-wrap">{part.text}</p>;
                        case 'tool-addResource':
                        case 'tool-getInformation':
                          return (
                            <div key={partIndex} className="mt-2 p-3 bg-gray-800 rounded-lg">
                              <p className="text-sm text-gray-400">
                                {part.state === 'output-available' ? '✓ Used' : '⏳ Using'} tool: {part.type}
                              </p>
                              <pre className="mt-2 text-xs bg-gray-700 p-2 rounded overflow-x-auto text-gray-300">
                                {JSON.stringify(part.input, null, 2)}
                              </pre>
                            </div>
                          );
                      }
                    })}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form
          onSubmit={e => {
            e.preventDefault();
            if (input.trim()) {
              sendMessage({ text: input });
              setInput('');
            }
          }}
        className="bg-gray-800 border-t border-gray-700 p-4"
      >
        <div className="flex items-center space-x-2">
          <input
            className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-blue-500"
            value={input}
            placeholder="Type a message..."
            onChange={e => setInput(e.currentTarget.value)}
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!input.trim()}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}