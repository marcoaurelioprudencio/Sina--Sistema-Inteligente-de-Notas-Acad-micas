import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Plus, 
  Edit, 
  Save, 
  X, 
  User, 
  BookOpen, 
  Target, 
  Calendar,
  FileText,
  CheckCircle,
  Users
} from 'lucide-react';

const GradeForm = ({ isOpen, onClose, editingGrade = null }) => {
  const { students, subjects, addGrade, updateGrade } = useData();
  const { theme } = useTheme();
  
  const [formData, setFormData] = useState({
    studentId: editingGrade?.studentId?.toString() || '',
    subjectId: editingGrade?.subjectId?.toString() || '',
    grade: editingGrade?.grade?.toString() || '',
    attendance: editingGrade?.attendance?.toString() || '',
    type: editingGrade?.type || 'Prova',
    date: editingGrade?.date || new Date().toISOString().split('T')[0],
    notes: editingGrade?.notes || ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const gradeTypes = [
    { value: 'Prova', label: 'Prova', icon: FileText, color: 'text-red-500' },
    { value: 'Trabalho', label: 'Trabalho', icon: FileText, color: 'text-blue-500' },
    { value: 'Teste', label: 'Teste', icon: FileText, color: 'text-green-500' },
    { value: 'Projeto', label: 'Projeto', icon: FileText, color: 'text-purple-500' },
    { value: 'Participação', label: 'Participação', icon: CheckCircle, color: 'text-orange-500' }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.studentId) newErrors.studentId = 'Selecione um estudante';
    if (!formData.subjectId) newErrors.subjectId = 'Selecione uma disciplina';
    if (!formData.grade) newErrors.grade = 'Digite a nota';
    if (formData.grade && (parseFloat(formData.grade) < 0 || parseFloat(formData.grade) > 10)) {
      newErrors.grade = 'Nota deve estar entre 0 e 10';
    }
    if (!formData.attendance) newErrors.attendance = 'Digite a frequência';
    if (formData.attendance && (parseFloat(formData.attendance) < 0 || parseFloat(formData.attendance) > 100)) {
      newErrors.attendance = 'Frequência deve estar entre 0% e 100%';
    }
    if (!formData.date) newErrors.date = 'Selecione a data';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const gradeData = {
        ...formData,
        studentName: students.find(s => s.id === parseInt(formData.studentId))?.name,
        subjectName: subjects.find(s => s.id === parseInt(formData.subjectId))?.name
      };

      if (editingGrade) {
        await updateGrade(editingGrade.id, gradeData);
      } else {
        await addGrade(gradeData);
      }
      
      handleClose();
    } catch (error) {
      console.error('Erro ao salvar nota:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      studentId: '',
      subjectId: '',
      grade: '',
      attendance: '',
      type: 'Prova',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setErrors({});
    onClose();
  };

  const getGradeColor = (grade) => {
    const numGrade = parseFloat(grade);
    if (numGrade >= 8) return 'text-green-600';
    if (numGrade >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAttendanceColor = (attendance) => {
    const numAttendance = parseFloat(attendance);
    if (numAttendance >= 90) return 'text-green-600';
    if (numAttendance >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-white'
      }`}>
        
        {/* Header */}
        <div className={`p-6 border-b ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50'
              }`}>
                {editingGrade ? (
                  <Edit className="h-5 w-5 text-blue-500" />
                ) : (
                  <Plus className="h-5 w-5 text-blue-500" />
                )}
              </div>
              <div>
                <h2 className={`text-xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {editingGrade ? 'Editar Nota' : 'Nova Avaliação'}
                </h2>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {editingGrade ? 'Atualize os dados da avaliação' : 'Registre uma nova avaliação'}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Student and Subject Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Student Selection */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <User className="h-4 w-4 inline mr-2" />
                Estudante
              </label>
              <select
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  errors.studentId
                    ? 'border-red-500 focus:ring-red-500'
                    : theme === 'dark'
                    ? 'bg-gray-800 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="">Selecionar estudante</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.name} ({student.class})
                  </option>
                ))}
              </select>
              {errors.studentId && (
                <p className="text-red-500 text-sm mt-1">{errors.studentId}</p>
              )}
            </div>

            {/* Subject Selection */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <BookOpen className="h-4 w-4 inline mr-2" />
                Disciplina
              </label>
              <select
                value={formData.subjectId}
                onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  errors.subjectId
                    ? 'border-red-500 focus:ring-red-500'
                    : theme === 'dark'
                    ? 'bg-gray-800 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="">Selecionar disciplina</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
              {errors.subjectId && (
                <p className="text-red-500 text-sm mt-1">{errors.subjectId}</p>
              )}
            </div>
          </div>

          {/* Grade and Attendance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Grade Input */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <Target className="h-4 w-4 inline mr-2" />
                Nota
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.grade
                      ? 'border-red-500 focus:ring-red-500'
                      : theme === 'dark'
                      ? 'bg-gray-800 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="0.0 - 10.0"
                />
                {formData.grade && (
                  <span className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-lg font-bold ${getGradeColor(formData.grade)}`}>
                    {formData.grade}
                  </span>
                )}
              </div>
              {errors.grade && (
                <p className="text-red-500 text-sm mt-1">{errors.grade}</p>
              )}
            </div>

            {/* Attendance Input */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <Users className="h-4 w-4 inline mr-2" />
                Frequência (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.attendance}
                  onChange={(e) => setFormData({ ...formData, attendance: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.attendance
                      ? 'border-red-500 focus:ring-red-500'
                      : theme === 'dark'
                      ? 'bg-gray-800 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="0 - 100"
                />
                {formData.attendance && (
                  <span className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-lg font-bold ${getAttendanceColor(formData.attendance)}`}>
                    {formData.attendance}%
                  </span>
                )}
              </div>
              {errors.attendance && (
                <p className="text-red-500 text-sm mt-1">{errors.attendance}</p>
              )}
            </div>
          </div>

          {/* Type and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Grade Type */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Tipo de Avaliação
              </label>
              <div className="grid grid-cols-5 gap-2">
                {gradeTypes.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: type.value })}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        formData.type === type.value
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : theme === 'dark'
                          ? 'border-gray-600 hover:border-gray-500'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <IconComponent className={`h-5 w-5 mx-auto mb-1 ${type.color}`} />
                      <span className={`text-xs font-medium ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {type.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <Calendar className="h-4 w-4 inline mr-2" />
                Data da Avaliação
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  errors.date
                    ? 'border-red-500 focus:ring-red-500'
                    : theme === 'dark'
                    ? 'bg-gray-800 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date}</p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Observações (opcional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              placeholder="Adicione observações sobre a avaliação..."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className={`px-6 py-3 rounded-xl text-sm font-medium transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Salvando...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Save className="h-4 w-4" />
                  <span>{editingGrade ? 'Atualizar' : 'Salvar'}</span>
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GradeForm;
