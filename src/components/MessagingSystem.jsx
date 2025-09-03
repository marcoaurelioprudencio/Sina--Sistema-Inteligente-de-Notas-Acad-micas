import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../contexts/DataContext';
import { useNotifications } from './NotificationSystem';
import { 
  MessageCircle, 
  Send, 
  Search, 
  X, 
  User, 
  Clock,
  Check,
  CheckCheck,
  Plus,
  Filter,
  Archive,
  Star,
  Paperclip,
  Smile
} from 'lucide-react';

const MessagingSystem = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const { students } = useData();
  const { addNotification } = useNotifications();
  
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, unread, starred, archived
  const messagesEndRef = useRef(null);

  // Mock conversations data
  const [conversations, setConversations] = useState([
    {
      id: 1,
      participantId: 'student_1',
      participantName: 'Ana Silva',
      participantType: 'student',
      lastMessage: 'Professor, tenho uma dúvida sobre a prova de matemática.',
      lastMessageTime: new Date(Date.now() - 30 * 60000), // 30 minutes ago
      unreadCount: 2,
      starred: false,
      archived: false,
      messages: [
        {
          id: 1,
          senderId: 'student_1',
          senderName: 'Ana Silva',
          text: 'Boa tarde, professor! Tudo bem?',
          timestamp: new Date(Date.now() - 2 * 60 * 60000),
          read: true
        },
        {
          id: 2,
          senderId: 'professor',
          senderName: 'Professor',
          text: 'Boa tarde, Ana! Tudo bem sim. Como posso ajudá-la?',
          timestamp: new Date(Date.now() - 90 * 60000),
          read: true
        },
        {
          id: 3,
          senderId: 'student_1',
          senderName: 'Ana Silva',
          text: 'Professor, tenho uma dúvida sobre a prova de matemática.',
          timestamp: new Date(Date.now() - 30 * 60000),
          read: false
        },
        {
          id: 4,
          senderId: 'student_1',
          senderName: 'Ana Silva',
          text: 'Poderia me explicar melhor sobre equações do segundo grau?',
          timestamp: new Date(Date.now() - 25 * 60000),
          read: false
        }
      ]
    },
    {
      id: 2,
      participantId: 'student_2',
      participantName: 'Carlos Santos',
      participantType: 'student',
      lastMessage: 'Obrigado pela explicação!',
      lastMessageTime: new Date(Date.now() - 2 * 60 * 60000),
      unreadCount: 0,
      starred: true,
      archived: false,
      messages: [
        {
          id: 1,
          senderId: 'student_2',
          senderName: 'Carlos Santos',
          text: 'Professor, não consegui entregar o trabalho no prazo.',
          timestamp: new Date(Date.now() - 3 * 60 * 60000),
          read: true
        },
        {
          id: 2,
          senderId: 'professor',
          senderName: 'Professor',
          text: 'Sem problemas, Carlos. Você pode entregar até amanhã.',
          timestamp: new Date(Date.now() - 2.5 * 60 * 60000),
          read: true
        },
        {
          id: 3,
          senderId: 'student_2',
          senderName: 'Carlos Santos',
          text: 'Obrigado pela explicação!',
          timestamp: new Date(Date.now() - 2 * 60 * 60000),
          read: true
        }
      ]
    },
    {
      id: 3,
      participantId: 'parent_1',
      participantName: 'Maria Silva (Mãe da Ana)',
      participantType: 'parent',
      lastMessage: 'Gostaria de agendar uma reunião.',
      lastMessageTime: new Date(Date.now() - 24 * 60 * 60000),
      unreadCount: 1,
      starred: false,
      archived: false,
      messages: [
        {
          id: 1,
          senderId: 'parent_1',
          senderName: 'Maria Silva',
          text: 'Boa tarde, professor. Sou a mãe da Ana Silva.',
          timestamp: new Date(Date.now() - 25 * 60 * 60000),
          read: true
        },
        {
          id: 2,
          senderId: 'parent_1',
          senderName: 'Maria Silva',
          text: 'Gostaria de agendar uma reunião.',
          timestamp: new Date(Date.now() - 24 * 60 * 60000),
          read: false
        }
      ]
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation?.messages]);

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `${minutes}min`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return timestamp.toLocaleDateString('pt-BR');
  };

  const sendMessage = () => {
    if (!messageText.trim() || !selectedConversation) return;

    const newMessage = {
      id: Date.now(),
      senderId: 'professor',
      senderName: 'Professor',
      text: messageText.trim(),
      timestamp: new Date(),
      read: true
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === selectedConversation.id) {
        const updatedConv = {
          ...conv,
          messages: [...conv.messages, newMessage],
          lastMessage: newMessage.text,
          lastMessageTime: newMessage.timestamp
        };
        setSelectedConversation(updatedConv);
        return updatedConv;
      }
      return conv;
    }));

    setMessageText('');

    // Add notification
    addNotification({
      type: 'success',
      title: 'Mensagem enviada',
      message: `Mensagem enviada para ${selectedConversation.participantName}`
    });
  };

  const markConversationAsRead = (conversationId) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          unreadCount: 0,
          messages: conv.messages.map(msg => ({ ...msg, read: true }))
        };
      }
      return conv;
    }));
  };

  const toggleStar = (conversationId) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return { ...conv, starred: !conv.starred };
      }
      return conv;
    }));
  };

  const archiveConversation = (conversationId) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return { ...conv, archived: !conv.archived };
      }
      return conv;
    }));
  };

  const startNewConversation = (participant) => {
    const existingConv = conversations.find(conv => conv.participantId === participant.id);
    if (existingConv) {
      setSelectedConversation(existingConv);
      return;
    }

    const newConversation = {
      id: Date.now(),
      participantId: participant.id,
      participantName: participant.name,
      participantType: 'student',
      lastMessage: '',
      lastMessageTime: new Date(),
      unreadCount: 0,
      starred: false,
      archived: false,
      messages: []
    };

    setConversations(prev => [newConversation, ...prev]);
    setSelectedConversation(newConversation);
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' ||
                         (filter === 'unread' && conv.unreadCount > 0) ||
                         (filter === 'starred' && conv.starred) ||
                         (filter === 'archived' && conv.archived);

    return matchesSearch && matchesFilter && !conv.archived;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-6xl h-[90vh] rounded-lg shadow-xl flex ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        
        {/* Sidebar - Conversations List */}
        <div className={`w-1/3 border-r flex flex-col ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          {/* Header */}
          <div className={`p-4 border-b ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Mensagens
              </h2>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'hover:bg-gray-700 text-gray-400'
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-3">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                placeholder="Buscar conversas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>

            {/* Filters */}
            <div className="flex space-x-2">
              {[
                { key: 'all', label: 'Todas', icon: MessageCircle },
                { key: 'unread', label: 'Não lidas', icon: Check },
                { key: 'starred', label: 'Favoritas', icon: Star }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm transition-colors ${
                    filter === key
                      ? 'bg-blue-600 text-white'
                      : theme === 'dark'
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* New Conversation Button */}
          <div className="p-4">
            <div className="relative">
              <select
                onChange={(e) => {
                  const student = students.find(s => s.id === e.target.value);
                  if (student) startNewConversation(student);
                  e.target.value = '';
                }}
                className={`w-full px-3 py-2 rounded-lg border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="">Nova conversa...</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map(conversation => (
              <div
                key={conversation.id}
                onClick={() => {
                  setSelectedConversation(conversation);
                  markConversationAsRead(conversation.id);
                }}
                className={`p-4 border-b cursor-pointer transition-colors ${
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-100'
                } ${
                  selectedConversation?.id === conversation.id
                    ? theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'
                    : theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className={`font-medium truncate ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {conversation.participantName}
                      </h3>
                      {conversation.starred && (
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      )}
                      {conversation.participantType === 'parent' && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          theme === 'dark' ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-800'
                        }`}>
                          Responsável
                        </span>
                      )}
                    </div>
                    <p className={`text-sm truncate mt-1 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {conversation.lastMessage || 'Nova conversa'}
                    </p>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <span className={`text-xs ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      {formatTime(conversation.lastMessageTime)}
                    </span>
                    {conversation.unreadCount > 0 && (
                      <span className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className={`p-4 border-b flex items-center justify-between ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    selectedConversation.participantType === 'parent' 
                      ? 'bg-purple-100 text-purple-600' 
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className={`font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {selectedConversation.participantName}
                    </h3>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {selectedConversation.participantType === 'parent' ? 'Responsável' : 'Estudante'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleStar(selectedConversation.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      selectedConversation.starred
                        ? 'text-yellow-500'
                        : theme === 'dark'
                          ? 'text-gray-400 hover:text-yellow-500'
                          : 'text-gray-500 hover:text-yellow-500'
                    }`}
                  >
                    <Star className={`h-4 w-4 ${selectedConversation.starred ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => archiveConversation(selectedConversation.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      theme === 'dark'
                        ? 'text-gray-400 hover:text-gray-300'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Archive className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedConversation.messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.senderId === 'professor' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.senderId === 'professor'
                        ? 'bg-blue-600 text-white'
                        : theme === 'dark'
                          ? 'bg-gray-700 text-white'
                          : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm">{message.text}</p>
                      <div className={`flex items-center justify-between mt-1 ${
                        message.senderId === 'professor' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        <span className="text-xs">
                          {message.timestamp.toLocaleTimeString('pt-BR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                        {message.senderId === 'professor' && (
                          <div className="ml-2">
                            {message.read ? (
                              <CheckCheck className="h-3 w-3" />
                            ) : (
                              <Check className="h-3 w-3" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className={`p-4 border-t ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className="flex items-end space-x-3">
                  <div className="flex-1">
                    <textarea
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      placeholder="Digite sua mensagem..."
                      rows={1}
                      className={`w-full px-4 py-2 rounded-lg border resize-none ${
                        theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>
                  <button
                    onClick={sendMessage}
                    disabled={!messageText.trim()}
                    className={`p-2 rounded-lg transition-colors ${
                      messageText.trim()
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-300 cursor-not-allowed text-gray-500'
                    }`}
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* No Conversation Selected */
            <div className={`flex-1 flex items-center justify-center ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <div className="text-center">
                <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Selecione uma conversa</h3>
                <p>Escolha uma conversa existente ou inicie uma nova</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagingSystem;
