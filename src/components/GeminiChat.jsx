import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  X, 
  Minimize2,
  Maximize2,
  Loader2
} from 'lucide-react';

const GeminiChat = () => {
  const { students, grades, subjects } = useData();
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Welcome message
      setMessages([{
        id: 1,
        type: 'bot',
        content: 'Olá! Sou seu assistente de IA educacional integrado com Gemini. Como posso ajudá-lo hoje?\n\nPosso analisar:\n• Desempenho geral da turma\n• Estatísticas por disciplina\n• Identificar alunos em risco\n• Sugerir estratégias pedagógicas\n• Responder perguntas sobre educação',
        timestamp: new Date()
      }]);
    }
  }, [isOpen, messages.length]);

  // Mock Gemini API integration
  const callGeminiAPI = async (message, context) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock responses based on message content
    if (message.toLowerCase().includes('turma') || message.toLowerCase().includes('classe')) {
      const avgGrade = grades.reduce((sum, g) => sum + g.grade, 0) / grades.length;
      const studentsAtRisk = students.filter(student => {
        const studentGrades = grades.filter(g => g.studentId === student.id);
        const studentAvg = studentGrades.reduce((sum, g) => sum + g.grade, 0) / studentGrades.length;
        return studentAvg < 6;
      });

      return `📊 **Análise Geral da Turma**

**Estatísticas Principais:**
• Total de estudantes: ${students.length}
• Média geral da turma: ${avgGrade.toFixed(1)}
• Estudantes em risco: ${studentsAtRisk.length}
• Total de avaliações: ${grades.length}

**Disciplinas com melhor desempenho:**
${subjects.slice(0, 3).map(subject => {
  const subjectGrades = grades.filter(g => g.subjectId === subject.id);
  const subjectAvg = subjectGrades.reduce((sum, g) => sum + g.grade, 0) / subjectGrades.length;
  return `• ${subject.name}: ${subjectAvg.toFixed(1)}`;
}).join('\n')}

**Recomendações:**
• Implementar atividades de reforço para os ${studentsAtRisk.length} estudantes em risco
• Manter estratégias atuais para disciplinas com bom desempenho
• Considerar atividades colaborativas para melhorar engajamento

Precisa de mais detalhes sobre algum aspecto específico?`;
    }
    
    if (message.toLowerCase().includes('risco') || message.toLowerCase().includes('dificuldade')) {
      const studentsAtRisk = students.filter(student => {
        const studentGrades = grades.filter(g => g.studentId === student.id);
        const studentAvg = studentGrades.reduce((sum, g) => sum + g.grade, 0) / studentGrades.length;
        return studentAvg < 6;
      });

      return `⚠️ **Estudantes em Situação de Risco**

**Identificados ${studentsAtRisk.length} estudantes que precisam de atenção:**

${studentsAtRisk.slice(0, 5).map(student => {
  const studentGrades = grades.filter(g => g.studentId === student.id);
  const studentAvg = studentGrades.reduce((sum, g) => sum + g.grade, 0) / studentGrades.length;
  return `• **${student.name}** (${student.class}): Média ${studentAvg.toFixed(1)}`;
}).join('\n')}

**Estratégias Recomendadas:**
1. **Acompanhamento Individual**: Reuniões semanais para identificar dificuldades específicas
2. **Atividades de Reforço**: Exercícios extras nas disciplinas com maior dificuldade
3. **Apoio Colaborativo**: Formar grupos de estudo com estudantes de melhor desempenho
4. **Comunicação com Responsáveis**: Manter diálogo constante sobre o progresso

Gostaria de estratégias específicas para algum estudante?`;
    }

    if (message.toLowerCase().includes('disciplina') || message.toLowerCase().includes('matéria')) {
      return `📚 **Análise por Disciplinas**

**Ranking de Desempenho:**
${subjects.map((subject, index) => {
  const subjectGrades = grades.filter(g => g.subjectId === subject.id);
  const subjectAvg = subjectGrades.reduce((sum, g) => sum + g.grade, 0) / subjectGrades.length;
  const status = subjectAvg >= 7 ? '🟢 Excelente' : subjectAvg >= 6 ? '🟡 Bom' : '🔴 Precisa Atenção';
  return `${index + 1}. **${subject.name}**: ${subjectAvg.toFixed(1)} ${status}`;
}).join('\n')}

**Recomendações por Área:**
• **Linguagens**: Incentivar leitura e produção textual
• **Matemática**: Usar exemplos práticos e jogos educativos
• **Ciências**: Experimentos e atividades investigativas
• **Humanas**: Debates e análise de casos reais

Quer detalhes sobre alguma disciplina específica?`;
    }

    // Default response
    return `Entendo sua pergunta sobre "${message}". 

Com base nos dados da turma (${students.length} estudantes, ${grades.length} avaliações), posso ajudar com:

🎯 **Análises Disponíveis:**
• Desempenho geral da turma
• Identificação de estudantes em risco
• Comparação entre disciplinas
• Sugestões pedagógicas personalizadas

📊 **Estatísticas Rápidas:**
• Média geral: ${(grades.reduce((sum, g) => sum + g.grade, 0) / grades.length).toFixed(1)}
• Melhor disciplina: ${subjects[0]?.name || 'N/A'}
• Total de disciplinas: ${subjects.length}

Como posso ajudar especificamente?`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const context = {
        students: students.length,
        grades: grades.length,
        subjects: subjects.length,
        avgGrade: grades.reduce((sum, g) => sum + g.grade, 0) / grades.length
      };

      const response = await callGeminiAPI(inputMessage, context);
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Desculpe, ocorreu um erro ao processar sua solicitação. Tente novamente.',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
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

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg transition-all hover:scale-110 z-50 ${
          theme === 'dark'
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        <MessageCircle className="h-6 w-6 mx-auto" />
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
      isMinimized ? 'w-80 h-16' : 'w-96 h-[500px]'
    }`}>
      <div className={`h-full rounded-2xl shadow-2xl border flex flex-col ${
        theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        
        {/* Header */}
        <div className={`p-4 border-b rounded-t-2xl flex items-center justify-between ${
          theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50'
            }`}>
              <Bot className="h-4 w-4 text-blue-500" />
            </div>
            <div>
              <h3 className={`font-semibold text-sm ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Assistente Gemini
              </h3>
              <p className={`text-xs ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                IA Educacional
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className={`p-1 rounded transition-colors ${
                theme === 'dark'
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className={`p-1 rounded transition-colors ${
                theme === 'dark'
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] ${
                    message.type === 'user' ? 'order-2' : 'order-1'
                  }`}>
                    <div className={`flex items-start space-x-2 ${
                      message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}>
                      <div className={`p-1.5 rounded-full ${
                        message.type === 'user'
                          ? theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'
                          : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                      }`}>
                        {message.type === 'user' ? (
                          <User className="h-3 w-3 text-white" />
                        ) : (
                          <Bot className="h-3 w-3 text-gray-600" />
                        )}
                      </div>
                      
                      <div className={`rounded-2xl px-3 py-2 text-sm ${
                        message.type === 'user'
                          ? theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                          : theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'
                      }`}>
                        <div className="whitespace-pre-wrap">{message.content}</div>
                      </div>
                    </div>
                    
                    <div className={`text-xs mt-1 ${
                      message.type === 'user' ? 'text-right' : 'text-left'
                    } ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2">
                    <div className={`p-1.5 rounded-full ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                      <Bot className="h-3 w-3 text-gray-600" />
                    </div>
                    <div className={`rounded-2xl px-3 py-2 ${
                      theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                    }`}>
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span className="text-sm">Analisando...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className={`p-4 border-t rounded-b-2xl ${
              theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex space-x-2">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Pergunte sobre a turma..."
                  rows={1}
                  className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    !inputMessage.trim() || isLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GeminiChat;
