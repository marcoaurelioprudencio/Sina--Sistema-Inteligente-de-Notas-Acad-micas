import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../contexts/DataContext';
import { useNotifications } from './NotificationSystem';
import { 
  BookOpen, 
  Target, 
  Clock, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Star,
  Calendar,
  Play,
  Download,
  RefreshCw,
  X,
  Lightbulb,
  Award,
  Users,
  BarChart3
} from 'lucide-react';

const StudyRecommendations = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const { students, subjects, grades } = useData();
  const { addNotification } = useNotifications();
  
  const [selectedStudent, setSelectedStudent] = useState('');
  const [recommendations, setRecommendations] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('individual'); // individual, group

  const generateRecommendations = async () => {
    if (!selectedStudent) return;
    
    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const student = students.find(s => s.id === selectedStudent);
      const studentGrades = grades.filter(g => g.studentId === selectedStudent);
      
      // Analyze student performance
      const subjectAnalysis = subjects.map(subject => {
        const subjectGrades = studentGrades.filter(g => g.subjectId === subject.id);
        const average = subjectGrades.length > 0 
          ? subjectGrades.reduce((sum, g) => sum + g.grade, 0) / subjectGrades.length 
          : 0;
        
        const trend = subjectGrades.length >= 2 
          ? subjectGrades[subjectGrades.length - 1].grade - subjectGrades[0].grade
          : 0;
        
        return {
          ...subject,
          average,
          trend,
          gradeCount: subjectGrades.length,
          status: average >= 7 ? 'excellent' : average >= 6 ? 'good' : average > 0 ? 'needs_improvement' : 'no_data'
        };
      });

      // Generate personalized recommendations
      const studyPlan = generateStudyPlan(subjectAnalysis);
      const learningStyle = determineLearningStyle(subjectAnalysis);
      const prioritySubjects = getPrioritySubjects(subjectAnalysis);
      const studyTechniques = getRecommendedTechniques(subjectAnalysis, learningStyle);
      const schedule = generateStudySchedule(prioritySubjects);
      
      setRecommendations({
        student,
        subjectAnalysis,
        studyPlan,
        learningStyle,
        prioritySubjects,
        studyTechniques,
        schedule,
        overallScore: calculateOverallScore(subjectAnalysis),
        strengths: identifyStrengths(subjectAnalysis),
        weaknesses: identifyWeaknesses(subjectAnalysis)
      });
      
      addNotification({
        type: 'success',
        title: 'Recomendações geradas',
        message: `Plano de estudos personalizado criado para ${student.name}`
      });
      
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Erro ao gerar recomendações',
        message: 'Não foi possível criar o plano de estudos'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateStudyPlan = (subjects) => {
    const plan = [];
    
    subjects.forEach(subject => {
      if (subject.status === 'needs_improvement') {
        plan.push({
          subject: subject.name,
          priority: 'high',
          hoursPerWeek: 4,
          focus: 'Revisão de conceitos básicos',
          activities: [
            'Resolver exercícios fundamentais',
            'Assistir videoaulas explicativas',
            'Fazer resumos dos principais tópicos',
            'Praticar com exercícios similares às provas'
          ]
        });
      } else if (subject.status === 'good') {
        plan.push({
          subject: subject.name,
          priority: 'medium',
          hoursPerWeek: 2,
          focus: 'Aprofundamento e prática',
          activities: [
            'Resolver exercícios avançados',
            'Estudar tópicos complementares',
            'Fazer simulados'
          ]
        });
      } else if (subject.status === 'excellent') {
        plan.push({
          subject: subject.name,
          priority: 'low',
          hoursPerWeek: 1,
          focus: 'Manutenção e excelência',
          activities: [
            'Resolver questões desafiadoras',
            'Ajudar colegas (monitoria)',
            'Explorar tópicos avançados'
          ]
        });
      }
    });
    
    return plan.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  };

  const determineLearningStyle = (subjects) => {
    // Mock learning style analysis based on performance patterns
    const styles = ['visual', 'auditivo', 'cinestésico', 'leitura_escrita'];
    const randomStyle = styles[Math.floor(Math.random() * styles.length)];
    
    const styleDescriptions = {
      visual: {
        name: 'Visual',
        description: 'Aprende melhor com diagramas, mapas mentais e recursos visuais',
        techniques: ['Mapas mentais', 'Diagramas', 'Flashcards coloridos', 'Vídeos educativos']
      },
      auditivo: {
        name: 'Auditivo',
        description: 'Aprende melhor ouvindo explicações e discussões',
        techniques: ['Podcasts educativos', 'Grupos de estudo', 'Explicar em voz alta', 'Música de fundo']
      },
      cinestésico: {
        name: 'Cinestésico',
        description: 'Aprende melhor com atividades práticas e movimento',
        techniques: ['Experimentos práticos', 'Estudar caminhando', 'Manipular objetos', 'Role-playing']
      },
      leitura_escrita: {
        name: 'Leitura/Escrita',
        description: 'Aprende melhor lendo e escrevendo',
        techniques: ['Resumos escritos', 'Listas e bullet points', 'Reescrever notas', 'Textos complementares']
      }
    };
    
    return styleDescriptions[randomStyle];
  };

  const getPrioritySubjects = (subjects) => {
    return subjects
      .filter(s => s.status === 'needs_improvement' || (s.status === 'good' && s.trend < 0))
      .sort((a, b) => a.average - b.average)
      .slice(0, 3);
  };

  const getRecommendedTechniques = (subjects, learningStyle) => {
    const baseTechniques = [
      {
        name: 'Técnica Pomodoro',
        description: 'Estude por 25 minutos, descanse 5 minutos',
        icon: Clock,
        difficulty: 'Fácil'
      },
      {
        name: 'Revisão Espaçada',
        description: 'Revise o conteúdo em intervalos crescentes',
        icon: Calendar,
        difficulty: 'Médio'
      },
      {
        name: 'Método Feynman',
        description: 'Explique o conceito como se ensinasse a uma criança',
        icon: Users,
        difficulty: 'Médio'
      },
      {
        name: 'Mapas Mentais',
        description: 'Organize informações visualmente',
        icon: BarChart3,
        difficulty: 'Fácil'
      }
    ];
    
    return baseTechniques.concat(
      learningStyle.techniques.map(technique => ({
        name: technique,
        description: `Técnica recomendada para seu estilo de aprendizagem ${learningStyle.name}`,
        icon: Star,
        difficulty: 'Personalizado'
      }))
    );
  };

  const generateStudySchedule = (prioritySubjects) => {
    const weekDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const schedule = [];
    
    weekDays.forEach((day, index) => {
      const daySchedule = {
        day,
        sessions: []
      };
      
      if (index < 5) { // Weekdays
        daySchedule.sessions.push({
          time: '19:00 - 20:30',
          subject: prioritySubjects[index % prioritySubjects.length]?.name || 'Revisão Geral',
          activity: 'Estudo focado',
          duration: '1h30min'
        });
      } else { // Weekend
        daySchedule.sessions.push({
          time: '14:00 - 16:00',
          subject: 'Revisão Geral',
          activity: 'Simulados e exercícios',
          duration: '2h'
        });
      }
      
      schedule.push(daySchedule);
    });
    
    return schedule;
  };

  const calculateOverallScore = (subjects) => {
    const validSubjects = subjects.filter(s => s.average > 0);
    if (validSubjects.length === 0) return 0;
    
    const totalAverage = validSubjects.reduce((sum, s) => sum + s.average, 0) / validSubjects.length;
    return Math.round(totalAverage * 10);
  };

  const identifyStrengths = (subjects) => {
    return subjects
      .filter(s => s.status === 'excellent')
      .map(s => s.name)
      .slice(0, 3);
  };

  const identifyWeaknesses = (subjects) => {
    return subjects
      .filter(s => s.status === 'needs_improvement')
      .map(s => s.name)
      .slice(0, 3);
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'text-red-600 bg-red-100',
      medium: 'text-yellow-600 bg-yellow-100',
      low: 'text-green-600 bg-green-100'
    };
    return colors[priority] || 'text-gray-600 bg-gray-100';
  };

  const getPriorityLabel = (priority) => {
    const labels = {
      high: 'Alta',
      medium: 'Média',
      low: 'Baixa'
    };
    return labels[priority] || 'Indefinida';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-6xl h-[90vh] rounded-lg shadow-xl ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center space-x-3">
            <Lightbulb className="h-6 w-6 text-yellow-600" />
            <h2 className={`text-xl font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Recomendações Personalizadas de Estudo
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            }`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Student Selection */}
          <div className={`p-6 rounded-lg border mb-6 ${
            theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Selecionar Estudante
            </h3>
            
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    theme === 'dark' 
                      ? 'bg-gray-600 border-gray-500 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="">Escolha um estudante...</option>
                  {students.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={generateRecommendations}
                disabled={!selectedStudent || isGenerating}
                className={`px-6 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                  !selectedStudent || isGenerating
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                }`}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Gerando...</span>
                  </>
                ) : (
                  <>
                    <Lightbulb className="h-4 w-4" />
                    <span>Gerar Recomendações</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Recommendations */}
          {recommendations && (
            <div className="space-y-6">
              {/* Overview */}
              <div className={`p-6 rounded-lg border ${
                theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Perfil de {recommendations.student.name}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className={`p-4 rounded-lg text-center ${
                    theme === 'dark' ? 'bg-gray-600' : 'bg-gray-50'
                  }`}>
                    <div className="text-2xl font-bold text-blue-600">
                      {recommendations.overallScore}%
                    </div>
                    <div className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Desempenho Geral
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-lg text-center ${
                    theme === 'dark' ? 'bg-gray-600' : 'bg-gray-50'
                  }`}>
                    <div className="text-2xl font-bold text-green-600">
                      {recommendations.strengths.length}
                    </div>
                    <div className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Pontos Fortes
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-lg text-center ${
                    theme === 'dark' ? 'bg-gray-600' : 'bg-gray-50'
                  }`}>
                    <div className="text-2xl font-bold text-yellow-600">
                      {recommendations.weaknesses.length}
                    </div>
                    <div className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Áreas de Melhoria
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-lg text-center ${
                    theme === 'dark' ? 'bg-gray-600' : 'bg-gray-50'
                  }`}>
                    <div className="text-lg font-bold text-purple-600">
                      {recommendations.learningStyle.name}
                    </div>
                    <div className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Estilo de Aprendizagem
                    </div>
                  </div>
                </div>
              </div>

              {/* Study Plan */}
              <div className={`p-6 rounded-lg border ${
                theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Plano de Estudos Personalizado
                </h3>
                
                <div className="space-y-4">
                  {recommendations.studyPlan.map((plan, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${
                      theme === 'dark' ? 'border-gray-600' : 'border-gray-200'
                    }`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                          <h4 className={`font-medium ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {plan.subject}
                          </h4>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(plan.priority)}`}>
                            Prioridade {getPriorityLabel(plan.priority)}
                          </span>
                          <span className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {plan.hoursPerWeek}h/semana
                          </span>
                        </div>
                      </div>
                      
                      <p className={`text-sm mb-3 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        <strong>Foco:</strong> {plan.focus}
                      </p>
                      
                      <div className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        <strong>Atividades recomendadas:</strong>
                        <ul className="mt-2 space-y-1">
                          {plan.activities.map((activity, i) => (
                            <li key={i} className="flex items-start space-x-2">
                              <span>•</span>
                              <span>{activity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Learning Style & Techniques */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className={`p-6 rounded-lg border ${
                  theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                }`}>
                  <h3 className={`text-lg font-semibold mb-4 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Estilo de Aprendizagem
                  </h3>
                  
                  <div className={`p-4 rounded-lg mb-4 ${
                    theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-50'
                  }`}>
                    <h4 className="font-medium text-purple-600 mb-2">
                      {recommendations.learningStyle.name}
                    </h4>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {recommendations.learningStyle.description}
                    </p>
                  </div>
                  
                  <div className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <strong>Técnicas recomendadas:</strong>
                    <ul className="mt-2 space-y-1">
                      {recommendations.learningStyle.techniques.map((technique, i) => (
                        <li key={i} className="flex items-center space-x-2">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span>{technique}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className={`p-6 rounded-lg border ${
                  theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                }`}>
                  <h3 className={`text-lg font-semibold mb-4 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Técnicas de Estudo
                  </h3>
                  
                  <div className="space-y-3">
                    {recommendations.studyTechniques.slice(0, 4).map((technique, index) => {
                      const Icon = technique.icon;
                      return (
                        <div key={index} className={`p-3 rounded-lg border ${
                          theme === 'dark' ? 'border-gray-600' : 'border-gray-200'
                        }`}>
                          <div className="flex items-center space-x-3">
                            <Icon className="h-4 w-4 text-blue-600" />
                            <div>
                              <h4 className={`font-medium ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                              }`}>
                                {technique.name}
                              </h4>
                              <p className={`text-sm ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                {technique.description}
                              </p>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              theme === 'dark' ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {technique.difficulty}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Study Schedule */}
              <div className={`p-6 rounded-lg border ${
                theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Cronograma Semanal Sugerido
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendations.schedule.map((day, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${
                      theme === 'dark' ? 'border-gray-600' : 'border-gray-200'
                    }`}>
                      <h4 className={`font-medium mb-3 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {day.day}
                      </h4>
                      
                      {day.sessions.map((session, i) => (
                        <div key={i} className={`p-3 rounded-lg ${
                          theme === 'dark' ? 'bg-gray-600' : 'bg-gray-50'
                        }`}>
                          <div className="flex items-center space-x-2 mb-2">
                            <Clock className="h-4 w-4 text-blue-600" />
                            <span className={`text-sm font-medium ${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>
                              {session.time}
                            </span>
                          </div>
                          <div className={`text-sm ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            <div><strong>{session.subject}</strong></div>
                            <div>{session.activity}</div>
                            <div className={`text-xs mt-1 ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              Duração: {session.duration}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyRecommendations;
