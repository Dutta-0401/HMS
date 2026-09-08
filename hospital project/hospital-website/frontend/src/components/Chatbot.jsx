import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, X, Send, Bot, User, ChevronDown, ChevronUp,
  Loader2, CheckCheck, Heart, Building2, Calendar, Phone, AlertCircle
} from 'lucide-react';
import { getBotResponse, getQuickReplies, getWelcomeMessage } from '../services/chatbot';

const QUICK_REPLY_ICONS = {
  'Book an appointment': Calendar,
  'Find a doctor': User,
  'Hospital locations': Building2,
  'Emergency services': AlertCircle,
  'Insurance accepted': Heart,
  'View my bookings': CheckCheck,
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const messagesEndRef = useRef(null);
  const chatRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const addMessage = (content, sender = 'user', quickReplies = null) => {
    const newMessage = {
      id: Date.now() + Math.random(),
      content,
      sender,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quickReplies,
    };
    setMessages(prev => [...prev, newMessage]);
    setShowQuickReplies(false);
  };

  const handleSendMessage = async (message = null) => {
    const text = message || inputValue.trim();
    if (!text || isLoading) return;

    setInputValue('');
    setIsLoading(true);
    addMessage(text, 'user');

    try {
      const botResponse = await getBotResponse(text);
      const quickReplies = getQuickReplies();
      addMessage(botResponse, 'bot', quickReplies);
    } catch (error) {
      addMessage('Sorry, I\'m having trouble right now. Please try again or contact support.', 'bot');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && messages.length === 0) {
      setTimeout(() => {
        addMessage(getWelcomeMessage(), 'bot', getQuickReplies());
      }, 300);
    }
  };

  const handleQuickReply = (reply) => {
    handleSendMessage(reply);
  };

  const clearChat = () => {
    setMessages([]);
    setShowQuickReplies(true);
  };

  if (!isOpen && messages.length === 0) {
    return (
      <motion.button
        ref={chatRef}
        onClick={toggleChat}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-primary-600 to-primary-500 
                     shadow-lg shadow-primary-500/30 flex items-center justify-center text-white
                     hover:shadow-xl hover:shadow-primary-500/40 transition-all duration-300"
        aria-label="Open chat assistant"
      >
        <MessageSquare className="w-6 h-6 md:w-7 md:h-7" />
        <motion.span
          animate={{ opacity: [0, 1, 0], y: [10, 0, -10] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          className="absolute -top-2 -right-2 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white"
        />
      </motion.button>
    );
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatRef}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 right-6 z-50 w-full max-w-sm md:max-w-md lg:max-w-lg
                       bg-white rounded-3xl shadow-2xl border border-slate-200/60 overflow-hidden flex flex-col
                       h-[500px] md:h-[550px] lg:h-[600px]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-t-3xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-base">CityHealth Assistant</h3>
                  <p className="text-xs text-primary-100">Online • Typically replies in seconds</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearChat}
                  className="p-2 rounded-xl hover:bg-white/20 transition-colors"
                  aria-label="Clear chat"
                  title="Clear chat"
                >
                  <Loader2 className="w-4 h-4" />
                </button>
                <motion.button
                  onClick={toggleChat}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-xl hover:bg-white/20 transition-colors"
                  aria-label="Close chat"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" role="log" aria-live="polite">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${
                      message.sender === 'user'
                        ? 'bg-primary-100 text-primary-600'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {message.sender === 'user' ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                    </div>
                    <div className={`max-w-[75%] ${message.sender === 'user' ? 'text-right' : ''}`}>
                      <div className={`inline-block px-4 py-2.5 rounded-2xl ${
                        message.sender === 'user'
                          ? 'bg-primary-600 text-white rounded-tr-sm'
                          : 'bg-slate-100 text-slate-900 rounded-tl-sm'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                      <div className={`flex items-center gap-1.5 mt-1.5 text-xs text-slate-400 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <span>{message.timestamp}</span>
                        {message.sender === 'user' && <CheckCheck className="w-3 h-3" />}
                      </div>
                      
                      {message.quickReplies && (
                        <div className="mt-2 flex flex-wrap gap-2" role="listbox" aria-label="Quick replies">
                          {message.quickReplies.map((reply) => {
                            const Icon = QUICK_REPLY_ICONS[reply] || MessageSquare;
                            return (
                              <motion.button
                                key={reply}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleQuickReply(reply)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs text-slate-600 hover:border-primary-300 hover:text-primary-700 hover:bg-primary-50 transition-all"
                                role="option"
                              >
                                <Icon className="w-3.5 h-3.5" />
                                {reply}
                              </motion.button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center">
                    <Bot className="w-4 h-4 text-slate-600" />
                  </div>
                  <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-2.5">
                    <div className="flex gap-1">
                      <motion.span
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        className="w-2 h-2 bg-primary-500 rounded-full"
                      />
                      <motion.span
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
                        className="w-2 h-2 bg-primary-500 rounded-full"
                      />
                      <motion.span
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                        className="w-2 h-2 bg-primary-500 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies (when no messages) */}
            {showQuickReplies && messages.length === 0 && (
              <div className="p-4 border-t border-slate-100">
                <p className="text-xs text-slate-500 mb-3 px-1">Popular questions</p>
                <div className="flex flex-wrap gap-2">
                  {getQuickReplies().map((reply) => {
                    const Icon = QUICK_REPLY_ICONS[reply] || MessageSquare;
                    return (
                      <motion.button
                        key={reply}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleQuickReply(reply)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 hover:border-primary-300 hover:text-primary-700 hover:bg-primary-50 transition-all"
                      >
                        <Icon className="w-4 h-4" />
                        {reply}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-slate-100 bg-white/50 backdrop-blur-sm">
              <div className="flex items-end gap-2">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type a message..."
                    rows={1}
                    className="w-full px-4 py-3 pr-12 bg-white border border-slate-200 rounded-2xl text-sm
                               focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10
                               resize-none max-h-32"
                    aria-label="Chat message input"
                  />
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="p-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 
                             disabled:opacity-50 disabled:cursor-not-allowed transition-colors
                             flex-shrink-0"
                  aria-label="Send message"
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
              <p className="text-xs text-slate-400 text-center mt-2">
                Press Enter to send • Shift+Enter for new line
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button (when chat is open) */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            ref={chatRef}
            onClick={toggleChat}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-primary-600 to-primary-500 
                         shadow-lg shadow-primary-500/30 flex items-center justify-center text-white
                         hover:shadow-xl hover:shadow-primary-500/40 transition-all duration-300"
            aria-label="Open chat assistant"
          >
            <X className="w-6 h-6 md:w-7 md:h-7" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}