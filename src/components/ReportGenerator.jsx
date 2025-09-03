import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../contexts/DataContext';
import { 
  FileText, 
  Download, 
  Calendar, 
  Users, 
  BookOpen,
  BarChart3,
  Filter,
  X,
  Check
} from 'lucide-react';

const ReportGenerator = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const { students, subjects, grades } = useData();
  const [reportType, setReportType] = useState('student');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [dateRange, setDateRange] = useState('month');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeAnalytics, setIncludeAnalytics] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const generateStudentReport = (studentId) => {
    const student = students.find(s => s.id === studentId);
    const studentGrades = grades.filter(g => g.studentId === studentId);
    
    // Calculate student statistics
    const subjectStats = subjects.map(subject => {
      const subjectGrades = studentGrades.filter(g => g.subjectId === subject.id);
      const average = subjectGrades.length > 0 
        ? subjectGrades.reduce((sum, g) => sum + g.grade, 0) / subjectGrades.length 
        : 0;
      
      return {
        subject: subject.name,
        average: average.toFixed(1),
        totalGrades: subjectGrades.length,
        status: average >= 7 ? 'Aprovado' : average >= 6 ? 'Em Recuperação' : average > 0 ? 'Reprovado' : 'Sem Notas'
      };
    });

    const overallAverage = subjectStats
      .filter(s => s.average > 0)
      .reduce((sum, s) => sum + parseFloat(s.average), 0) / subjectStats.filter(s => s.average > 0).length;

    return {
      student,
      subjectStats,
      overallAverage: overallAverage.toFixed(1),
      totalSubjects: subjects.length,
      passedSubjects: subjectStats.filter(s => s.status === 'Aprovado').length
    };
  };

  const generateSubjectReport = (subjectId) => {
    const subject = subjects.find(s => s.id === subjectId);
    const subjectGrades = grades.filter(g => g.subjectId === subjectId);
    
    // Calculate subject statistics
    const studentStats = students.map(student => {
      const studentSubjectGrades = subjectGrades.filter(g => g.studentId === student.id);
      const average = studentSubjectGrades.length > 0 
        ? studentSubjectGrades.reduce((sum, g) => sum + g.grade, 0) / studentSubjectGrades.length 
        : 0;
      
      return {
        student: student.name,
        average: average.toFixed(1),
        totalGrades: studentSubjectGrades.length,
        status: average >= 7 ? 'Aprovado' : average >= 6 ? 'Em Recuperação' : average > 0 ? 'Reprovado' : 'Sem Notas'
      };
    });

    const classAverage = studentStats
      .filter(s => s.average > 0)
      .reduce((sum, s) => sum + parseFloat(s.average), 0) / studentStats.filter(s => s.average > 0).length;

    return {
      subject,
      studentStats,
      classAverage: classAverage.toFixed(1),
      totalStudents: students.length,
      passedStudents: studentStats.filter(s => s.status === 'Aprovado').length
    };
  };

  const generateClassReport = () => {
    const subjectAverages = subjects.map(subject => {
      const subjectGrades = grades.filter(g => g.subjectId === subject.id);
      const average = subjectGrades.length > 0 
        ? subjectGrades.reduce((sum, g) => sum + g.grade, 0) / subjectGrades.length 
        : 0;
      
      return {
        subject: subject.name,
        average: average.toFixed(1),
        totalGrades: subjectGrades.length
      };
    });

    const overallClassAverage = subjectAverages
      .filter(s => s.average > 0)
      .reduce((sum, s) => sum + parseFloat(s.average), 0) / subjectAverages.filter(s => s.average > 0).length;

    return {
      subjectAverages,
      overallClassAverage: overallClassAverage.toFixed(1),
      totalSubjects: subjects.length,
      totalStudents: students.length,
      totalGrades: grades.length
    };
  };

  const generatePDF = async () => {
    setIsGenerating(true);
    
    try {
      let reportData;
      let reportTitle;
      
      if (reportType === 'student') {
        reportData = generateStudentReport(selectedStudent);
        reportTitle = `Relatório Individual - ${reportData.student.name}`;
      } else if (reportType === 'subject') {
        reportData = generateSubjectReport(selectedSubject);
        reportTitle = `Relatório da Disciplina - ${reportData.subject.name}`;
      } else {
        reportData = generateClassReport();
        reportTitle = 'Relatório Geral da Turma';
      }

      // Create PDF content
      const pdfContent = createPDFContent(reportTitle, reportData, reportType);
      
      // Download PDF (simulated - in real implementation would use jsPDF or similar)
      const blob = new Blob([pdfContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportTitle.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      // Show success message
      alert('Relatório gerado com sucesso!');
      
    } catch (error) {
      alert('Erro ao gerar relatório: ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const createPDFContent = (title, data, type) => {
    const currentDate = new Date().toLocaleDateString('pt-BR');
    
    let content = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
        .header { text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
        .title { font-size: 24px; font-weight: bold; color: #2563eb; margin-bottom: 10px; }
        .date { color: #666; font-size: 14px; }
        .section { margin-bottom: 30px; }
        .section-title { font-size: 18px; font-weight: bold; color: #1e40af; margin-bottom: 15px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 20px; }
        .stat-card { background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #2563eb; }
        .stat-value { font-size: 24px; font-weight: bold; color: #2563eb; }
        .stat-label { color: #666; font-size: 14px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
        th { background: #f8fafc; font-weight: bold; color: #374151; }
        .status-approved { color: #059669; font-weight: bold; }
        .status-recovery { color: #d97706; font-weight: bold; }
        .status-failed { color: #dc2626; font-weight: bold; }
        .status-no-grades { color: #6b7280; font-weight: bold; }
        .footer { margin-top: 50px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #e5e7eb; padding-top: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">🎓 SINA - Sistema Inteligente de Notas Acadêmicas</div>
        <div class="title">${title}</div>
        <div class="date">Gerado em: ${currentDate}</div>
    </div>
`;

    if (type === 'student') {
      content += `
    <div class="section">
        <div class="section-title">📊 Resumo do Estudante</div>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value">${data.overallAverage}</div>
                <div class="stat-label">Média Geral</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${data.passedSubjects}/${data.totalSubjects}</div>
                <div class="stat-label">Disciplinas Aprovadas</div>
            </div>
        </div>
    </div>
    
    <div class="section">
        <div class="section-title">📚 Desempenho por Disciplina</div>
        <table>
            <thead>
                <tr>
                    <th>Disciplina</th>
                    <th>Média</th>
                    <th>Avaliações</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${data.subjectStats.map(stat => `
                <tr>
                    <td>${stat.subject}</td>
                    <td>${stat.average}</td>
                    <td>${stat.totalGrades}</td>
                    <td class="status-${stat.status.toLowerCase().replace(' ', '-')}">${stat.status}</td>
                </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
`;
    } else if (type === 'subject') {
      content += `
    <div class="section">
        <div class="section-title">📊 Resumo da Disciplina</div>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value">${data.classAverage}</div>
                <div class="stat-label">Média da Turma</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${data.passedStudents}/${data.totalStudents}</div>
                <div class="stat-label">Estudantes Aprovados</div>
            </div>
        </div>
    </div>
    
    <div class="section">
        <div class="section-title">👥 Desempenho dos Estudantes</div>
        <table>
            <thead>
                <tr>
                    <th>Estudante</th>
                    <th>Média</th>
                    <th>Avaliações</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${data.studentStats.map(stat => `
                <tr>
                    <td>${stat.student}</td>
                    <td>${stat.average}</td>
                    <td>${stat.totalGrades}</td>
                    <td class="status-${stat.status.toLowerCase().replace(' ', '-')}">${stat.status}</td>
                </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
`;
    } else {
      content += `
    <div class="section">
        <div class="section-title">📊 Resumo Geral</div>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value">${data.overallClassAverage}</div>
                <div class="stat-label">Média Geral da Turma</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${data.totalStudents}</div>
                <div class="stat-label">Total de Estudantes</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${data.totalSubjects}</div>
                <div class="stat-label">Total de Disciplinas</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${data.totalGrades}</div>
                <div class="stat-label">Total de Avaliações</div>
            </div>
        </div>
    </div>
    
    <div class="section">
        <div class="section-title">📚 Desempenho por Disciplina</div>
        <table>
            <thead>
                <tr>
                    <th>Disciplina</th>
                    <th>Média da Turma</th>
                    <th>Total de Avaliações</th>
                </tr>
            </thead>
            <tbody>
                ${data.subjectAverages.map(avg => `
                <tr>
                    <td>${avg.subject}</td>
                    <td>${avg.average}</td>
                    <td>${avg.totalGrades}</td>
                </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
`;
    }

    content += `
    <div class="footer">
        <p>Relatório gerado automaticamente pelo SINA - Sistema Inteligente de Notas Acadêmicas</p>
        <p>Data de geração: ${currentDate}</p>
    </div>
</body>
</html>
`;

    return content;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-2xl rounded-lg shadow-xl ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-blue-600" />
            <h2 className={`text-xl font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Gerar Relatório PDF
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

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Report Type Selection */}
          <div>
            <label className={`block text-sm font-medium mb-3 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Tipo de Relatório
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'student', label: 'Estudante', icon: Users },
                { value: 'subject', label: 'Disciplina', icon: BookOpen },
                { value: 'class', label: 'Turma Geral', icon: BarChart3 }
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setReportType(value)}
                  className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center space-y-2 ${
                    reportType === value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : theme === 'dark'
                        ? 'border-gray-600 hover:border-gray-500'
                        : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${
                    reportType === value ? 'text-blue-600' : 'text-gray-500'
                  }`} />
                  <span className={`text-sm font-medium ${
                    reportType === value 
                      ? 'text-blue-600' 
                      : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Conditional Selectors */}
          {reportType === 'student' && (
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Selecionar Estudante
              </label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className={`w-full px-3 py-2 rounded-md border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
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
          )}

          {reportType === 'subject' && (
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Selecionar Disciplina
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className={`w-full px-3 py-2 rounded-md border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="">Escolha uma disciplina...</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Options */}
          <div className="space-y-4">
            <h3 className={`text-sm font-medium ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Opções do Relatório
            </h3>
            
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={includeCharts}
                  onChange={(e) => setIncludeCharts(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className={`text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Incluir gráficos e visualizações
                </span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={includeAnalytics}
                  onChange={(e) => setIncludeAnalytics(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className={`text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Incluir análises e insights
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-end space-x-3 p-6 border-t ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            Cancelar
          </button>
          <button
            onClick={generatePDF}
            disabled={isGenerating || (reportType === 'student' && !selectedStudent) || (reportType === 'subject' && !selectedSubject)}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
              isGenerating || (reportType === 'student' && !selectedStudent) || (reportType === 'subject' && !selectedSubject)
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Gerando...</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                <span>Gerar PDF</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportGenerator;
