'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useEffect, useRef } from 'react';

export default function Chat() {
  const [input, setInput] = useState('');
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
    <div className="flex h-screen bg-[#f5f5f5] overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-[#464775] text-white flex flex-col">
        {/* Teams Header */}
        <div className="p-4 border-b border-[#5b5b8a]">
          <div className="flex items-center space-x-3">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
              <rect x="3" y="3" width="7" height="7" rx="1"/>
              <rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/>
              <rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
            <span className="text-lg font-semibold">Microsoft Teams</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            <div className="mb-4">
              <button className="w-full flex items-center space-x-3 p-2 hover:bg-[#5b5b8a] rounded">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>Chat</span>
              </button>
            </div>

            <div className="mb-2">
              <div className="text-xs uppercase text-gray-300 px-2 py-1">Teams</div>
              <div className="bg-[#5b5b8a] rounded p-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">no-dumb-questions</span>
                  <span className="text-xs bg-red-500 px-1.5 py-0.5 rounded">2</span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-xs uppercase text-gray-300 px-2 py-1">Recent</div>
              <div className="space-y-1">
                <button className="w-full text-left p-2 hover:bg-[#5b5b8a] rounded text-sm">
                  General
                </button>
                <button className="w-full text-left p-2 hover:bg-[#5b5b8a] rounded text-sm">
                  Random
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-[#5b5b8a]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold">U</span>
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">User</div>
              <div className="text-xs text-green-400 flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                Available
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Channel Header */}
        <div className="bg-white border-b px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-xl font-semibold text-gray-800"># no-dumb-questions</span>
            <button className="text-gray-500 hover:text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
            <button className="text-gray-500 hover:text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button className="text-gray-500 hover:text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <p className="text-lg font-medium">Start a conversation with AshleyBot</p>
              <p className="text-sm mt-1">Ask any question - no question is too simple!</p>
            </div>
          )}
          
          {messages.map((m, index) => {
            const isBot = m.role === 'assistant';
            const name = isBot ? 'AshleyBot' : 'You';
            const avatarBg = isBot ? 'bg-purple-500' : 'bg-blue-500';
            const avatarText = isBot ? 'AB' : 'U';
            
            return (
              <div key={m.id} className="flex space-x-3">
                <div className={`w-10 h-10 ${avatarBg} rounded-full flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white text-sm font-semibold">{avatarText}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline space-x-2">
                    <span className="font-semibold text-gray-900">{name}</span>
                    <span className="text-xs text-gray-500">{formatMessageTime(index)}</span>
                    {isBot && (
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">BOT</span>
                    )}
                  </div>
                  <div className="mt-1 text-gray-800">
                    {m.parts.map((part, partIndex) => {
                      switch (part.type) {
                        case 'text':
                          return <p key={partIndex} className="whitespace-pre-wrap">{part.text}</p>;
                        case 'tool-addResource':
                        case 'tool-getInformation':
                          return (
                            <div key={partIndex} className="mt-2 p-3 bg-gray-100 rounded-lg">
                              <p className="text-sm text-gray-600">
                                {part.state === 'output-available' ? '✓ Used' : '⏳ Using'} tool: {part.type}
                              </p>
                              <pre className="mt-2 text-xs bg-white p-2 rounded overflow-x-auto">
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
          className="bg-white border-t p-4"
        >
          <div className="flex items-end space-x-2">
            <div className="flex-1">
              <div className="bg-white border border-gray-300 rounded-lg focus-within:border-purple-500 transition-colors">
                <div className="flex items-center px-3 py-2 border-b border-gray-200">
                  <button type="button" className="p-1 hover:bg-gray-100 rounded" title="Bold">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5H7v14h6c2.21 0 4-1.79 4-4s-1.79-4-4-4H7m0 0h5c1.66 0 3-1.34 3-3S13.66 5 12 5H7" />
                    </svg>
                  </button>
                  <button type="button" className="p-1 hover:bg-gray-100 rounded ml-1" title="Italic">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19h4M14 5h-4m5 0h-1.5M14 5v14m0 0h-1.5" />
                    </svg>
                  </button>
                  <button type="button" className="p-1 hover:bg-gray-100 rounded ml-1" title="Underline">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v11a4 4 0 008 0V4M7 20h10" />
                    </svg>
                  </button>
                  <div className="h-4 w-px bg-gray-300 mx-2"></div>
                  <button type="button" className="p-1 hover:bg-gray-100 rounded" title="Link">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </button>
                  <button type="button" className="p-1 hover:bg-gray-100 rounded ml-1" title="Code">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </button>
                  <div className="h-4 w-px bg-gray-300 mx-2"></div>
                  <button type="button" className="p-1 hover:bg-gray-100 rounded" title="Emoji">
                    <span className="text-lg">😊</span>
                  </button>
                  <button type="button" className="p-1 hover:bg-gray-100 rounded ml-1" title="GIF">
                    <span className="text-xs font-bold text-gray-600">GIF</span>
                  </button>
                </div>
                <input
                  className="w-full px-3 py-2 focus:outline-none"
                  value={input}
                  placeholder="Type a new message"
                  onChange={e => setInput(e.currentTarget.value)}
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white p-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!input.trim()}
              aria-label="Send message"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <div className="flex items-center space-x-3">
              <button type="button" className="hover:text-gray-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>
              <button type="button" className="hover:text-gray-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
            <span>AshleyBot is typing...</span>
          </div>
        </form>
      </div>
    </div>
  );
}