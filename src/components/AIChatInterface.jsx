import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Send, 
  Bot, 
  User, 
  Brain, 
  TrendingUp, 
  Users, 
  Target,
  Lightbulb,
  MessageCircle,
  X,
  Loader2
} from 'lucide-react';
// Mock AI service for demonstration purposes
const AIEducationalService = {
  analyzeStudentPerformance: async (student, grades, subjects) => {
    return {
      resumo: `Análise do desempenho de ${student.name}`,
      disciplinas_destaque: [
        { nome: 'Matemática', status: 'Bom', nota_atual: 8.5, tendencia: 'Estável', observacoes: 'Bom desempenho geral' }
      ],
      padroes_identificados: ['Consistência nas avaliações'],
      estrategias_melhoria: [
        { area: 'Matemática', prioridade: 'Média', estrategia: 'Exercícios extras', prazo_sugerido: '2 semanas' }
      ],
      pontos_fortes: ['Dedicação', 'Pontualidade'],
      intervencoes_pedagogicas: [
        { tipo: 'Reforço', descricao: 'Aulas extras', recursos_necessarios: 'Material didático', resultado_esperado: 'Melhoria de 10%' }
      ],
      recomendacoes_gerais: ['Manter o ritmo de estudos']
    };
  },
  analyzeClassPerformance: async (students, grades, subjects) => {
    return {
      resumo_turma: 'Turma com desempenho satisfatório',
      ranking_disciplinas: [
        { posicao: 1, disciplina: 'Matemática', media: 7.8, status: 'Bom', tendencia: 'Crescente' }
      ],
      padroes_turma: ['Participação ativa'],
      estrategias_coletivas: [
        { area: 'Geral', estrategia: 'Trabalhos em grupo', beneficiarios: 'Toda turma', implementacao: 'Imediata' }
      ],
      intervencoes_coletivas: [
        { tipo: 'Dinâmica', descricao: 'Atividades colaborativas', alunos_alvo: 'Todos', recursos: 'Sala ampla' }
      ],
      recomendacoes_gerais: ['Manter engajamento']
    };
  },
  getPedagogicalAdvice: async (message, context) => {
    return `Baseado na sua pergunta "${message}", recomendo focar no acompanhamento individual dos estudantes e utilizar estratégias pedagógicas diversificadas.`;
  }
};

const AIChatInterface = ({ isOpen, onClose }) => {
  const { students, grades, subjects } = useData();
  const { theme } = useTheme();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [chatMode, setChatMode] = useState('general'); // general, student, class
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      // Mensagem de boas-vindas
      setMessages([{
        id: 1,
        type: 'ai',
        content: 'Olá! Sou seu assistente de IA educacional. Como posso ajudá-lo hoje?',
        timestamp: new Date(),
        suggestions: [
          'Analisar desempenho de um aluno específico',
          'Ver análise geral da turma',
          'Obter sugestões pedagógicas',
          'Gerar plano de ação para um aluno'
        ]
      }]);
    }
  }, [isOpen]);

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
      let aiResponse;

      if (chatMode === 'student' && selectedStudent) {
        // Análise específica de aluno
        const studentData = students.find(s => s.id === parseInt(selectedStudent));
        aiResponse = await AIEducationalService.analyzeStudentPerformance(
          studentData, 
          grades, 
          subjects
        );
        
        const responseMessage = {
          id: Date.now() + 1,
          type: 'ai',
          content: formatStudentAnalysis(aiResponse),
          timestamp: new Date(),
          data: aiResponse,
          suggestions: [
            'Gerar plano de ação para este aluno',
            'Analisar outro aluno',
            'Voltar ao modo geral'
          ]
        };
        
        setMessages(prev => [...prev, responseMessage]);
      } else if (chatMode === 'class') {
        // Análise da turma
        aiResponse = await AIEducationalService.analyzeClassPerformance(
          students, 
          grades, 
          subjects
        );
        
        const responseMessage = {
          id: Date.now() + 1,
          type: 'ai',
          content: formatClassAnalysis(aiResponse),
          timestamp: new Date(),
          data: aiResponse,
          suggestions: [
            'Ver detalhes de uma disciplina específica',
            'Analisar alunos em risco',
            'Voltar ao modo geral'
          ]
        };
        
        setMessages(prev => [...prev, responseMessage]);
      } else {
        // Chat geral
        aiResponse = await AIEducationalService.getPedagogicalAdvice(inputMessage, [
          `Total de alunos: ${students.length}`,
          `Total de disciplinas: ${subjects.length}`,
          `Total de avaliações: ${grades.length}`
        ]);
        
        const responseMessage = {
          id: Date.now() + 1,
          type: 'ai',
          content: aiResponse,
          timestamp: new Date(),
          suggestions: [
            'Analisar aluno específico',
            'Ver análise da turma',
            'Fazer outra pergunta'
          ]
        };
        
        setMessages(prev => [...prev, responseMessage]);
      }
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: `Desculpe, ocorreu um erro: ${error.message}`,
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatStudentAnalysis = (analysis) => {
    return `
**📊 Análise do Desempenho do Aluno**

**🎯 Resumo:**
${analysis.resumo}

**📚 Disciplinas em Destaque:**
${analysis.disciplinas_destaque.map(d => 
  `• **${d.nome}**: ${d.status} (${d.nota_atual}/10) - ${d.tendencia}\n  ${d.observacoes}`
).join('\n')}

**🔍 Padrões Identificados:**
${analysis.padroes_identificados.map(p => `• ${p}`).join('\n')}

**💡 Estratégias de Melhoria:**
${analysis.estrategias_melhoria.map(e => 
  `• **${e.area}** (${e.prioridade}): ${e.estrategia}\n  Prazo: ${e.prazo_sugerido}`
).join('\n')}

**⭐ Pontos Fortes:**
${analysis.pontos_fortes.map(p => `• ${p}`).join('\n')}

**🎓 Intervenções Pedagógicas:**
${analysis.intervencoes_pedagogicas.map(i => 
  `• **${i.tipo}**: ${i.descricao}\n  Recursos: ${i.recursos_necessarios}\n  Resultado esperado: ${i.resultado_esperado}`
).join('\n')}

**📋 Recomendações Gerais:**
${analysis.recomendacoes_gerais.map(r => `• ${r}`).join('\n')}
    `;
  };

  const formatClassAnalysis = (analysis) => {
    return `
**🏫 Análise do Desempenho da Turma**

**📈 Resumo:**
${analysis.resumo_turma}

**🏆 Ranking das Disciplinas:**
${analysis.ranking_disciplinas.map(d => 
  `• **${d.posicao}**: ${d.disciplina} - ${d.media}/10 (${d.status}) - ${d.tendencia}`
).join('\n')}

**🔍 Padrões da Turma:**
${analysis.padroes_turma.map(p => `• ${p}`).join('\n')}

**📚 Estratégias Coletivas:**
${analysis.estrategias_coletivas.map(e => 
  `• **${e.area}**: ${e.estrategia}\n  Beneficiários: ${e.beneficiarios}\n  Implementação: ${e.implementacao}`
).join('\n')}

**🎓 Intervenções Coletivas:**
${analysis.intervencoes_coletivas.map(i => 
  `• **${i.tipo}**: ${i.descricao}\n  Alunos alvo: ${i.alunos_alvo}\n  Recursos: ${i.recursos}`
).join('\n')}

**💡 Recomendações Gerais:**
${analysis.recomendacoes_gerais.map(r => `• ${r}`).join('\n')}
    `;
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.includes('aluno específico')) {
      setChatMode('student');
      setInputMessage('Por favor, selecione um aluno para análise:');
    } else if (suggestion.includes('análise da turma')) {
      setChatMode('class');
      setInputMessage('Analisando desempenho geral da turma...');
      handleSendMessage();
    } else if (suggestion.includes('plano de ação')) {
      // Implementar geração de plano de ação
      setInputMessage('Gerando plano de ação personalizado...');
      handleSendMessage();
    } else if (suggestion.includes('modo geral')) {
      setChatMode('general');
      setSelectedStudent('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-4xl h-[80vh] rounded-2xl shadow-2xl flex flex-col ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-white'
      }`}>
        
        {/* Header */}
        <div className={`p-6 border-b rounded-t-2xl ${
          theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50'
              }`}>
                <Brain className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Assistente de IA Educacional
                </h2>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Análise inteligente e sugestões pedagógicas personalizadas
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Mode Selector */}
          <div className="flex space-x-2 mt-4">
            <button
              onClick={() => setChatMode('general')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                chatMode === 'general'
                  ? 'bg-blue-600 text-white'
                  : theme === 'dark'
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <MessageCircle className="h-4 w-4 inline mr-2" />
              Chat Geral
            </button>
            <button
              onClick={() => setChatMode('student')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                chatMode === 'student'
                  ? 'bg-green-600 text-white'
                  : theme === 'dark'
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <User className="h-4 w-4 inline mr-2" />
              Análise de Aluno
            </button>
            <button
              onClick={() => setChatMode('class')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                chatMode === 'class'
                  ? 'bg-purple-600 text-white'
                  : theme === 'dark'
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Users className="h-4 w-4 inline mr-2" />
              Análise da Turma
            </button>
          </div>

          {/* Student Selector for Student Mode */}
          {chatMode === 'student' && (
            <div className="mt-4">
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Selecione o aluno para análise:
              </label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="">Selecionar aluno...</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.name} ({student.class})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${
                message.type === 'user' ? 'order-2' : 'order-1'
              }`}>
                <div className={`flex items-start space-x-3 ${
                  message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  <div className={`p-2 rounded-full ${
                    message.type === 'user'
                      ? theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'
                      : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-gray-600" />
                    )}
                  </div>
                  
                  <div className={`rounded-2xl px-4 py-3 ${
                    message.type === 'user'
                      ? theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                      : theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'
                  }`}>
                    <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                    
                    {/* Suggestions */}
                    {message.suggestions && (
                      <div className="mt-3 space-y-2">
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className={`block w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${
                              theme === 'dark'
                                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                            }`}
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className={`text-xs mt-2 ${
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
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-full ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  <Bot className="h-4 w-4 text-gray-600" />
                </div>
                <div className={`rounded-2xl px-4 py-3 ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                }`}>
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Analisando dados...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className={`p-6 border-t rounded-b-2xl ${
          theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="flex space-x-3">
            <div className="flex-1">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua pergunta ou solicite uma análise..."
                rows={2}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                !inputMessage.trim() || isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
              }`}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          
          <div className="mt-3 text-xs text-gray-500">
            💡 Dica: Use Shift+Enter para quebra de linha, Enter para enviar
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatInterface;




