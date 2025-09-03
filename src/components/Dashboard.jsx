import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Plus, Edit, Trash2, Search, Filter, Download, RefreshCw } from 'lucide-react';
import Sidebar from './Sidebar';
import Header from './Header';
import MetricsCards from './MetricsCards';
import QuickActions from './QuickActions';
import StatisticsChart from './StatisticsChart';
import RecentActivity from './RecentActivity';
import AIIntelligencePanel from './AIIntelligencePanel';
import AIChatInterface from './AIChatInterface';
import GradeForm from './GradeForm';
import CalendarModal from './CalendarModal';
import GeminiChat from './GeminiChat';
import { generateStudentGradesPDF, generateClassGradesPDF } from '../utils/pdfGenerator';

const Dashboard = () => {
  const navigate = useNavigate();
  const { students, subjects, grades, updateGrade, deleteGrade } = useData();
  const { t } = useLanguage();
  const { theme } = useTheme();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showGradeForm, setShowGradeForm] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [showAIChat, setShowAIChat] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const handleQuickAdd = () => {
    setEditingGrade(null);
    setShowGradeForm(true);
  };

  const handleEdit = (grade) => {
    setEditingGrade(grade);
    setShowGradeForm(true);
  };

  const handleDelete = (gradeId) => {
    if (window.confirm(t('confirm-delete-grade'))) {
      deleteGrade(gradeId);
    }
  };

  const handleCloseForm = () => {
    setShowGradeForm(false);
    setEditingGrade(null);
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'add-grade':
        handleQuickAdd();
        break;
      case 'ai-chat':
        setShowAIChat(true);
        break;
      case 'manage-students':
        navigate('/student-management');
        break;
      case 'reports':
        // Generate and download PDF report
        generateClassGradesPDF(filteredGrades);
        break;
      case 'analytics':
        // Show analytics or navigate to analytics page
        console.log('Analytics feature - to be implemented');
        break;
      case 'calendar':
        setShowCalendar(true);
        break;
      case 'export':
        // Export data functionality
        exportData();
        break;
      case 'import':
        // Import data functionality
        importData();
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const exportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Estudante,Disciplina,Nota,Tipo,Data\n"
      + filteredGrades.map(grade => 
          `${grade.studentName},${grade.subject},${grade.grade},${grade.type},${grade.date}`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "dados_sina.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const importData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.xlsx';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        alert(`Arquivo ${file.name} selecionado. Funcionalidade de importação será implementada.`);
      }
    };
    input.click();
  };

  // Filtrar dados
  const filteredGrades = grades.filter(grade => {
    const matchesSearch = 
      grade.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grade.subjectName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClass = selectedClass === 'all' || 
      students.find(s => s.id === grade.studentId)?.class === selectedClass;
    
    const matchesSubject = selectedSubject === 'all' || 
      grade.subjectId.toString() === selectedSubject;
    
    return matchesSearch && matchesClass && matchesSubject;
  });

  const getGradeColor = (grade) => {
    if (grade >= 8) return 'text-green-600';
    if (grade >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAttendanceColor = (attendance) => {
    if (attendance >= 90) return 'text-green-600';
    if (attendance >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeTypeColor = (type) => {
    const colors = {
      'Prova': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
      'Trabalho': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      'Teste': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      'Projeto': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
      'Participação': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300'
    };
    return colors[type] || colors['Prova'];
  };

  // Obter turmas únicas
  const uniqueClasses = [...new Set(students.map(s => s.class))];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      
      {/* Header */}
      <Header 
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
        onQuickAdd={handleQuickAdd}
      />
      
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Main Content */}
      <div className="lg:ml-64 pt-16">
        
        {/* Main Content Area */}
        <main className="px-6">
          
          {/* Page Title */}
          <div className="mb-2">
            <h1 className={`text-2xl font-bold mb-1 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Dashboard Principal
            </h1>
            <p className={`text-base ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Acompanhe o desempenho acadêmico dos seus estudantes
            </p>
          </div>

          {/* Metrics Cards */}
          <MetricsCards />

          {/* Quick Actions */}
          <QuickActions onAction={handleQuickAction} />

          {/* AI Intelligence Panel */}
          <AIIntelligencePanel />

          {/* Statistics Charts */}
          <StatisticsChart />

          {/* Recent Activity and Data Management */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              {/* Data Management Section */}
              <div className={`rounded-xl shadow-sm overflow-hidden ${
                theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}>
                
                {/* Section Header */}
                <div className={`px-6 py-4 border-b ${
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h3 className={`text-xl font-semibold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        Gerenciamento de Avaliações
                      </h3>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {filteredGrades.length} de {grades.length} avaliações
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={handleQuickAdd}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          theme === 'dark'
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        } shadow-lg hover:shadow-xl transform hover:scale-105`}
                      >
                        <Plus className="h-4 w-4" />
                        <span>Nova Avaliação</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Filters */}
                <div className={`px-6 py-4 border-b ${
                  theme === 'dark' ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1">
                      <div className="relative">
                        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                        <input
                          type="text"
                          placeholder="Buscar por estudante ou disciplina..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            theme === 'dark'
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Class Filter */}
                    <div className="sm:w-48">
                      <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        <option value="all">Todas as Turmas</option>
                        {uniqueClasses.map(className => (
                          <option key={className} value={className}>
                            Turma {className}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Subject Filter */}
                    <div className="sm:w-48">
                      <select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        <option value="all">Todas as Disciplinas</option>
                        {subjects.map(subject => (
                          <option key={subject.id} value={subject.id.toString()}>
                            {subject.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className={`${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                    }`}>
                      <tr>
                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                        }`}>
                          Estudante
                        </th>
                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                        }`}>
                          Disciplina
                        </th>
                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                        }`}>
                          Nota
                        </th>
                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                        }`}>
                          Tipo
                        </th>
                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                        }`}>
                          Data
                        </th>
                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                        }`}>
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${
                      theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'
                    }`}>
                      {filteredGrades.map((grade) => (
                        <tr key={grade.id} className={`${
                          theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
                        } transition-colors`}>
                          <td className={`px-6 py-4 whitespace-nowrap ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            <div>
                              <div className="font-medium">{grade.studentName}</div>
                              <div className={`text-sm ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                {students.find(s => s.id === grade.studentId)?.class}
                              </div>
                            </div>
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                          }`}>
                            {grade.subjectName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-lg font-bold ${getGradeColor(grade.grade)}`}>
                              {grade.grade}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getGradeTypeColor(grade.type)}`}>
                              {grade.type}
                            </span>
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                          }`}>
                            {new Date(grade.date).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEdit(grade)}
                                className={`p-2 rounded-lg transition-colors ${
                                  theme === 'dark'
                                    ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-900/20'
                                    : 'text-blue-600 hover:text-blue-500 hover:bg-blue-50'
                                }`}
                                title="Editar"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(grade.id)}
                                className={`p-2 rounded-lg transition-colors ${
                                  theme === 'dark'
                                    ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20'
                                    : 'text-red-600 hover:text-red-500 hover:bg-red-50'
                                }`}
                                title="Excluir"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Empty State */}
                {filteredGrades.length === 0 && (
                  <div className={`text-center py-12 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <Search className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-lg font-medium mb-2">Nenhuma avaliação encontrada</p>
                    <p className="text-sm">Tente ajustar os filtros ou adicione uma nova avaliação</p>
                  </div>
                )}
              </div>
            </div>
              
            {/* Recent Activity Sidebar */}
            <div className="lg:col-span-1">
              <RecentActivity />
            </div>
          </div>
        </main>
      </div>

      {/* Grade Form Modal */}
      <GradeForm
        isOpen={showGradeForm}
        onClose={handleCloseForm}
        editingGrade={editingGrade}
      />

      {/* Calendar Modal */}
      {showCalendar && (
        <CalendarModal
          isOpen={showCalendar}
          onClose={() => setShowCalendar(false)}
        />
      )}

      {/* Gemini Chat */}
      <GeminiChat />
    </div>
  );
};

export default Dashboard;
