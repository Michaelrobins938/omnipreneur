'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send,
  Bot,
  User,
  Loader2,
  Sparkles,
  Brain,
  Mic,
  MicOff,
  Image,
  Paperclip,
  MoreVertical,
  Copy,
  Trash2,
  RefreshCw,
  Download,
  ThumbsUp,
  ThumbsDown,
  Volume2,
  VolumeX,
  Zap,
  Settings,
  X,
  Plus,
  MessageCircle,
  Search,
  Filter,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    model?: string;
    tokens?: number;
    processingTime?: number;
    attachments?: Array<{
      type: 'image' | 'file';
      url: string;
      name: string;
    }>;
  };
  status?: 'sending' | 'sent' | 'error';
  rating?: 'up' | 'down';
}

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  model: string;
  systemPrompt?: string;
}

interface AIChatProps {
  sessionId?: string;
  initialMessages?: ChatMessage[];
  onMessageSent?: (message: ChatMessage) => void;
  onSessionUpdate?: (session: ChatSession) => void;
  placeholder?: string;
  maxTokens?: number;
  temperature?: number;
  model?: string;
  systemPrompt?: string;
  enableVoice?: boolean;
  enableAttachments?: boolean;
  enableCodeExecution?: boolean;
  className?: string;
}

export function AIChat({
  sessionId,
  initialMessages = [],
  onMessageSent,
  onSessionUpdate,
  placeholder = "Ask me anything...",
  maxTokens = 2000,
  temperature = 0.7,
  model = 'gpt-4o-mini',
  systemPrompt,
  enableVoice = false,
  enableAttachments = false,
  enableCodeExecution = false,
  className = ''
}: AIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedModel, setSelectedModel] = useState(model);
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
      status: 'sending'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Update message status to sent
      setMessages(prev => prev.map(msg => 
        msg.id === userMessage.id ? { ...msg, status: 'sent' } : msg
      ));

      // Send to AI
      const response = await fetch('/api/chat/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          model: selectedModel,
          maxTokens,
          temperature,
          systemPrompt
        })
      });

      if (!response.ok) throw new Error('Failed to get AI response');

      const data = await response.json();
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content || 'Sorry, I encountered an error processing your request.',
        timestamp: new Date(),
        metadata: {
          model: selectedModel,
          tokens: data.usage?.totalTokens,
          processingTime: data.processingTime
        }
      };

      setMessages(prev => [...prev, assistantMessage]);
      onMessageSent?.(assistantMessage);

    } catch (error) {
      console.error('Failed to send message:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date(),
        status: 'error'
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceInput = () => {
    if (!enableVoice) return;
    
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(prev => prev + (prev ? ' ' : '') + transcript);
      };

      recognition.start();
    }
  };

  const handleRateMessage = (messageId: string, rating: 'up' | 'down') => {
    setMessages(prev => prev.map(msg =>
      msg.id === messageId ? { ...msg, rating } : msg
    ));
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  const handleFileAttachment = () => {
    fileInputRef.current?.click();
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className={`flex flex-col h-full bg-zinc-950 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg">
            <Brain className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">AI Assistant</h3>
            <p className="text-sm text-zinc-400">Powered by {selectedModel}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-green-400 border-green-500">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
            Online
          </Badge>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b border-zinc-800 bg-zinc-900/50"
          >
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-zinc-400 mb-2 block">Model</label>
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4o-mini">GPT-4O Mini</SelectItem>
                      <SelectItem value="gpt-4o">GPT-4O</SelectItem>
                      <SelectItem value="claude-3-5-sonnet">Claude 3.5 Sonnet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-zinc-400 mb-2 block">Temperature</label>
                  <Input 
                    type="number" 
                    min="0" 
                    max="2" 
                    step="0.1" 
                    defaultValue={temperature}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-zinc-400 mb-2 block">Max Tokens</label>
                  <Input 
                    type="number" 
                    min="100" 
                    max="4000" 
                    defaultValue={maxTokens}
                    className="w-full"
                  />
                </div>
              </div>
              
              {systemPrompt && (
                <div>
                  <label className="text-sm font-medium text-zinc-400 mb-2 block">System Prompt</label>
                  <Textarea 
                    defaultValue={systemPrompt}
                    className="min-h-[60px]"
                    placeholder="Enter system instructions..."
                  />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence mode="popLayout">
          {messages.map((message) => (
            <ChatMessageBubble
              key={message.id}
              message={message}
              onRate={handleRateMessage}
              onCopy={handleCopyMessage}
              onDelete={handleDeleteMessage}
            />
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg">
              <Bot className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex items-center space-x-2">
              <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
              <span className="text-zinc-400">AI is thinking...</span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-zinc-800">
        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={placeholder}
              className="min-h-[44px] max-h-32 resize-none pr-20"
              disabled={isLoading}
            />
            
            <div className="absolute right-2 bottom-2 flex items-center space-x-1">
              {enableAttachments && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleFileAttachment}
                  disabled={isLoading}
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
              )}
              
              {enableVoice && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleVoiceInput}
                  disabled={isLoading}
                  className={isListening ? 'text-red-400' : ''}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
              )}
            </div>
          </div>

          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            size="lg"
            className="px-4"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*,.pdf,.txt,.doc,.docx"
          onChange={(e) => {
            // Handle file upload
            console.log('File selected:', e.target.files?.[0]);
          }}
        />

        <div className="flex items-center justify-between mt-2 text-xs text-zinc-500">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span>{inputValue.length} characters</span>
        </div>
      </div>
    </div>
  );
}

// Individual message bubble component
interface ChatMessageBubbleProps {
  message: ChatMessage;
  onRate: (messageId: string, rating: 'up' | 'down') => void;
  onCopy: (content: string) => void;
  onDelete: (messageId: string) => void;
}

function ChatMessageBubble({ message, onRate, onCopy, onDelete }: ChatMessageBubbleProps) {
  const [showActions, setShowActions] = useState(false);
  const isUser = message.role === 'user';
  const isError = message.status === 'error';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} group`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className={`flex items-start space-x-3 max-w-[80%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        <div className={`p-2 rounded-lg flex-shrink-0 ${
          isUser 
            ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20' 
            : isError
            ? 'bg-red-500/20'
            : 'bg-gradient-to-r from-green-500/20 to-emerald-500/20'
        }`}>
          {isUser ? (
            <User className="w-4 h-4 text-blue-400" />
          ) : (
            <Bot className={`w-4 h-4 ${isError ? 'text-red-400' : 'text-green-400'}`} />
          )}
        </div>

        {/* Message Content */}
        <div className={`relative ${isUser ? 'text-right' : 'text-left'}`}>
          <div className={`inline-block p-3 rounded-lg text-sm ${
            isUser
              ? 'bg-blue-600 text-white'
              : isError
              ? 'bg-red-900/50 border border-red-800 text-red-200'
              : 'bg-zinc-800 text-zinc-200'
          }`}>
            <div className="whitespace-pre-wrap">{message.content}</div>
            
            {/* Metadata */}
            <div className={`flex items-center space-x-2 mt-2 text-xs opacity-60 ${
              isUser ? 'justify-end' : 'justify-start'
            }`}>
              <span>{formatTime(message.timestamp)}</span>
              {message.metadata?.tokens && (
                <span>• {message.metadata.tokens} tokens</span>
              )}
              {message.metadata?.processingTime && (
                <span>• {message.metadata.processingTime}ms</span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <AnimatePresence>
            {showActions && !isUser && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center space-x-1 mt-2"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onCopy(message.content)}
                >
                  <Copy className="w-3 h-3" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRate(message.id, 'up')}
                  className={message.rating === 'up' ? 'bg-green-600' : ''}
                >
                  <ThumbsUp className="w-3 h-3" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRate(message.id, 'down')}
                  className={message.rating === 'down' ? 'bg-red-600' : ''}
                >
                  <ThumbsDown className="w-3 h-3" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(message.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// Chat session manager
interface ChatSessionManagerProps {
  sessions: ChatSession[];
  currentSessionId?: string;
  onSessionSelect: (sessionId: string) => void;
  onNewSession: () => void;
  onDeleteSession: (sessionId: string) => void;
  className?: string;
}

export function ChatSessionManager({
  sessions,
  currentSessionId,
  onSessionSelect,
  onNewSession,
  onDeleteSession,
  className = ''
}: ChatSessionManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSessions = sessions.filter(session =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.messages.some(msg => 
      msg.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className={`flex flex-col h-full bg-zinc-900/50 border-r border-zinc-800 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Chat Sessions</h3>
          <Button size="sm" onClick={onNewSession}>
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto">
        {filteredSessions.map((session) => (
          <motion.div
            key={session.id}
            whileHover={{ backgroundColor: 'rgba(39, 39, 42, 0.5)' }}
            className={`p-4 border-b border-zinc-800/50 cursor-pointer transition-colors ${
              currentSessionId === session.id ? 'bg-zinc-800/50 border-blue-500/30' : ''
            }`}
            onClick={() => onSessionSelect(session.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-white truncate">{session.title}</h4>
                <p className="text-sm text-zinc-400 mt-1 line-clamp-2">
                  {session.messages[session.messages.length - 1]?.content || 'No messages yet'}
                </p>
                <div className="flex items-center space-x-3 mt-2 text-xs text-zinc-500">
                  <span>{formatDate(session.updatedAt)}</span>
                  <span>•</span>
                  <span>{session.messages.length} messages</span>
                  <span>•</span>
                  <span>{session.model}</span>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSession(session.id);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ))}
        
        {filteredSessions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MessageCircle className="w-12 h-12 text-zinc-400 mb-4" />
            <h4 className="text-lg font-medium text-white mb-2">No conversations found</h4>
            <p className="text-zinc-400 mb-4">Start a new chat to begin your AI conversation</p>
            <Button onClick={onNewSession}>
              <Plus className="w-4 h-4 mr-2" />
              Start New Chat
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}