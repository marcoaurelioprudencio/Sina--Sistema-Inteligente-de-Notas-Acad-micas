import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Plus, Search, Edit, Trash2, Eye, UserPlus, Mail, BookOpen, Calendar } from 'lucide-react';

const StudentManagement = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add', 'edit', 'view'
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    class: '',
    id: '',
    status: 'active'
  });

  // Sample data - In a real app, this would come from an API
  useEffect(() => {
    const sampleStudents = [
      { id: '001', name: 'João', email: 'joao@email.com', class: '5A', status: 'active', enrollmentDate: '2024-02-01', grades: {} },
      { id: '002', name: 'Maria', email: 'maria@email.com', class: '5A', status: 'active', enrollmentDate: '2024-02-01', grades: {} },
      { id: '003', name: 'Pedro', email: 'pedro@email.com', class: '5A', status: 'active', enrollmentDate: '2024-02-01', grades: {} },
      { id: '004', name: 'Ana', email: 'ana@email.com', class: '5A', status: 'active', enrollmentDate: '2024-02-01', grades: {} },
      { id: '005', name: 'Lucas', email: 'lucas@email.com', class: '5A', status: 'active', enrollmentDate: '2024-02-01', grades: {} },
      { id: '006', name: 'Laura', email: 'laura@email.com', class: '5A', status: 'active', enrollmentDate: '2024-02-01', grades: {} },
      { id: '007', name: 'Gabriel', email: 'gabriel@email.com', class: '5A', status: 'active', enrollmentDate: '2024-02-01', grades: {} },
      { id: '008', name: 'Julia', email: 'julia@email.com', class: '5A', status: 'active', enrollmentDate: '2024-02-01', grades: {} },
      { id: '009', name: 'Matheus', email: 'matheus@email.com', class: '5A', status: 'active', enrollmentDate: '2024-02-01', grades: {} },
      { id: '010', name: 'Beatriz', email: 'beatriz@email.com', class: '5A', status: 'active', enrollmentDate: '2024-02-01', grades: {} },
      { id: '011', name: 'Thiago', email: 'thiago@email.com', class: '5A', status: 'active', enrollmentDate: '2024-02-01', grades: {} },
      { id: '012', name: 'Larissa', email: 'larissa@email.com', class: '5A', status: 'active', enrollmentDate: '2024-02-01', grades: {} },
      { id: '013', name: 'Felipe', email: 'felipe@email.com', class: '5A', status: 'active', enrollmentDate: '2024-02-01', grades: {} },
      { id: '014', name: 'Amanda', email: 'amanda@email.com', class: '5A', status: 'active', enrollmentDate: '2024-02-01', grades: {} },
      { id: '015', name: 'Matias', email: 'matias@email.com', class: '5A', status: 'active', enrollmentDate: '2024-02-01', grades: {} },
    ];
    
    const savedStudents = localStorage.getItem('sina-students');
    if (savedStudents) {
      setStudents(JSON.parse(savedStudents));
    } else {
      setStudents(sampleStudents);
      localStorage.setItem('sina-students', JSON.stringify(sampleStudents));
    }
  }, []);

  const saveStudents = (newStudents) => {
    setStudents(newStudents);
    localStorage.setItem('sina-students', JSON.stringify(newStudents));
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (type, student = null) => {
    setModalType(type);
    setSelectedStudent(student);
    if (student) {
      setFormData({
        name: student.name,
        email: student.email,
        class: student.class,
        id: student.id,
        status: student.status
      });
    } else {
      setFormData({
        name: '',
        email: '',
        class: '',
        id: '',
        status: 'active'
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
    setFormData({
      name: '',
      email: '',
      class: '',
      id: '',
      status: 'active'
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (modalType === 'add') {
      const newStudent = {
        ...formData,
        id: formData.id || Date.now().toString(),
        enrollmentDate: new Date().toISOString().split('T')[0],
        grades: { mathematics: 0, portuguese: 0, science: 0 }
      };
      const newStudents = [...students, newStudent];
      saveStudents(newStudents);
    } else if (modalType === 'edit') {
      const updatedStudents = students.map(student =>
        student.id === selectedStudent.id
          ? { ...student, ...formData }
          : student
      );
      saveStudents(updatedStudents);
    }
    
    closeModal();
  };

  const handleDelete = (studentId) => {
    if (window.confirm(t('confirm-delete-student'))) {
      const updatedStudents = students.filter(student => student.id !== studentId);
      saveStudents(updatedStudents);
    }
  };

  const getStatusColor = (status) => {
    if (status === 'active') {
      return theme === 'dark' ? 'text-green-400 bg-green-900/20' : 'text-green-600 bg-green-100';
    }
    return theme === 'dark' ? 'text-red-400 bg-red-900/20' : 'text-red-600 bg-red-100';
  };

  return (
    <div className={`p-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} min-h-screen`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {t('student-management')}
          </h1>
          <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Gerencie estudantes, adicione novos alunos e atualize informações
          </p>
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder={t('search-students')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          {/* Add Student Button */}
          <button
            onClick={() => openModal('add')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Plus className="h-5 w-5 mr-2" />
            {t('add-student')}
          </button>
        </div>

        {/* Students Table */}
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
                    {t('email')}
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    {t('class')}
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    {t('status')}
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    {t('actions')}
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="5" className={`px-6 py-4 text-center ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {t('no-students')}
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student.id} className={theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                      <td className={`px-6 py-4 whitespace-nowrap ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        <div className="flex items-center">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            theme === 'dark' ? 'bg-blue-600' : 'bg-blue-100'
                          }`}>
                            <span className={`text-sm font-medium ${
                              theme === 'dark' ? 'text-white' : 'text-blue-600'
                            }`}>
                              {student.name.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="font-medium">{student.name}</div>
                            <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                              ID: {student.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-900'
                      }`}>
                        {student.email}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-900'
                      }`}>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          theme === 'dark' ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {student.class}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(student.status)}`}>
                          {t(student.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openModal('view', student)}
                            className={`p-1 rounded hover:bg-gray-100 ${
                              theme === 'dark' ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                            }`}
                            title={t('view')}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openModal('edit', student)}
                            className={`p-1 rounded hover:bg-gray-100 ${
                              theme === 'dark' ? 'text-blue-400 hover:bg-gray-700 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                            }`}
                            title={t('edit')}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(student.id)}
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
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl max-w-md w-full`}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {modalType === 'add' && t('add-student')}
                    {modalType === 'edit' && t('edit-student')}
                    {modalType === 'view' && t('view') + ' ' + t('student-name').toLowerCase()}
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
                      <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>{selectedStudent?.name}</p>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {t('email')}
                      </label>
                      <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>{selectedStudent?.email}</p>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {t('class')}
                      </label>
                      <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>{selectedStudent?.class}</p>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {t('status')}
                      </label>
                      <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>{t(selectedStudent?.status)}</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {t('student-name')} *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                        {t('email')} *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                        {t('class')} *
                      </label>
                      <select
                        required
                        value={formData.class}
                        onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        <option value="">{t('select-class')}</option>
                        <option value="5A">5A</option>
                        <option value="5B">5B</option>
                        <option value="5C">5C</option>
                      </select>
                    </div>

                    {modalType === 'add' && (
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {t('student-id')}
                        </label>
                        <input
                          type="text"
                          value={formData.id}
                          onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                          placeholder="Deixe em branco para gerar automaticamente"
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            theme === 'dark'
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        />
                      </div>
                    )}

                    <div>
                      <label className={`block text-sm font-medium mb-1 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {t('status')}
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        <option value="active">{t('active')}</option>
                        <option value="inactive">{t('inactive')}</option>
                      </select>
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

export default StudentManagement; 