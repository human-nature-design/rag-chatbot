'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useEffect, useRef } from 'react';

export default function Chat() {
  const [input, setInput] = useState('');
  const [threadInput, setThreadInput] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<'aero' | 'slack' | 'teams'>('teams');
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [threadReplies, setThreadReplies] = useState<Record<string, Array<{id: string, text: string, author: string, timestamp: Date}>>>({});
  const [showToolCalls, setShowToolCalls] = useState<boolean>(false);
  const { messages, sendMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle thread messages completely separately - don't add to main chat
  const sendThreadMessage = async (text: string) => {
    console.log('Sending thread message:', text);
    console.log('Active thread:', selectedThread);
    
    if (!selectedThread) {
      console.error('No active thread selected');
      return;
    }
    
    // Add user's reply to thread immediately
    const userReply = {
      id: `user-${Date.now()}`,
      text: text,
      author: 'Corey',
      timestamp: new Date()
    };
    
    console.log('Adding user reply to thread:', userReply);
    setThreadReplies(prev => ({
      ...prev,
      [selectedThread]: [...(prev[selectedThread] || []), userReply]
    }));
    
    // Simulate bot response for thread (in a real app, this would call a separate API)
    // For now, we'll create a mock response after a delay
    setTimeout(() => {
      const botReply = {
        id: `bot-${Date.now()}`,
        text: `I understand you're asking about "${text}". Let me help you with that. [This is a simulated response - integrate with your actual bot API for real responses]`,
        author: 'rfx',
        timestamp: new Date()
      };
      
      console.log('Adding bot reply to thread:', botReply);
      setThreadReplies(prev => ({
        ...prev,
        [selectedThread]: [...(prev[selectedThread] || []), botReply]
      }));
    }, 1000); // Simulate API delay
  };
  

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
    <div className="flex flex-col h-screen">
      {/* Theme Toggle Bar */}
      <div className="w-full h-[100px] bg-gray-900 flex items-center justify-center">
        <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setSelectedTheme('aero')}
            className={`px-6 py-2 rounded-md transition-all duration-200 font-medium ${
              selectedTheme === 'aero'
                ? 'bg-blue-500 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            Aero app
          </button>
          <button
            onClick={() => setSelectedTheme('slack')}
            className={`px-6 py-2 rounded-md transition-all duration-200 font-medium ${
              selectedTheme === 'slack'
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            Slack
          </button>
          <button
            onClick={() => setSelectedTheme('teams')}
            className={`px-6 py-2 rounded-md transition-all duration-200 font-medium ${
              selectedTheme === 'teams'
                ? 'bg-[#464775] text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            Teams
          </button>
        </div>
      </div>

      {/* Main App Content */}
      {selectedTheme === 'teams' && (
        <div className="flex flex-1 bg-[#f5f5f5] overflow-hidden">
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
            {/* Tool Calls Toggle */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {showToolCalls ? 'Tool Calls' : 'Just Chat UI'}
              </span>
              <button
                onClick={() => setShowToolCalls(!showToolCalls)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  showToolCalls ? 'bg-purple-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    showToolCalls ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
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
                          return showToolCalls ? (
                            <div key={partIndex} className="mt-2 p-3 bg-gray-100 rounded-lg">
                              <p className="text-sm text-gray-600">
                                {part.state === 'output-available' ? '✓ Used' : '⏳ Using'} tool: {part.type}
                              </p>
                              <pre className="mt-2 text-xs bg-white p-2 rounded overflow-x-auto">
                                {JSON.stringify(part.input, null, 2)}
                              </pre>
                            </div>
                          ) : null;
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
      )}

      {/* Aero App UI Placeholder */}
      {selectedTheme === 'aero' && (
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="text-center">
            <div className="text-6xl mb-4">🚀</div>
            <h2 className="text-2xl font-bold text-blue-900 mb-2">Aero App UI</h2>
            <p className="text-blue-700">Coming soon - Modern aero-themed chat interface</p>
          </div>
        </div>
      )}

      {/* Slack UI */}
      {selectedTheme === 'slack' && (
        <div className="flex flex-1 bg-white overflow-hidden">
          {/* Top Navigation Bar */}
          <div className="fixed top-[100px] left-0 right-0 h-[38px] bg-[#350d36] flex items-center px-4 z-50">
            <div className="flex items-center flex-1">
              {/* Navigation arrows */}
              <button className="text-white/60 hover:text-white p-1 mr-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="text-white/60 hover:text-white p-1 mr-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              {/* Clock icon */}
              <button className="text-white/60 hover:text-white p-1 mr-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              
              {/* Search bar */}
              <div className="flex-1 max-w-[730px] mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search Workspace"
                    className="w-full bg-[#644165] text-white placeholder-white/75 px-3 py-1 rounded text-sm focus:outline-none focus:bg-white focus:text-gray-900 focus:placeholder-gray-500"
                  />
                  <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              {/* Right side icons */}
              <button className="text-white/60 hover:text-white p-1 ml-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Main content area with sidebar */}
          <div className="flex flex-1 mt-[38px]">
            {/* Slack Sidebar */}
            <div className="w-[260px] bg-[#3f0e40] text-white flex flex-col">
              {/* Workspace Header */}
              <div className="p-3 hover:bg-[#350d36]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-9 h-9 bg-white rounded flex items-center justify-center">
                      <span className="text-[#3f0e40] font-bold text-xl">C</span>
                    </div>
                    <div>
                      <div className="font-bold text-[15px]">CIL LLP</div>
                    </div>
                  </div>
                  <button className="hover:bg-[#532753] p-1.5 rounded">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Navigation Items */}
              <div className="flex-1 overflow-y-auto">
                {/* Top nav items */}
                <div className="px-2 py-2">
                  <button className="w-full flex items-center px-3 py-1 text-[15px] text-white/90 hover:bg-[#350d36] rounded">
                    <span className="mr-3">🔍</span>
                    <span>Unread</span>
                  </button>
                  <button className="w-full flex items-center px-3 py-1 text-[15px] text-white/90 hover:bg-[#350d36] rounded">
                    <span className="mr-3">💬</span>
                    <span>Threads</span>
                  </button>
                  <button className="w-full flex items-center px-3 py-1 text-[15px] text-white/90 hover:bg-[#350d36] rounded">
                    <span className="mr-3">📝</span>
                    <span>Drafts & sent</span>
                  </button>
                </div>

                {/* Home section */}
                <div className="px-2 mt-3">
                  <button className="w-full flex items-center px-3 py-1 text-[15px] bg-[#1164A3] text-white rounded">
                    <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    <span>Home</span>
                  </button>
                </div>

                <div className="px-2 mt-1">
                  <button className="w-full flex items-center px-3 py-1 text-[15px] text-white/90 hover:bg-[#350d36] rounded">
                    <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                      <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                    </svg>
                    <span>DMs</span>
                  </button>
                  <button className="w-full flex items-center px-3 py-1 text-[15px] text-white/90 hover:bg-[#350d36] rounded">
                    <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    <span>Activity</span>
                  </button>
                  <button className="w-full flex items-center px-3 py-1 text-[15px] text-white/90 hover:bg-[#350d36] rounded">
                    <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                    </svg>
                    <span>Later</span>
                  </button>
                  <button className="w-full flex items-center px-3 py-1 text-[15px] text-white/90 hover:bg-[#350d36] rounded">
                    <span className="mr-3">⋯</span>
                    <span>Options</span>
                  </button>
                </div>

                {/* Channels */}
                <div className="mt-5 px-2">
                  <div className="flex items-center justify-between px-3 py-1">
                    <button className="flex items-center space-x-1 text-[13px] text-white/70 hover:text-white/90">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      <span>Channels</span>
                    </button>
                    <button className="text-white/70 hover:text-white/90">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                  <div className="mt-1 space-y-px">
                    <button className="w-full text-left px-3 py-1 hover:bg-[#350d36] rounded text-[15px] text-white/70">
                      <span className="opacity-70">#</span> Ping_room
                    </button>
                    <button className="w-full text-left px-3 py-1 hover:bg-[#350d36] rounded text-[15px] text-white">
                      <span className="opacity-70">#</span> channel-support
                    </button>
                    <button className="w-full text-left px-3 py-1 hover:bg-[#350d36] rounded text-[15px] text-white/70">
                      <span className="opacity-70">#</span> marketing
                    </button>
                    <button className="w-full text-left px-3 py-1 hover:bg-[#350d36] rounded text-[15px] text-white/70">
                      <span className="opacity-70">#</span> insights
                    </button>
                    <button className="w-full text-left px-3 py-1 hover:bg-[#350d36] rounded text-[15px] text-white/70">
                      <span className="opacity-70">#</span> product
                    </button>
                    <button className="w-full text-left px-3 py-1 hover:bg-[#350d36] rounded text-[15px] text-white/70">
                      <span className="opacity-70">#</span> design
                    </button>
                    <button className="w-full text-left px-3 py-1 hover:bg-[#350d36] rounded text-[15px] text-white/70">
                      <span className="opacity-70">🔒</span> client-feedbacks
                    </button>
                    <button className="w-full text-left px-3 py-1 hover:bg-[#350d36] rounded text-[15px] text-white/70">
                      <span className="opacity-70">🔒</span> product_supports
                    </button>
                    <button className="w-full text-left px-3 py-1 hover:bg-[#350d36] rounded text-[15px] text-white/70">
                      <span className="opacity-70">🔒</span> investors
                    </button>
                    <button className="w-full text-left px-3 py-1 hover:bg-[#350d36] rounded text-[15px] text-white/70">
                      <span className="opacity-70">🔒</span> productivity
                    </button>
                    <button className="w-full text-left px-3 py-1 hover:bg-[#350d36] rounded text-[15px] text-white/70">
                      <span className="mr-2">➕</span> Add channels
                    </button>
                  </div>
                </div>

                {/* Direct Messages */}
                <div className="mt-5 px-2">
                  <div className="flex items-center justify-between px-3 py-1">
                    <button className="flex items-center space-x-1 text-[13px] text-white/70 hover:text-white/90">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      <span>Direct messages</span>
                    </button>
                    <button className="text-white/70 hover:text-white/90">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                  <div className="mt-1 space-y-px">
                    <button className="w-full flex items-center space-x-2 px-3 py-1 hover:bg-[#350d36] rounded">
                      <div className="w-5 h-5 rounded bg-gray-500"></div>
                      <span className="text-[15px] text-white/70">Adam</span>
                    </button>
                    <button className="w-full flex items-center space-x-2 px-3 py-1 hover:bg-[#350d36] rounded">
                      <div className="w-5 h-5 rounded bg-gray-500"></div>
                      <span className="text-[15px] text-white/70">Russel</span>
                    </button>
                    <button className="w-full flex items-center space-x-2 px-3 py-1 hover:bg-[#350d36] rounded">
                      <div className="w-5 h-5 rounded bg-gray-500"></div>
                      <span className="text-[15px] text-white/70">Emily</span>
                    </button>
                    <button className="w-full flex items-center space-x-2 px-3 py-1 hover:bg-[#350d36] rounded">
                      <div className="w-5 h-5 rounded bg-gray-500"></div>
                      <span className="text-[15px] text-white/70">Sharma</span>
                    </button>
                    <button className="w-full flex items-center space-x-2 px-3 py-1 hover:bg-[#350d36] rounded">
                      <div className="w-5 h-5 rounded bg-gray-500"></div>
                      <span className="text-[15px] text-white/70">Alex</span>
                    </button>
                    <button className="w-full flex items-center space-x-2 px-3 py-1 hover:bg-[#350d36] rounded">
                      <div className="w-5 h-5 rounded bg-gray-500"></div>
                      <span className="text-[15px] text-white/70">Elizabeth</span>
                    </button>
                    <button className="w-full flex items-center space-x-2 px-3 py-1 hover:bg-[#350d36] rounded">
                      <div className="w-5 h-5 rounded bg-gray-500"></div>
                      <span className="text-[15px] text-white/70">Caterine</span>
                    </button>
                    <button className="w-full text-left px-3 py-1 hover:bg-[#350d36] rounded text-[15px] text-white/70">
                      <span className="mr-2">➕</span> Add coworkers
                    </button>
                  </div>
                </div>

                {/* Apps */}
                <div className="mt-5 px-2">
                  <div className="flex items-center justify-between px-3 py-1">
                    <button className="flex items-center space-x-1 text-[13px] text-white/70 hover:text-white/90">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      <span>Apps</span>
                    </button>
                    <button className="text-white/70 hover:text-white/90">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                  <div className="mt-1 space-y-px">
                    <button className="w-full flex items-center space-x-2 px-3 py-1 hover:bg-[#350d36] rounded">
                      <div className="w-5 h-5 rounded bg-yellow-500 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">S</span>
                      </div>
                      <span className="text-[15px] text-white/70">Slackbot</span>
                    </button>
                    <button className="w-full flex items-center space-x-2 px-3 py-1 hover:bg-[#350d36] rounded">
                      <div className="w-5 h-5 rounded bg-red-600 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">✓</span>
                      </div>
                      <span className="text-[15px] text-white/70">Todoist</span>
                    </button>
                    <button className="w-full flex items-center space-x-2 px-3 py-1 hover:bg-[#350d36] rounded">
                      <div className="w-5 h-5 rounded bg-blue-500 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">A</span>
                      </div>
                      <span className="text-[15px] text-white/70">Appname1</span>
                    </button>
                    <button className="w-full text-left px-3 py-1 hover:bg-[#350d36] rounded text-[15px] text-white/70">
                      <span className="mr-2">➕</span> Add Apps
                    </button>
                  </div>
                </div>
              </div>

              {/* User Profile */}
              <div className="p-3 border-t border-[#522653]">
                <button className="w-full flex items-center space-x-3 px-2 py-2 hover:bg-[#350d36] rounded">
                  <div className="relative">
                    <div className="w-9 h-9 bg-gray-600 rounded-full"></div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#3f0e40] rounded-full"></span>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium">You</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
              {/* Channel Header */}
              <div className="h-[49px] border-b border-gray-200 bg-white flex items-center justify-between px-5">
                <div className="flex items-center">
                  <button className="flex items-center hover:bg-gray-100 px-2 py-1 rounded">
                    <span className="font-bold text-[18px] text-gray-900"># channel-support</span>
                    <svg className="w-3 h-3 ml-1 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button className="ml-2 text-gray-500 hover:text-gray-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </button>
                </div>
                
                <div className="flex items-center">
                  <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 px-2 py-1">
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 bg-gray-400 rounded-full border-2 border-white"></div>
                      <div className="w-6 h-6 bg-gray-500 rounded-full border-2 border-white"></div>
                      <div className="w-6 h-6 bg-gray-600 rounded-full border-2 border-white"></div>
                    </div>
                    <span className="text-sm font-medium ml-2">40</span>
                  </button>
                  
                  <button className="p-1.5 hover:bg-gray-100 rounded ml-2">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  
                  <button className="p-1.5 hover:bg-gray-100 rounded">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                  
                  <div className="w-px h-5 bg-gray-300 mx-2"></div>
                  
                  <button className="p-1.5 hover:bg-gray-100 rounded">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
                    </svg>
                  </button>
                </div>
              </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <p className="text-lg font-medium">This is the beginning of #channel-support</p>
                  <p className="text-sm mt-1">Send a message to start the conversation</p>
                </div>
              )}
              
              {messages.map((m, index) => {
                const isBot = m.role === 'assistant';
                const isUserMessage = !isBot;
                const hasMentionedBot = isUserMessage && m.parts.some(p => p.type === 'text' && p.text.includes('@rfx'));
                const messageId = m.id;
                
                // Find if there's a bot response to this message
                const nextMessage = messages[index + 1];
                const hasBotReply = hasMentionedBot && nextMessage && nextMessage.role === 'assistant';
                const threadReplyCount = (threadReplies[messageId] || []).length;
                const totalReplies = hasBotReply ? 1 + threadReplyCount : threadReplyCount;
                
                // Don't show bot messages inline in the channel - they only appear in threads
                if (isBot) {
                  console.log('Skipping bot message from main channel (will appear in thread):', m);
                  return null;
                }
                
                return (
                  <div key={m.id} className="group hover:bg-gray-50 px-5 py-2 -mx-5">
                    <div className="flex space-x-3">
                      <div className="w-9 h-9 bg-gray-400 rounded flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-semibold">C</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-baseline space-x-2">
                          <span className="font-bold text-[15px]">Corey</span>
                          <span className="text-xs text-gray-500">{formatMessageTime(index)}</span>
                        </div>
                        <div className="text-[15px] text-gray-900 mt-0.5">
                          {m.parts.map((part, partIndex) => {
                            if (part.type === 'text') {
                              const text = part.text.replace(/@rfx/g, '<span class="text-blue-600 bg-blue-50 px-1 rounded cursor-pointer hover:underline">@rfx</span>');
                              return <p key={partIndex} dangerouslySetInnerHTML={{ __html: text }} />;
                            }
                            return null;
                          })}
                        </div>
                        {/* Show thread indicator if there are any replies */}
                        {(hasBotReply || totalReplies > 0) && (
                          <div className="flex items-center space-x-3 mt-1">
                            <button className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 px-2 py-0.5 rounded-full">
                              <span>❤️</span>
                              <span className="text-xs text-gray-600">1</span>
                            </button>
                            <button 
                              onClick={() => setSelectedThread(messageId)}
                              className="flex items-center space-x-2 text-blue-600 hover:underline text-sm"
                            >
                              <div className="flex -space-x-2">
                                <img 
                                  src="/icons/aero_mark_128.png" 
                                  alt="rfx" 
                                  className="w-5 h-5 rounded-full border-2 border-white object-cover"
                                />
                                {threadReplyCount > 0 && (
                                  <div className="w-5 h-5 bg-gray-400 rounded-full border-2 border-white flex items-center justify-center">
                                    <span className="text-white text-[8px] font-bold">C</span>
                                  </div>
                                )}
                              </div>
                              <span>{totalReplies} {totalReplies === 1 ? 'reply' : 'replies'}</span>
                              <span className="text-gray-500">View thread</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

              {/* Input Area */}
              <div className="p-4 bg-white">
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    if (input.trim()) {
                      sendMessage({ text: input });
                      setInput('');
                    }
                  }}
                >
                  <div className="border rounded-lg border-gray-300 focus-within:border-gray-500 bg-white">
                    <input
                      className="w-full px-3 py-2 focus:outline-none text-[15px]"
                      value={input}
                      placeholder="Message #channel-support"
                      onChange={e => setInput(e.currentTarget.value)}
                    />
                    <div className="flex items-center justify-between px-2 py-1 bg-gray-50 border-t border-gray-200">
                      <div className="flex items-center">
                        <button type="button" className="p-1.5 hover:bg-gray-200 rounded">
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                        <div className="h-5 w-px bg-gray-300 mx-1"></div>
                        
                        <button type="button" className="p-1.5 hover:bg-gray-200 rounded">
                          <span className="text-gray-600 font-medium text-sm">Aa</span>
                        </button>
                        
                        <button type="button" className="p-1.5 hover:bg-gray-200 rounded">
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                        </button>
                        
                        <button type="button" className="p-1.5 hover:bg-gray-200 rounded">
                          <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                        
                        <button type="button" className="p-1.5 hover:bg-gray-200 rounded">
                          <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                        </button>
                        
                        <button type="button" className="p-1.5 hover:bg-gray-200 rounded">
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                          </svg>
                        </button>
                        
                        <div className="h-5 w-px bg-gray-300 mx-1"></div>
                        
                        <button type="button" className="p-1.5 hover:bg-gray-200 rounded">
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                        </button>
                        
                        <button type="button" className="p-1.5 hover:bg-gray-200 rounded">
                          <span className="text-gray-600">@</span>
                        </button>
                        
                        <button type="button" className="p-1.5 hover:bg-gray-200 rounded">
                          <span className="text-gray-600">😊</span>
                        </button>
                        
                        <button type="button" className="p-1.5 hover:bg-gray-200 rounded">
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                        
                        <button type="button" className="p-1.5 hover:bg-gray-200 rounded">
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                          </svg>
                        </button>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          type="submit"
                          disabled={!input.trim()}
                          className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

          {/* Thread Panel */}
          {selectedThread && (
            <div className="w-[380px] border-l flex flex-col bg-white">
              <div className="h-[49px] border-b flex items-center justify-between px-4">
                <div>
                  <div className="font-bold text-[15px]">Thread</div>
                  <div className="text-xs text-gray-500">#channel-support</div>
                </div>
                <button 
                  onClick={() => setSelectedThread(null)}
                  className="text-gray-400 hover:text-gray-700 p-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {(() => {
                  // Find the selected message and its bot reply
                  const selectedMessage = messages.find(m => m.id === selectedThread);
                  const selectedIndex = messages.findIndex(m => m.id === selectedThread);
                  const botReply = messages[selectedIndex + 1];
                  const replies = threadReplies[selectedThread || ''] || [];
                  
                  if (!selectedMessage) return null;
                  
                  return (
                    <div className="p-5 space-y-4">
                      {/* Original Message */}
                      <div className="flex space-x-3">
                        <div className="w-9 h-9 bg-gray-400 rounded flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-sm font-semibold">C</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-baseline space-x-2">
                            <span className="font-bold text-[15px]">Corey</span>
                            <span className="text-xs text-gray-500">{formatMessageTime(selectedIndex)}</span>
                          </div>
                          <div className="text-[15px] text-gray-900 mt-0.5">
                            {selectedMessage.parts.map((part, partIndex) => {
                              if (part.type === 'text') {
                                const text = part.text.replace(/@rfx/g, '<span class="text-blue-600 bg-blue-50 px-1 rounded">@rfx</span>');
                                return <div key={partIndex} dangerouslySetInnerHTML={{ __html: text }} />;
                              }
                              return null;
                            })}
                          </div>
                        </div>
                      </div>
                      
                      {/* Bot Reply in Thread */}
                      {botReply && botReply.role === 'assistant' && (
                        <div className="flex space-x-3">
                          <img 
                            src="/icons/aero_mark_128.png" 
                            alt="rfx" 
                            className="w-9 h-9 rounded object-cover flex-shrink-0"
                          />
                          <div className="flex-1">
                            <div className="flex items-baseline space-x-2">
                              <span className="font-bold text-[15px]">rfx</span>
                              <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">APP</span>
                              <span className="text-xs text-gray-500">{formatMessageTime(selectedIndex + 1)}</span>
                            </div>
                            <div className="text-[15px] text-gray-900 mt-0.5">
                              {botReply.parts.map((part, partIndex) => {
                                if (part.type === 'text') {
                                  return <p key={partIndex}>{part.text}</p>;
                                }
                                return null;
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Thread Replies */}
                      {replies.map((reply) => (
                        <div key={reply.id} className="flex space-x-3">
                          {reply.author === 'rfx' ? (
                            <img 
                              src="/icons/aero_mark_128.png" 
                              alt="rfx" 
                              className="w-9 h-9 rounded object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-9 h-9 bg-gray-400 rounded flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-sm font-semibold">
                                {reply.author === 'Corey' ? 'C' : reply.author[0].toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-baseline space-x-2">
                              <span className="font-bold text-[15px]">{reply.author}</span>
                              {reply.author === 'rfx' && (
                                <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">APP</span>
                              )}
                              <span className="text-xs text-gray-500">{formatTime(reply.timestamp)}</span>
                            </div>
                            <div className="text-[15px] text-gray-900 mt-0.5">
                              {reply.text}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
              
              {/* Thread Reply Input */}
              <div className="border-t p-3">
                <form
                  onSubmit={async e => {
                    e.preventDefault();
                    if (threadInput.trim() && selectedThread) {
                      const messageText = threadInput;
                      setThreadInput('');
                      await sendThreadMessage(messageText);
                    }
                  }}
                >
                  <div className="border rounded-lg border-gray-300 focus-within:border-gray-400 bg-white">
                    <textarea
                      className="w-full px-3 py-2 focus:outline-none resize-none text-[15px]"
                      value={threadInput}
                      placeholder="Reply..."
                      onChange={e => setThreadInput(e.target.value)}
                      onKeyDown={async e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          if (threadInput.trim() && selectedThread) {
                            const messageText = threadInput;
                            setThreadInput('');
                            await sendThreadMessage(messageText);
                          }
                        }
                      }}
                      rows={3}
                    />
                    <div className="flex items-center justify-between px-3 py-2 border-t border-gray-200">
                      <div className="flex items-center space-x-2">
                        <button type="button" className="text-gray-400 hover:text-gray-600">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                        </button>
                        <button type="button" className="text-gray-400 hover:text-gray-600">
                          <span className="text-lg">@</span>
                        </button>
                        <button type="button" className="text-gray-400 hover:text-gray-600">
                          <span className="text-lg">😊</span>
                        </button>
                        <button type="button" className="text-gray-400 hover:text-gray-600">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2z" />
                          </svg>
                        </button>
                      </div>
                      <button
                        type="submit"
                        className={`p-1.5 rounded transition-colors ${
                          threadInput.trim() 
                            ? 'bg-green-600 hover:bg-green-700 text-white' 
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                        disabled={!threadInput.trim()}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
          </div>
        </div>
      )}
    </div>
  );
}