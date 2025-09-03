import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  BarChart3,
  Calendar,
  Target,
  Award,
  AlertCircle
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import DisciplineDetailsModal from '../components/DisciplineDetailsModal';

const DisciplinesPage = () => {
  const { students, subjects, grades } = useData();
  const { theme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Calculate statistics for each subject
  const getSubjectStats = (subjectId) => {
    const subjectGrades = grades.filter(g => g.subjectId === subjectId);
    const totalStudents = students.length;
    const studentsWithGrades = new Set(subjectGrades.map(g => g.studentId)).size;
    const averageGrade = subjectGrades.length > 0 
      ? subjectGrades.reduce((sum, g) => sum + g.grade, 0) / subjectGrades.length 
      : 0;
    
    const passedStudents = subjectGrades.filter(g => g.grade >= 6).length;
    const passRate = subjectGrades.length > 0 ? (passedStudents / subjectGrades.length) * 100 : 0;
    
    const atRiskStudents = subjectGrades.filter(g => g.grade < 6).length;
    
    return {
      totalStudents,
      studentsWithGrades,
      averageGrade,
      passRate,
      atRiskStudents,
      totalEvaluations: subjectGrades.length
    };
  };

  const getGradeColor = (grade) => {
    if (grade >= 8) return 'text-green-600';
    if (grade >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPassRateColor = (rate) => {
    if (rate >= 80) return 'text-green-600 bg-green-100 dark:bg-green-900/20';
    if (rate >= 60) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
    return 'text-red-600 bg-red-100 dark:bg-red-900/20';
  };

  const handleViewDetails = (subjectId) => {
    setSelectedSubjectId(subjectId);
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedSubjectId(null);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      
      {/* Header */}
      <Header 
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
        onQuickAdd={() => {}}
      />
      
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Main Content */}
      <div className="lg:ml-64 pt-16">
        {/* Main Content Area */}
        <main className="px-6 p-6">
          
          {/* Page Title */}
          <div className="mb-6">
            <h1 className={`text-3xl font-bold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Disciplinas
            </h1>
            <p className={`text-lg ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Gerencie e acompanhe o desempenho por disciplina
            </p>
          </div>

          {/* Subjects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => {
              const stats = getSubjectStats(subject.id);
              
              return (
                <div
                  key={subject.id}
                  className={`rounded-xl shadow-sm overflow-hidden border transition-all hover:shadow-md ${
                    theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }`}
                >
                  {/* Subject Header */}
                  <div className={`p-6 border-b ${
                    theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-lg ${
                        theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50'
                      }`}>
                        <BookOpen className="h-6 w-6 text-blue-500" />
                      </div>
                      <div>
                        <h3 className={`text-lg font-semibold ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {subject.name}
                        </h3>
                        <p className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {subject.area}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Subject Stats */}
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {/* Average Grade */}
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${getGradeColor(stats.averageGrade)}`}>
                          {stats.averageGrade.toFixed(1)}
                        </div>
                        <div className={`text-xs ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          Média Geral
                        </div>
                      </div>

                      {/* Pass Rate */}
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${getPassRateColor(stats.passRate).split(' ')[0]}`}>
                          {stats.passRate.toFixed(0)}%
                        </div>
                        <div className={`text-xs ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          Taxa de Aprovação
                        </div>
                      </div>
                    </div>

                    {/* Detailed Stats */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span className={`text-sm ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            Estudantes
                          </span>
                        </div>
                        <span className={`text-sm font-medium ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {stats.studentsWithGrades}/{stats.totalStudents}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <BarChart3 className="h-4 w-4 text-gray-500" />
                          <span className={`text-sm ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            Avaliações
                          </span>
                        </div>
                        <span className={`text-sm font-medium ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {stats.totalEvaluations}
                        </span>
                      </div>

                      {stats.atRiskStudents > 0 && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <AlertCircle className="h-4 w-4 text-red-500" />
                            <span className={`text-sm ${
                              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                              Em Risco
                            </span>
                          </div>
                          <span className="text-sm font-medium text-red-600">
                            {stats.atRiskStudents}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewDetails(subject.id)}
                          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            theme === 'dark'
                              ? 'bg-blue-600 hover:bg-blue-700 text-white'
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
                          }`}
                        >
                          Ver Detalhes
                        </button>
                        <button className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          theme === 'dark'
                            ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}>
                          Relatório
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Section */}
          <div className={`mt-8 rounded-xl shadow-sm overflow-hidden ${
            theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            <div className={`px-6 py-4 border-b ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h3 className={`text-lg font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Resumo Geral das Disciplinas
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className={`text-3xl font-bold mb-2 ${
                    theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                  }`}>
                    {subjects.length}
                  </div>
                  <div className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Total de Disciplinas
                  </div>
                </div>
                
                <div className="text-center">
                  <div className={`text-3xl font-bold mb-2 ${
                    theme === 'dark' ? 'text-green-400' : 'text-green-600'
                  }`}>
                    {(subjects.reduce((sum, subject) => {
                      const stats = getSubjectStats(subject.id);
                      return sum + stats.averageGrade;
                    }, 0) / subjects.length).toFixed(1)}
                  </div>
                  <div className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Média Geral
                  </div>
                </div>
                
                <div className="text-center">
                  <div className={`text-3xl font-bold mb-2 ${
                    theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
                  }`}>
                    {grades.length}
                  </div>
                  <div className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Total de Avaliações
                  </div>
                </div>
                
                <div className="text-center">
                  <div className={`text-3xl font-bold mb-2 ${
                    theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                  }`}>
                    {students.length}
                  </div>
                  <div className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Estudantes Ativos
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Discipline Details Modal */}
      <DisciplineDetailsModal
        isOpen={showDetailsModal}
        onClose={handleCloseModal}
        subjectId={selectedSubjectId}
      />
    </div>
  );
};

export default DisciplinesPage;
