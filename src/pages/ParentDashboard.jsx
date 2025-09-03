import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../contexts/DataContext';
import { 
  Users, BookOpen, TrendingUp, Calendar, Clock, Award, AlertTriangle,
  CheckCircle, MessageCircle, Bell, Download, User, BarChart3, Target,
  Star, Phone, Mail, MapPin
} from 'lucide-react';

const ParentDashboard = ({ parentId = 'parent_1', childrenIds = ['student_1', 'student_2'] }) => {
  const { theme } = useTheme();
  const { students, subjects, grades } = useData();
  
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const parentChildren = students.filter(s => childrenIds.includes(s.id));
    setChildren(parentChildren);
    if (parentChildren.length > 0 && !selectedChild) {
      setSelectedChild(parentChildren[0]);
    }
  }, [students, childrenIds, selectedChild]);

  const getChildStats = (child) => {
    if (!child) return null;

    const childGrades = grades.filter(g => g.studentId === child.id);
    const subjectStats = subjects.map(subject => {
      const subjectGrades = childGrades.filter(g => g.subjectId === subject.id);
      const average = subjectGrades.length > 0 
        ? subjectGrades.reduce((sum, g) => sum + g.grade, 0) / subjectGrades.length 
        : 0;
      
      return {
        ...subject,
        average: average,
        totalGrades: subjectGrades.length,
        status: average >= 7 ? 'approved' : average >= 6 ? 'recovery' : average > 0 ? 'failed' : 'no-grades'
      };
    });

    const overallAverage = subjectStats
      .filter(s => s.average > 0)
      .reduce((sum, s) => sum + s.average, 0) / subjectStats.filter(s => s.average > 0).length || 0;

    return {
      child,
      subjectStats,
      overallAverage,
      approvedSubjects: subjectStats.filter(s => s.status === 'approved').length,
      atRiskSubjects: subjectStats.filter(s => s.status === 'recovery' || s.status === 'failed').length,
      totalSubjects: subjects.length
    };
  };

  const currentChildStats = getChildStats(selectedChild);

  const upcomingEvents = [
    {
      id: 1,
      title: 'Reunião de Pais e Mestres',
      date: '2025-01-25',
      time: '19:00',
      location: 'Auditório Principal'
    },
    {
      id: 2,
      title: 'Entrega de Boletim',
      date: '2025-01-30',
      time: '08:00',
      location: 'Secretaria'
    }
  ];

  const recentCommunications = [
    {
      id: 1,
      from: 'Prof. Silva - Matemática',
      subject: 'Desempenho do seu filho',
      preview: 'Gostaria de conversar sobre o progresso...',
      date: '2025-01-15',
      read: false
    },
    {
      id: 2,
      from: 'Coordenação Pedagógica',
      subject: 'Reunião de Pais',
      preview: 'Convite para reunião no dia 25/01...',
      date: '2025-01-14',
      read: true
    }
  ];

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

  if (children.length === 0) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="flex items-center justify-center h-64">
          <div className={`text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum filho encontrado</p>
          </div>
        </div>
      </div>
    );
  }

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
                theme === 'dark' ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-600'
              }`}>
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Portal dos Pais
                </h1>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Acompanhe o desenvolvimento acadêmico
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={selectedChild?.id || ''}
                onChange={(e) => {
                  const child = children.find(c => c.id === e.target.value);
                  setSelectedChild(child);
                }}
                className={`px-4 py-2 rounded-lg border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                {children.map(child => (
                  <option key={child.id} value={child.id}>
                    {child.name}
                  </option>
                ))}
              </select>
              
              <button className={`p-2 rounded-lg transition-colors relative ${
                theme === 'dark'
                  ? 'hover:bg-gray-700 text-gray-400'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}>
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  3
                </span>
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
              { key: 'attendance', label: 'Frequência', icon: Clock },
              { key: 'communication', label: 'Comunicação', icon: MessageCircle }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                  activeTab === key
                    ? 'border-purple-600 text-purple-600'
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
        {activeTab === 'overview' && currentChildStats && (
          <div className="space-y-8">
            {/* Student Info */}
            <div className={`p-6 rounded-lg border ${
              theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  theme === 'dark' ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600'
                }`}>
                  <User className="h-8 w-8" />
                </div>
                <div>
                  <h2 className={`text-xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {selectedChild.name}
                  </h2>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Turma: 3º Ano A • Matrícula: {selectedChild.id.toUpperCase()}
                  </p>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={BarChart3}
                title="Média Geral"
                value={currentChildStats.overallAverage.toFixed(1)}
                subtitle={`${currentChildStats.approvedSubjects} disciplinas aprovadas`}
                color="blue"
              />
              <StatCard
                icon={Award}
                title="Disciplinas Aprovadas"
                value={currentChildStats.approvedSubjects}
                subtitle={`de ${currentChildStats.totalSubjects} disciplinas`}
                color="green"
              />
              <StatCard
                icon={AlertTriangle}
                title="Disciplinas em Risco"
                value={currentChildStats.atRiskSubjects}
                subtitle="Precisam de atenção"
                color="yellow"
              />
              <StatCard
                icon={Clock}
                title="Frequência"
                value="94%"
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
                  {currentChildStats.subjectStats.slice(0, 6).map(subject => (
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
                      <h4 className={`font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {event.title}
                      </h4>
                      <div className={`text-sm mt-1 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        <div>{new Date(event.date).toLocaleDateString('pt-BR')} - {event.time}</div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Communications */}
            <div className={`p-6 rounded-lg border ${
              theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Comunicações Recentes
              </h3>
              
              <div className="space-y-3">
                {recentCommunications.map(comm => (
                  <div key={comm.id} className={`flex items-start space-x-3 p-3 rounded-lg ${
                    !comm.read ? (theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50') : ''
                  }`}>
                    <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                      <MessageCircle className="h-3 w-3" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-sm font-medium ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {comm.from}
                        </h4>
                        <span className={`text-xs ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                        }`}>
                          {new Date(comm.date).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <p className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {comm.subject}
                      </p>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {comm.preview}
                      </p>
                    </div>
                    {!comm.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Other tabs content */}
        {activeTab !== 'overview' && (
          <div className={`p-8 rounded-lg border text-center ${
            theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>Conteúdo da aba {activeTab} em desenvolvimento</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentDashboard;
