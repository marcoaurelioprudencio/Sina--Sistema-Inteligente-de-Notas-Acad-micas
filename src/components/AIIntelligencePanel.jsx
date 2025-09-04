import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Lightbulb, 
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  Eye,
  Users,
  BookOpen,
  Loader2
} from 'lucide-react';
// Mock AI service for demonstration purposes
const AIEducationalService = {
  isConfigured: () => true,
  analyzeClassPerformance: async (students, grades, subjects) => {
    return {
      resumo_turma: 'Turma apresenta desempenho satisfatório com oportunidades de melhoria em algumas disciplinas.',
      ranking_disciplinas: [
        { posicao: 1, disciplina: 'Matemática', media: 7.8, status: 'bom', tendencia: 'Crescente' },
        { posicao: 2, disciplina: 'Português', media: 7.5, status: 'bom', tendencia: 'Estável' },
        { posicao: 3, disciplina: 'História', media: 7.2, status: 'regular', tendencia: 'Crescente' }
      ],
      estrategias_coletivas: [
        { 
          area: 'Matemática', 
          estrategia: 'Implementar exercícios práticos em grupo', 
          beneficiarios: 'Toda a turma', 
          implementacao: 'Próximas 2 semanas' 
        }
      ]
    };
  }
};

const AIIntelligencePanel = () => {
  const { students, grades, subjects } = useData();
  const { theme } = useTheme();
  const [insights, setInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    generateInsights();
  }, []);

  const generateInsights = async () => {
    if (!AIEducationalService.isConfigured()) {
      setInsights({
        error: 'API do Gemini não configurada',
        message: 'Configure a chave da API para usar os recursos de IA'
      });
      return;
    }

    setIsLoading(true);
    try {
      // Gerar insights da turma
      const classAnalysis = await AIEducationalService.analyzeClassPerformance(
        students, 
        grades, 
        subjects
      );

      // Identificar alunos com melhorias
      const studentsWithImprovements = await identifyStudentsWithImprovements();

      // Gerar insights consolidados
      const consolidatedInsights = {
        timestamp: new Date(),
        classAnalysis,
        studentsWithImprovements,
        recommendations: generateRecommendations(classAnalysis, studentsWithImprovements)
      };

      setInsights(consolidatedInsights);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Erro ao gerar insights:', error);
      setInsights({
        error: 'Erro ao gerar insights',
        message: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const identifyStudentsWithImprovements = async () => {
    const studentsWithImprovements = [];
    
    for (const student of students) {
      const studentGrades = grades.filter(g => g.studentId === student.id);
      if (studentGrades.length < 2) continue;

      // Calcular tendência das notas
      const recentGrades = studentGrades
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3);
      
      const olderGrades = studentGrades
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(3, 6);

      if (recentGrades.length > 0 && olderGrades.length > 0) {
        const recentAvg = recentGrades.reduce((sum, g) => sum + g.grade, 0) / recentGrades.length;
        const olderAvg = olderGrades.reduce((sum, g) => sum + g.grade, 0) / olderGrades.length;
        
        if (recentAvg > olderAvg + 0.5) {
          studentsWithImprovements.push({
            student,
            improvement: recentAvg - olderAvg,
            recentAverage: recentAvg,
            olderAverage: olderAvg,
            subjects: [...new Set(recentGrades.map(g => g.subjectName))]
          });
        }
      }
    }

    return studentsWithImprovements.sort((a, b) => b.improvement - a.improvement);
  };

  const generateRecommendations = (classAnalysis, studentsWithImprovements) => {
    const recommendations = [];

    // Recomendações baseadas na análise da turma
    if (classAnalysis.estrategias_coletivas) {
      recommendations.push(...classAnalysis.estrategias_coletivas.map(e => ({
        type: 'class',
        priority: 'high',
        title: `Estratégia para ${e.area}`,
        description: e.estrategia,
        beneficiaries: e.beneficiarios,
        implementation: e.implementacao
      })));
    }

    // Recomendações para alunos com melhorias
    if (studentsWithImprovements.length > 0) {
      recommendations.push({
        type: 'improvement',
        priority: 'medium',
        title: 'Reconhecer e Aproveitar Melhorias',
        description: `${studentsWithImprovements.length} alunos mostraram melhoria significativa. Considere usar suas estratégias como exemplo para outros alunos.`,
        beneficiaries: 'Todos os alunos',
        implementation: 'Compartilhar casos de sucesso e estratégias que funcionaram'
      });
    }

    // Recomendações baseadas em dados
    const lowAttendanceStudents = students.filter(student => {
      const studentGrades = grades.filter(g => g.studentId === student.id);
      const avgAttendance = studentGrades.reduce((sum, g) => sum + g.attendance, 0) / studentGrades.length;
      return avgAttendance < 75;
    });

    if (lowAttendanceStudents.length > 0) {
      recommendations.push({
        type: 'attendance',
        priority: 'high',
        title: 'Intervenção para Frequência Baixa',
        description: `${lowAttendanceStudents.length} alunos têm frequência média abaixo de 75%. Considere intervenções específicas.`,
        beneficiaries: lowAttendanceStudents.map(s => s.name).join(', '),
        implementation: 'Contato com pais, atividades de recuperação, acompanhamento individual'
      });
    }

    return recommendations;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'class': return <Users className="h-4 w-4" />;
      case 'improvement': return <TrendingUp className="h-4 w-4" />;
      case 'attendance': return <Clock className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  if (!insights) {
    return (
      <div className={`rounded-xl shadow-sm overflow-hidden ${
        theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        <div className="p-6 text-center">
          <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin text-blue-500" />
          <p className="text-gray-500">Carregando insights de IA...</p>
        </div>
      </div>
    );
  }

  if (insights.error) {
    return (
      <div className={`rounded-xl shadow-sm overflow-hidden ${
        theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        <div className="p-6 text-center">
          <AlertTriangle className="h-8 w-8 mx-auto mb-4 text-yellow-500" />
          <h3 className="text-lg font-semibold mb-2 text-yellow-600">Configuração Necessária</h3>
          <p className="text-gray-500 mb-4">{insights.message}</p>
          <button
            onClick={generateInsights}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl shadow-sm overflow-hidden ${
      theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
    }`}>
      
      {/* Header */}
      <div className={`px-6 py-4 border-b ${
        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50'
            }`}>
              <Brain className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h3 className={`text-lg font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Painel de Inteligência Artificial
              </h3>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Insights automáticos e recomendações inteligentes
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
              title={showDetails ? 'Ocultar detalhes' : 'Mostrar detalhes'}
            >
              <Eye className="h-4 w-4" />
            </button>
            
            <button
              onClick={generateInsights}
              disabled={isLoading}
              className={`p-2 rounded-lg transition-colors ${
                isLoading
                  ? 'text-gray-400 cursor-not-allowed'
                  : theme === 'dark'
                    ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-900/20'
                    : 'text-blue-600 hover:text-blue-500 hover:bg-blue-50'
              }`}
              title="Atualizar insights"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {lastUpdated && (
          <div className={`text-xs mt-2 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Última atualização: {lastUpdated.toLocaleString('pt-BR')}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        
        {/* Students with Improvements */}
        {insights.studentsWithImprovements && insights.studentsWithImprovements.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <h4 className={`font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Alunos com Melhorias Significativas
              </h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {insights.studentsWithImprovements.slice(0, 4).map((item, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-green-50 border-green-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-medium text-sm ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {item.student.name}
                    </span>
                    <span className="text-xs text-green-600 font-bold">
                      +{item.improvement.toFixed(1)}
                    </span>
                  </div>
                  
                  <div className={`text-xs ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <div>Média anterior: {item.olderAverage.toFixed(1)}</div>
                    <div>Média atual: {item.recentAverage.toFixed(1)}</div>
                    <div className="mt-1">
                      <span className="font-medium">Disciplinas:</span> {item.subjects.slice(0, 2).join(', ')}
                      {item.subjects.length > 2 && ` +${item.subjects.length - 2} mais`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {insights.recommendations && insights.recommendations.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              <h4 className={`font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Recomendações Inteligentes
              </h4>
            </div>
            
            <div className="space-y-3">
              {insights.recommendations.slice(0, 5).map((rec, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${getPriorityColor(rec.priority)}`}>
                      {getTypeIcon(rec.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h5 className={`font-medium ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {rec.title}
                        </h5>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(rec.priority)}`}>
                          {rec.priority === 'high' ? 'Alta' : rec.priority === 'medium' ? 'Média' : 'Baixa'}
                        </span>
                      </div>
                      
                      <p className={`text-sm mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {rec.description}
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className={`font-medium ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            Beneficiários:
                          </span>
                          <span className={`ml-2 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {rec.beneficiaries}
                          </span>
                        </div>
                        
                        <div>
                          <span className={`font-medium ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            Implementação:
                          </span>
                          <span className={`ml-2 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {rec.implementation}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Analysis (Collapsible) */}
        {showDetails && insights.classAnalysis && (
          <div className="border-t pt-6">
            <div className="flex items-center space-x-2 mb-3">
              <BookOpen className="h-5 w-5 text-purple-500" />
              <h4 className={`font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Análise Detalhada da Turma
              </h4>
            </div>
            
            <div className={`p-4 rounded-lg ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <div className="whitespace-pre-wrap text-sm">
                {insights.classAnalysis.resumo_turma}
              </div>
              
              {insights.classAnalysis.ranking_disciplinas && (
                <div className="mt-4">
                  <h5 className={`font-medium mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Ranking das Disciplinas:
                  </h5>
                  <div className="space-y-2">
                    {insights.classAnalysis.ranking_disciplinas.map((disc, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                          {disc.posicao}: {disc.disciplina}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{disc.media}/10</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            disc.status === 'excelente' ? 'bg-green-100 text-green-800' :
                            disc.status === 'bom' ? 'bg-blue-100 text-blue-800' :
                            disc.status === 'regular' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {disc.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIIntelligencePanel;




