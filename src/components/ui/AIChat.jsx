import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../AppIcon';
import Button from './Button';
import Input from './Input';
import geminiService from '../../services/geminiService';
import { useLanguage } from '../../contexts/LanguageContext';

const AIChat = ({ isOpen, onToggle }) => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 1,
        type: 'ai',
        content: 'Olá! Sou seu assistente de IA para análise de desempenho estudantil. Como posso ajudá-lo hoje?',
        timestamp: new Date()
      }]);
    }
  }, [messages.length]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading || isStreaming) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      // Create placeholder for AI response
      const aiMessageId = Date.now() + 1;
      const aiMessage = {
        id: aiMessageId,
        type: 'ai',
        content: '',
        timestamp: new Date(),
        isStreaming: true
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsStreaming(true);

      // Stream the response
      const updatedHistory = await geminiService.streamChatWithHistory(
        userMessage.content,
        chatHistory,
        (chunk) => {
          setMessages(prev => prev.map(msg => 
            msg.id === aiMessageId 
              ? { ...msg, content: msg.content + chunk }
              : msg
          ));
        }
      );

      setChatHistory(updatedHistory);
      
      // Mark streaming as complete
      setMessages(prev => prev.map(msg => 
        msg.id === aiMessageId 
          ? { ...msg, isStreaming: false }
          : msg
      ));

    } catch (err) {
      console.error('Error sending message:', err);
      setError(err.message || 'Falha ao enviar mensagem. Tente novamente.');
      
      // Remove the failed AI message
      setMessages(prev => prev.filter(msg => msg.type !== 'ai' || msg.content !== ''));
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  const handleClearChat = () => {
    setMessages([{
      id: 1,
      type: 'ai',
      content: 'Olá! Sou seu assistente de IA para análise de desempenho estudantil. Como posso ajudá-lo hoje?',
      timestamp: new Date()
    }]);
    setChatHistory([]);
    setError(null);
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!geminiService.isConfigured()) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="outline"
          className="bg-surface border-border text-text-secondary cursor-not-allowed"
          disabled
        >
          <Icon name="MessageCircle" size={20} />
          Chat indisponível
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <motion.div
          className="fixed bottom-4 right-4 z-50"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            onClick={onToggle}
            className="bg-primary hover:bg-primary-hover text-white shadow-lg rounded-full w-14 h-14 p-0"
          >
            <Icon name="MessageCircle" size={24} />
          </Button>
        </motion.div>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-4 right-4 z-50 w-96 h-[32rem] bg-surface border border-border rounded-lg shadow-xl flex flex-col"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <h3 className="font-medium text-text-primary">Assistente IA</h3>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearChat}
                  className="p-1 hover:bg-surface-hover"
                >
                  <Icon name="RotateCcw" size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggle}
                  className="p-1 hover:bg-surface-hover"
                >
                  <Icon name="X" size={16} />
                </Button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 ${
                      message.type === 'user' ?'bg-primary text-white' :'bg-surface-hover text-text-primary border border-border'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    {message.isStreaming && (
                      <div className="flex items-center space-x-1 mt-1">
                        <div className="w-1 h-1 bg-text-secondary rounded-full animate-pulse"></div>
                        <div className="w-1 h-1 bg-text-secondary rounded-full animate-pulse delay-75"></div>
                        <div className="w-1 h-1 bg-text-secondary rounded-full animate-pulse delay-150"></div>
                      </div>
                    )}
                    <span className="text-xs opacity-70 mt-1 block">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
              
              {error && (
                <div className="flex justify-center">
                  <div className="bg-error/10 border border-error/20 text-error rounded-lg px-3 py-2 text-sm">
                    <Icon name="AlertCircle" size={16} className="inline mr-2" />
                    {error}
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-border p-4">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Digite sua pergunta..."
                  disabled={isLoading || isStreaming}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading || isStreaming}
                  className="px-3"
                >
                  {isLoading || isStreaming ? (
                    <Icon name="Loader2" size={16} className="animate-spin" />
                  ) : (
                    <Icon name="Send" size={16} />
                  )}
                </Button>
              </form>
              
              <p className="text-xs text-text-secondary mt-2 text-center">
                Powered by Google Gemini AI
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChat;