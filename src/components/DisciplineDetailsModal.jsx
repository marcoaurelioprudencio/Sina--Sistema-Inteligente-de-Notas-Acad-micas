import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  X, 
  Users, 
  TrendingUp, 
  Calendar,
  Filter,
  Download,
  BookOpen,
  Award,
  AlertTriangle,
  Search,
  SortAsc,
  SortDesc,
  BarChart3,
  CheckSquare,
  Square,
  Mail,
  Eye
} from 'lucide-react';
import AnalyticsPanel from './AnalyticsPanel';

const DisciplineDetailsModal = ({ isOpen, onClose, subjectId }) => {
  const { students, subjects, grades } = useData();
  const { theme } = useTheme();
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name'); // name, average, class, status
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedStudents, setSelectedStudents] = useState(new Set());
  const [showAnalytics, setShowAnalytics] = useState(false);

  if (!isOpen || !subjectId) return null;

  const subject = subjects.find(s => s.id === subjectId);
  if (!subject) return null;

  // Get all grades for this subject
  const subjectGrades = grades.filter(g => g.subjectId === subjectId);
  
  // Get students enrolled in this subject with their grades
  const studentsWithGrades = useMemo(() => {
    return students.map(student => {
      const studentGrades = subjectGrades.filter(g => g.studentId === student.id);
      const averageGrade = studentGrades.length > 0 
        ? studentGrades.reduce((sum, g) => sum + g.grade, 0) / studentGrades.length 
        : null;
      
      return {
        ...student,
        grades: studentGrades,
        averageGrade,
        totalGrades: studentGrades.length,
        status: averageGrade === null ? 'no-grades' : 
                averageGrade >= 6 ? 'passed' : 
                averageGrade >= 4 ? 'at-risk' : 'failed'
      };
    }).filter(student => student.grades.length > 0 || filterType === 'all');
  }, [students, subjectGrades, filterType]);

  // Get unique classes
  const uniqueClasses = [...new Set(studentsWithGrades.map(s => s.class))].sort();

  // Filter and sort students
  const filteredStudents = useMemo(() => {
    let filtered = studentsWithGrades.filter(student => {
      // Filter by status
      const statusMatch = filterType === 'all' || student.status === filterType;
      
      // Filter by search term
      const searchMatch = searchTerm === '' || 
        student.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by class
      const classMatch = selectedClass === 'all' || student.class === selectedClass;
      
      return statusMatch && searchMatch && classMatch;
    });

    // Sort students
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'average':
          aValue = a.averageGrade || 0;
          bValue = b.averageGrade || 0;
          break;
        case 'class':
          aValue = a.class;
          bValue = b.class;
          break;
        case 'status':
          const statusOrder = { 'failed': 0, 'at-risk': 1, 'passed': 2, 'no-grades': 3 };
          aValue = statusOrder[a.status];
          bValue = statusOrder[b.status];
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [studentsWithGrades, filterType, searchTerm, selectedClass, sortBy, sortOrder]);

  const getGradeColor = (grade) => {
    if (grade >= 8) return 'text-green-600 bg-green-100 dark:bg-green-900/20';
    if (grade >= 6) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
    return 'text-red-600 bg-red-100 dark:bg-red-900/20';
  };

  const getStatusBadge = (status) => {
    const badges = {
      'passed': { color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300', label: 'Aprovado' },
      'failed': { color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300', label: 'Reprovado' },
      'at-risk': { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300', label: 'Em Risco' },
      'no-grades': { color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300', label: 'Sem Notas' }
    };
    return badges[status] || badges['no-grades'];
  };

  // Utility functions
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const toggleStudentSelection = (studentId) => {
    const newSelection = new Set(selectedStudents);
    if (newSelection.has(studentId)) {
      newSelection.delete(studentId);
    } else {
      newSelection.add(studentId);
    }
    setSelectedStudents(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedStudents.size === filteredStudents.length) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(new Set(filteredStudents.map(s => s.id)));
    }
  };

  const exportStudentGrades = () => {
    const studentsToExport = selectedStudents.size > 0 
      ? filteredStudents.filter(s => selectedStudents.has(s.id))
      : filteredStudents;
      
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Estudante,Turma,Média,Status,Total de Avaliações\n"
      + studentsToExport.map(student => 
          `${student.name},${student.class},${student.averageGrade?.toFixed(1) || 'N/A'},${getStatusBadge(student.status).label},${student.totalGrades}`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${subject.name}_notas_estudantes.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sendNotificationToSelected = () => {
    const selectedStudentsList = filteredStudents.filter(s => selectedStudents.has(s.id));
    alert(`Notificação enviada para ${selectedStudentsList.length} estudante(s): ${selectedStudentsList.map(s => s.name).join(', ')}`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className={`w-full max-w-6xl max-h-[90vh] rounded-xl shadow-xl overflow-hidden ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50'
            }`}>
              <BookOpen className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {subject.name}
              </h2>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {subject.area} • {filteredStudents.length} estudantes
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={exportStudentGrades}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
              title="Exportar dados"
            >
              <Download className="h-4 w-4" />
            </button>
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
        </div>

        {/* Header with filters and analytics toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className={`px-3 py-1 rounded-md border text-sm ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="all">Todos os Status</option>
                <option value="passed">Aprovados</option>
                <option value="at-risk">Em Risco</option>
                <option value="failed">Reprovados</option>
                <option value="no-grades">Sem Notas</option>
              </select>
            </div>

            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className={`px-3 py-1 rounded-md border text-sm ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="all">Todas as Turmas</option>
              {uniqueClasses.map(cls => (
                <option key={cls} value={cls}>Turma {cls}</option>
              ))}
            </select>

            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md border text-sm transition-colors ${
                showAnalytics
                  ? theme === 'dark'
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-blue-600 border-blue-500 text-white'
                  : theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar estudante..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-4 py-2 rounded-md border text-sm w-64 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className={`p-2 rounded-md border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' 
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                title={`Ordenar ${sortOrder === 'asc' ? 'decrescente' : 'crescente'}`}
              >
                {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              </button>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`px-3 py-2 rounded-md border text-sm ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="name">Nome</option>
                <option value="average">Média</option>
                <option value="class">Turma</option>
                <option value="status">Status</option>
              </select>
            </div>
          </div>
        </div>

        {/* Analytics Panel */}
        {showAnalytics && (
          <AnalyticsPanel 
            studentsWithGrades={studentsWithGrades}
            subjectGrades={subjectGrades}
            subject={subject}
          />
        )}

        {/* Bulk Actions Bar */}
        {selectedStudents.size > 0 && (
          <div className={`px-6 py-3 border-t border-b ${
            theme === 'dark' ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-blue-50'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-blue-700'
              }`}>
                {selectedStudents.size} estudante(s) selecionado(s)
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={sendNotificationToSelected}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors flex items-center space-x-1 ${
                    theme === 'dark'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <Mail className="h-3 w-3" />
                  <span>Notificar</span>
                </button>
                <button
                  onClick={exportSelectedStudents}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors flex items-center space-x-1 ${
                    theme === 'dark'
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  <Download className="h-3 w-3" />
                  <span>Exportar</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {filteredStudents.length === 0 ? (
            <div className="text-center py-8">
              <Users className={`h-12 w-12 mx-auto mb-4 ${
                theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
              }`} />
              <p className={`text-lg font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Nenhum estudante encontrado
              </p>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
              }`}>
                Tente ajustar os filtros ou adicionar notas para esta disciplina
              </p>
            </div>
          ) : (
            <>
              {/* Select All Header */}
              <div className={`flex items-center justify-between mb-4 p-3 rounded-lg ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={toggleSelectAll}
                    className="flex items-center space-x-2"
                  >
                    {selectedStudents.size === filteredStudents.length ? (
                      <CheckSquare className="h-4 w-4 text-blue-600" />
                    ) : (
                      <Square className="h-4 w-4 text-gray-500" />
                    )}
                    <span className={`text-sm font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Selecionar todos ({filteredStudents.length})
                    </span>
                  </button>
                </div>
                
                <div className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {selectedStudents.size > 0 && `${selectedStudents.size} selecionado(s)`}
                </div>
              </div>

              {/* Students List */}
              <div className="space-y-4">
                {filteredStudents.map(student => (
                  <div
                    key={student.id}
                    className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                      selectedStudents.has(student.id)
                        ? theme === 'dark' 
                          ? 'bg-blue-900/20 border-blue-600' 
                          : 'bg-blue-50 border-blue-300'
                        : theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600' 
                          : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => toggleStudentSelection(student.id)}
                          className="flex-shrink-0"
                        >
                          {selectedStudents.has(student.id) ? (
                            <CheckSquare className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Square className="h-4 w-4 text-gray-500" />
                          )}
                        </button>
                        
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {student.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                          </span>
                        </div>
                        <div>
                          <h4 className={`font-medium ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {student.name}
                          </h4>
                          <p className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            Turma {student.class}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {student.averageGrade !== null && (
                          <div className="text-center">
                            <div className={`text-lg font-bold ${getGradeColor(student.averageGrade).split(' ')[0]}`}>
                              {student.averageGrade.toFixed(1)}
                            </div>
                            <div className={`text-xs ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              Média
                            </div>
                          </div>
                        )}
                        
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(student.status).color}`}>
                          {getStatusBadge(student.status).label}
                        </span>

                        <button
                          className={`p-1 rounded transition-colors ${
                            theme === 'dark'
                              ? 'hover:bg-gray-600 text-gray-400'
                              : 'hover:bg-gray-200 text-gray-600'
                          }`}
                          title="Ver perfil completo"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Student Grades */}
                    {student.grades.length > 0 && (
                      <div>
                        <h5 className={`text-sm font-medium mb-2 ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Avaliações ({student.grades.length})
                        </h5>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                          {student.grades.map((grade, index) => (
                            <div
                              key={index}
                              className={`p-2 rounded text-center text-sm ${getGradeColor(grade.grade)}`}
                            >
                              <div className="font-bold">{grade.grade.toFixed(1)}</div>
                              <div className="text-xs opacity-75">{grade.type}</div>
                              <div className="text-xs opacity-60">{new Date(grade.date).toLocaleDateString('pt-BR')}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer Stats */}
        <div className={`px-6 py-4 border-t ${
          theme === 'dark' ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className={`text-lg font-bold ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              }`}>
                {studentsWithGrades.length}
              </div>
              <div className={`text-xs ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Total de Estudantes
              </div>
            </div>
            <div>
              <div className={`text-lg font-bold ${
                theme === 'dark' ? 'text-green-400' : 'text-green-600'
              }`}>
                {studentsWithGrades.filter(s => s.status === 'passed').length}
              </div>
              <div className={`text-xs ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Aprovados
              </div>
            </div>
            <div>
              <div className={`text-lg font-bold ${
                theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
              }`}>
                {studentsWithGrades.filter(s => s.status === 'at-risk').length}
              </div>
              <div className={`text-xs ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Em Risco
              </div>
            </div>
            <div>
              <div className={`text-lg font-bold ${
                theme === 'dark' ? 'text-red-400' : 'text-red-600'
              }`}>
                {studentsWithGrades.filter(s => s.status === 'failed').length}
              </div>
              <div className={`text-xs ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Reprovados
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisciplineDetailsModal;
