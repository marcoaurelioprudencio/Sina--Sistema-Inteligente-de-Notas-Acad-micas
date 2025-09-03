import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Plus, Search, Edit, Trash2, Eye, BookOpen, Calendar, User, TrendingUp } from 'lucide-react';

const GradeManagement = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterStudent, setFilterStudent] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add', 'edit', 'view'
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [formData, setFormData] = useState({
    studentId: '',
    subject: '',
    gradeValue: '',
    gradeType: '',
    date: '',
    description: ''
  });

  const subjects = [
    { key: 'portuguese-language', label: t('portuguese-language') },
    { key: 'english-language', label: t('english-language') },
    { key: 'arts', label: t('arts') },
    { key: 'physical-education', label: t('physical-education') },
    { key: 'mathematics', label: t('mathematics') },
    { key: 'history', label: t('history') },
    { key: 'geography', label: t('geography') },
    { key: 'sociology', label: t('sociology') },
    { key: 'philosophy', label: t('philosophy') },
    { key: 'physics', label: t('physics') },
    { key: 'chemistry', label: t('chemistry') },
    { key: 'biology', label: t('biology') },
  ];

  const gradeTypes = [
    { key: 'exam', label: t('exam') },
    { key: 'assignment', label: t('assignment') },
    { key: 'quiz', label: t('quiz') },
    { key: 'project', label: t('project') },
    { key: 'participation', label: t('participation') }
  ];

  // Load data from localStorage
  useEffect(() => {
    // Load students
    const savedStudents = localStorage.getItem('sina-students');
    if (savedStudents) {
      setStudents(JSON.parse(savedStudents));
    }

    // Load grades or create sample data
    const savedGrades = localStorage.getItem('sina-grades');
    if (savedGrades) {
      setGrades(JSON.parse(savedGrades));
    } else {
      const sampleGrades = [
        {
          id: '1',
          studentId: '001',
          studentName: 'Ana Silva Santos',
          subject: 'mathematics',
          gradeValue: 8.5,
          gradeType: 'exam',
          date: '2024-01-15',
          description: 'Prova de álgebra básica'
        },
        {
          id: '2',
          studentId: '001',
          studentName: 'Ana Silva Santos',
          subject: 'portuguese',
          gradeValue: 9.0,
          gradeType: 'assignment',
          date: '2024-01-20',
          description: 'Redação sobre meio ambiente'
        },
        {
          id: '3',
          studentId: '002',
          studentName: 'Carlos Eduardo Lima',
          subject: 'mathematics',
          gradeValue: 7.2,
          gradeType: 'quiz',
          date: '2024-01-18',
          description: 'Teste de tabuada'
        },
        {
          id: '4',
          studentId: '003',
          studentName: 'Beatriz Oliveira Costa',
          subject: 'science',
          gradeValue: 9.3,
          gradeType: 'project',
          date: '2024-01-25',
          description: 'Projeto sobre sistema solar'
        }
      ];
      setGrades(sampleGrades);
      localStorage.setItem('sina-grades', JSON.stringify(sampleGrades));
    }
  }, []);

  const saveGrades = (newGrades) => {
    setGrades(newGrades);
    localStorage.setItem('sina-grades', JSON.stringify(newGrades));
  };

  const filteredGrades = grades.filter(grade => {
    const matchesSearch = grade.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t(grade.subject).toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grade.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = !filterSubject || grade.subject === filterSubject;
    const matchesStudent = !filterStudent || grade.studentId === filterStudent;
    
    return matchesSearch && matchesSubject && matchesStudent;
  });

  const openModal = (type, grade = null) => {
    setModalType(type);
    setSelectedGrade(grade);
    if (grade) {
      setFormData({
        studentId: grade.studentId,
        subject: grade.subject,
        gradeValue: grade.gradeValue.toString(),
        gradeType: grade.gradeType,
        date: grade.date,
        description: grade.description || ''
      });
    } else {
      setFormData({
        studentId: '',
        subject: '',
        gradeValue: '',
        gradeType: '',
        date: new Date().toISOString().split('T')[0],
        description: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedGrade(null);
    setFormData({
      studentId: '',
      subject: '',
      gradeValue: '',
      gradeType: '',
      date: new Date().toISOString().split('T')[0],
      description: ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const selectedStudent = students.find(s => s.id === formData.studentId);
    
    if (modalType === 'add') {
      const newGrade = {
        id: Date.now().toString(),
        studentId: formData.studentId,
        studentName: selectedStudent?.name || 'Unknown',
        subject: formData.subject,
        gradeValue: parseFloat(formData.gradeValue),
        gradeType: formData.gradeType,
        date: formData.date,
        description: formData.description
      };
      const newGrades = [...grades, newGrade];
      saveGrades(newGrades);
    } else if (modalType === 'edit') {
      const updatedGrades = grades.map(grade =>
        grade.id === selectedGrade.id
          ? {
              ...grade,
              studentId: formData.studentId,
              studentName: selectedStudent?.name || grade.studentName,
              subject: formData.subject,
              gradeValue: parseFloat(formData.gradeValue),
              gradeType: formData.gradeType,
              date: formData.date,
              description: formData.description
            }
          : grade
      );
      saveGrades(updatedGrades);
    }
    
    closeModal();
  };

  const handleDelete = (gradeId) => {
    if (window.confirm(t('confirm-delete-grade'))) {
      const updatedGrades = grades.filter(grade => grade.id !== gradeId);
      saveGrades(updatedGrades);
    }
  };

  const getGradeColor = (value) => {
    if (value >= 9) return theme === 'dark' ? 'text-green-400 bg-green-900/20' : 'text-green-600 bg-green-100';
    if (value >= 7) return theme === 'dark' ? 'text-blue-400 bg-blue-900/20' : 'text-blue-600 bg-blue-100';
    if (value >= 5) return theme === 'dark' ? 'text-yellow-400 bg-yellow-900/20' : 'text-yellow-600 bg-yellow-100';
    return theme === 'dark' ? 'text-red-400 bg-red-900/20' : 'text-red-600 bg-red-100';
  };

  const calculateStudentAverage = (studentId) => {
    const studentGrades = grades.filter(g => g.studentId === studentId);
    if (studentGrades.length === 0) return 0;
    const sum = studentGrades.reduce((acc, grade) => acc + grade.gradeValue, 0);
    return (sum / studentGrades.length).toFixed(1);
  };

  return (
    <div className={`p-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} min-h-screen`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {t('grade-management')}
          </h1>
          <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Gerencie notas dos estudantes, adicione avaliações e acompanhe o desempenho
          </p>
        </div>

        {/* Controls */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder={t('search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          {/* Subject Filter */}
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              theme === 'dark'
                ? 'bg-gray-800 border-gray-700 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="">Todas as disciplinas</option>
            {subjects.map(subject => (
              <option key={subject.key} value={subject.key}>{subject.label}</option>
            ))}
          </select>

          {/* Student Filter */}
          <select
            value={filterStudent}
            onChange={(e) => setFilterStudent(e.target.value)}
            className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              theme === 'dark'
                ? 'bg-gray-800 border-gray-700 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="">Todos os estudantes</option>
            {students.map(student => (
              <option key={student.id} value={student.id}>{student.name}</option>
            ))}
          </select>

          {/* Add Grade Button */}
          <button
            onClick={() => openModal('add')}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Plus className="h-5 w-5 mr-2" />
            {t('add-grade')}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow`}>
            <div className="flex items-center">
              <BookOpen className={`h-8 w-8 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
              <div className="ml-3">
                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Total de Notas
                </p>
                <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {grades.length}
                </p>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow`}>
            <div className="flex items-center">
              <TrendingUp className={`h-8 w-8 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
              <div className="ml-3">
                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Média Geral
                </p>
                <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {grades.length > 0 ? (grades.reduce((acc, g) => acc + g.gradeValue, 0) / grades.length).toFixed(1) : '0.0'}
                </p>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow`}>
            <div className="flex items-center">
              <User className={`h-8 w-8 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
              <div className="ml-3">
                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Estudantes Avaliados
                </p>
                <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {new Set(grades.map(g => g.studentId)).size}
                </p>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow`}>
            <div className="flex items-center">
              <Calendar className={`h-8 w-8 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`} />
              <div className="ml-3">
                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Este Mês
                </p>
                <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {grades.filter(g => new Date(g.date).getMonth() === new Date().getMonth()).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Grades Table */}
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    {t('student-name')}
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    {t('grade-subject')}
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    {t('grade-value')}
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    {t('grade-type')}
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    {t('date')}
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    {t('actions')}
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {filteredGrades.length === 0 ? (
                  <tr>
                    <td colSpan="6" className={`px-6 py-4 text-center ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {t('no-grades')}
                    </td>
                  </tr>
                ) : (
                  filteredGrades.map((grade) => (
                    <tr key={grade.id} className={theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                      <td className={`px-6 py-4 whitespace-nowrap ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        <div>
                          <div className="font-medium">{grade.studentName}</div>
                          <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            Média: {calculateStudentAverage(grade.studentId)}
                          </div>
                        </div>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-900'
                      }`}>
                        {t(grade.subject)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-sm font-semibold rounded-full ${getGradeColor(grade.gradeValue)}`}>
                          {grade.gradeValue.toFixed(1)}
                        </span>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-900'
                      }`}>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {t(grade.gradeType)}
                        </span>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-900'
                      }`}>
                        {new Date(grade.date).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openModal('view', grade)}
                            className={`p-1 rounded hover:bg-gray-100 ${
                              theme === 'dark' ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                            }`}
                            title={t('view')}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openModal('edit', grade)}
                            className={`p-1 rounded hover:bg-gray-100 ${
                              theme === 'dark' ? 'text-blue-400 hover:bg-gray-700 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                            }`}
                            title={t('edit')}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(grade.id)}
                            className={`p-1 rounded hover:bg-gray-100 ${
                              theme === 'dark' ? 'text-red-400 hover:bg-gray-700 hover:text-red-300' : 'text-red-600 hover:text-red-800'
                            }`}
                            title={t('delete')}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto`}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {modalType === 'add' && t('add-grade')}
                    {modalType === 'edit' && t('edit-grade')}
                    {modalType === 'view' && 'Detalhes da Nota'}
                  </h3>
                  <button
                    onClick={closeModal}
                    className={`text-gray-400 hover:text-gray-600 ${theme === 'dark' ? 'hover:text-gray-300' : ''}`}
                  >
                    ×
                  </button>
                </div>

                {modalType === 'view' ? (
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {t('student-name')}
                      </label>
                      <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>{selectedGrade?.studentName}</p>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {t('grade-subject')}
                      </label>
                      <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>{t(selectedGrade?.subject)}</p>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {t('grade-value')}
                      </label>
                      <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>{selectedGrade?.gradeValue}</p>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {t('grade-type')}
                      </label>
                      <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>{t(selectedGrade?.gradeType)}</p>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {t('date')}
                      </label>
                      <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                        {selectedGrade?.date ? new Date(selectedGrade.date).toLocaleDateString('pt-BR') : ''}
                      </p>
                    </div>
                    {selectedGrade?.description && (
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Descrição
                        </label>
                        <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>{selectedGrade.description}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {t('student-name')} *
                      </label>
                      <select
                        required
                        value={formData.studentId}
                        onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        <option value="">Selecione um estudante</option>
                        {students.map(student => (
                          <option key={student.id} value={student.id}>{student.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-1 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {t('grade-subject')} *
                      </label>
                      <select
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        <option value="">Selecione uma disciplina</option>
                        {subjects.map(subject => (
                          <option key={subject.key} value={subject.key}>{subject.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-1 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {t('grade-value')} * (0-10)
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        max="10"
                        step="0.1"
                        value={formData.gradeValue}
                        onChange={(e) => setFormData({ ...formData, gradeValue: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-1 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {t('grade-type')} *
                      </label>
                      <select
                        required
                        value={formData.gradeType}
                        onChange={(e) => setFormData({ ...formData, gradeType: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        <option value="">Selecione o tipo</option>
                        {gradeTypes.map(type => (
                          <option key={type.key} value={type.key}>{type.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-1 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {t('date')} *
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-1 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Descrição
                      </label>
                      <textarea
                        rows="3"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Descrição opcional da avaliação"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={closeModal}
                        className={`flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 ${
                          theme === 'dark'
                            ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {t('cancel')}
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        {modalType === 'add' ? t('create') : t('update')}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GradeManagement; 