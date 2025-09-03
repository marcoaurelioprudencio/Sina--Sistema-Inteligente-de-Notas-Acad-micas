import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../contexts/DataContext';
import { 
  User, 
  BookOpen, 
  TrendingUp, 
  Calendar, 
  Clock,
  Award,
  Target,
  AlertTriangle,
  CheckCircle,
  Star,
  BarChart3,
  MessageCircle,
  Bell,
  Download,
  Eye
} from 'lucide-react';

const StudentDashboard = ({ studentId = 'student_1' }) => {
  const { theme } = useTheme();
  const { students, subjects, grades } = useData();
  
  const [student, setStudent] = useState(null);
  const [studentGrades, setStudentGrades] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('current'); // current, semester, year
  const [activeTab, setActiveTab] = useState('overview'); // overview, grades, calendar, messages

  useEffect(() => {
    const currentStudent = students.find(s => s.id === studentId);
    setStudent(currentStudent);
    
    if (currentStudent) {
      const currentGrades = grades.filter(g => g.studentId === studentId);
      setStudentGrades(currentGrades);
    }
  }, [studentId, students, grades]);

  if (!student) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="flex items-center justify-center h-64">
          <div className={`text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Estudante não encontrado</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate student statistics
  const subjectStats = subjects.map(subject => {
    const subjectGrades = studentGrades.filter(g => g.subjectId === subject.id);
    const average = subjectGrades.length > 0 
      ? subjectGrades.reduce((sum, g) => sum + g.grade, 0) / subjectGrades.length 
      : 0;
    
    return {
      ...subject,
      average: average,
      totalGrades: subjectGrades.length,
      status: average >= 7 ? 'approved' : average >= 6 ? 'recovery' : average > 0 ? 'failed' : 'no-grades',
      lastGrade: subjectGrades.length > 0 ? subjectGrades[subjectGrades.length - 1] : null
    };
  });

  const overallAverage = subjectStats
    .filter(s => s.average > 0)
    .reduce((sum, s) => sum + s.average, 0) / subjectStats.filter(s => s.average > 0).length || 0;

  const approvedSubjects = subjectStats.filter(s => s.status === 'approved').length;
  const atRiskSubjects = subjectStats.filter(s => s.status === 'recovery' || s.status === 'failed').length;

  // Mock upcoming events
  const upcomingEvents = [
    {
      id: 1,
      title: 'Prova de Matemática',
      subject: 'Matemática',
      date: '2025-01-20',
      time: '08:00',
      type: 'exam'
    },
    {
      id: 2,
      title: 'Entrega de Trabalho - História',
      subject: 'História',
      date: '2025-01-22',
      time: '23:59',
      type: 'assignment'
    },
    {
      id: 3,
      title: 'Apresentação de Projeto',
      subject: 'Ciências',
      date: '2025-01-25',
      time: '14:00',
      type: 'presentation'
    }
  ];

  // Mock recent notifications
  const recentNotifications = [
    {
      id: 1,
      title: 'Nova nota lançada',
      message: 'Matemática - Prova: 8.5',
      time: '2h atrás',
      type: 'grade'
    },
    {
      id: 2,
      title: 'Lembrete de entrega',
      message: 'Trabalho de História vence amanhã',
      time: '1d atrás',
      type: 'reminder'
    },
    {
      id: 3,
      title: 'Mensagem do professor',
      message: 'Prof. Silva enviou uma mensagem',
      time: '2d atrás',
      type: 'message'
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      approved: 'text-green-600 bg-green-100',
      recovery: 'text-yellow-600 bg-yellow-100',
      failed: 'text-red-600 bg-red-100',
      'no-grades': 'text-gray-600 bg-gray-100'
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  };

  const getStatusLabel = (status) => {
    const labels = {
      approved: 'Aprovado',
      recovery: 'Recuperação',
      failed: 'Reprovado',
      'no-grades': 'Sem Notas'
    };
    return labels[status] || 'Indefinido';
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'blue' }) => (
    <div className={`p-4 rounded-lg border ${
      theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg bg-${color}-100`}>
          <Icon className={`h-5 w-5 text-${color}-600`} />
        </div>
        <div>
          <div className={`text-2xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {value}
          </div>
          <div className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {title}
          </div>
          {subtitle && (
            <div className={`text-xs mt-1 ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
            }`}>
              {subtitle}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`border-b ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                theme === 'dark' ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600'
              }`}>
                <User className="h-6 w-6" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Olá, {student.name}!
                </h1>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Bem-vindo ao seu painel acadêmico
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className={`p-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'hover:bg-gray-700 text-gray-400'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}>
                <Bell className="h-5 w-5" />
              </button>
              <button className={`p-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'hover:bg-gray-700 text-gray-400'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}>
                <MessageCircle className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={`border-b ${
        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { key: 'overview', label: 'Visão Geral', icon: BarChart3 },
              { key: 'grades', label: 'Notas', icon: BookOpen },
              { key: 'calendar', label: 'Calendário', icon: Calendar },
              { key: 'messages', label: 'Mensagens', icon: MessageCircle }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                  activeTab === key
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent hover:text-gray-700'
                } ${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600'}`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={BarChart3}
                title="Média Geral"
                value={overallAverage.toFixed(1)}
                subtitle={`${approvedSubjects} disciplinas aprovadas`}
                color="blue"
              />
              <StatCard
                icon={Award}
                title="Disciplinas Aprovadas"
                value={approvedSubjects}
                subtitle={`de ${subjects.length} disciplinas`}
                color="green"
              />
              <StatCard
                icon={AlertTriangle}
                title="Disciplinas em Risco"
                value={atRiskSubjects}
                subtitle="Precisam de atenção"
                color="yellow"
              />
              <StatCard
                icon={Target}
                title="Frequência Média"
                value="92%"
                subtitle="Acima da média"
                color="purple"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Performance by Subject */}
              <div className={`p-6 rounded-lg border ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Desempenho por Disciplina
                </h3>
                
                <div className="space-y-3">
                  {subjectStats.slice(0, 6).map(subject => (
                    <div key={subject.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <BookOpen className="h-4 w-4 text-gray-500" />
                        <span className={`text-sm ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {subject.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-medium ${
                          subject.average >= 7 ? 'text-green-600' : 
                          subject.average >= 6 ? 'text-yellow-600' : 
                          subject.average > 0 ? 'text-red-600' : 'text-gray-500'
                        }`}>
                          {subject.average > 0 ? subject.average.toFixed(1) : '-'}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(subject.status)}`}>
                          {getStatusLabel(subject.status)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Events */}
              <div className={`p-6 rounded-lg border ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Próximos Eventos
                </h3>
                
                <div className="space-y-3">
                  {upcomingEvents.map(event => (
                    <div key={event.id} className={`p-3 rounded-lg border ${
                      theme === 'dark' ? 'border-gray-600' : 'border-gray-200'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className={`font-medium ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {event.title}
                          </h4>
                          <p className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {event.subject}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-medium ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            {new Date(event.date).toLocaleDateString('pt-BR')}
                          </div>
                          <div className={`text-xs ${
                            theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                          }`}>
                            {event.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className={`p-6 rounded-lg border ${
              theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Atividade Recente
              </h3>
              
              <div className="space-y-3">
                {recentNotifications.map(notification => (
                  <div key={notification.id} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${
                      notification.type === 'grade' ? 'bg-green-100 text-green-600' :
                      notification.type === 'reminder' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {notification.type === 'grade' ? <Award className="h-3 w-3" /> :
                       notification.type === 'reminder' ? <Clock className="h-3 w-3" /> :
                       <MessageCircle className="h-3 w-3" />}
                    </div>
                    <div className="flex-1">
                      <h4 className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {notification.title}
                      </h4>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {notification.message}
                      </p>
                    </div>
                    <span className={`text-xs ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      {notification.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'grades' && (
          <div className="space-y-6">
            {/* Period Selector */}
            <div className="flex items-center justify-between">
              <h2 className={`text-xl font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Minhas Notas
              </h2>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className={`px-4 py-2 rounded-lg border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="current">Período Atual</option>
                <option value="semester">Semestre</option>
                <option value="year">Ano Letivo</option>
              </select>
            </div>

            {/* Grades Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjectStats.map(subject => (
                <div key={subject.id} className={`p-6 rounded-lg border ${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`font-semibold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {subject.name}
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(subject.status)}`}>
                      {getStatusLabel(subject.status)}
                    </span>
                  </div>
                  
                  <div className="text-center mb-4">
                    <div className={`text-3xl font-bold ${
                      subject.average >= 7 ? 'text-green-600' : 
                      subject.average >= 6 ? 'text-yellow-600' : 
                      subject.average > 0 ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      {subject.average > 0 ? subject.average.toFixed(1) : '-'}
                    </div>
                    <div className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Média Atual
                    </div>
                  </div>
                  
                  <div className={`text-center text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {subject.totalGrades} avaliação(ões)
                  </div>
                  
                  {subject.lastGrade && (
                    <div className={`mt-3 pt-3 border-t text-center ${
                      theme === 'dark' ? 'border-gray-600' : 'border-gray-200'
                    }`}>
                      <div className={`text-xs ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        Última nota: {subject.lastGrade.grade}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="space-y-6">
            <h2 className={`text-xl font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Meu Calendário
            </h2>
            
            <div className={`p-8 rounded-lg border text-center ${
              theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <Calendar className={`h-16 w-16 mx-auto mb-4 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Calendário em desenvolvimento
              </p>
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="space-y-6">
            <h2 className={`text-xl font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Minhas Mensagens
            </h2>
            
            <div className={`p-8 rounded-lg border text-center ${
              theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <MessageCircle className={`h-16 w-16 mx-auto mb-4 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Sistema de mensagens em desenvolvimento
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
