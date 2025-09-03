import React from 'react';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

const StatisticsChart = () => {
  const { grades, getClassAverage, getAttendanceRate, getStudentsAtRisk } = useData();
  const { t } = useLanguage();
  const { theme } = useTheme();

  const classAverage = getClassAverage();
  const attendanceRate = getAttendanceRate();
  const studentsAtRisk = getStudentsAtRisk();

  // Agrupar notas por disciplina
  const subjectStats = grades.reduce((acc, grade) => {
    if (!acc[grade.subjectName]) {
      acc[grade.subjectName] = { total: 0, count: 0, grades: [] };
    }
    acc[grade.subjectName].total += grade.grade;
    acc[grade.subjectName].count += 1;
    acc[grade.subjectName].grades.push(grade.grade);
    return acc;
  }, {});

  // Calcular médias por disciplina
  const subjectAverages = Object.entries(subjectStats).map(([subject, stats]) => ({
    subject,
    average: Math.round((stats.total / stats.count) * 100) / 100,
    count: stats.count
  })).sort((a, b) => b.average - a.average);

  // Distribuição de notas
  const gradeDistribution = grades.reduce((acc, grade) => {
    if (grade.grade >= 8) acc.excellent++;
    else if (grade.grade >= 6) acc.good++;
    else if (grade.grade >= 4) acc.fair++;
    else acc.poor++;
    return acc;
  }, { excellent: 0, good: 0, fair: 0, poor: 0 });

  const totalGrades = grades.length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-4 rounded-lg shadow-sm ${
          theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <div className="text-2xl font-bold text-blue-600">{classAverage}</div>
          <div className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {t('class-average-grade')}
          </div>
        </div>
        
        <div className={`p-4 rounded-lg shadow-sm ${
          theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <div className="text-2xl font-bold text-green-600">{attendanceRate}%</div>
          <div className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {t('attendance-rate')}
          </div>
        </div>
        
        <div className={`p-4 rounded-lg shadow-sm ${
          theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <div className="text-2xl font-bold text-red-600">{studentsAtRisk.length}</div>
          <div className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {t('students-at-risk')}
          </div>
        </div>
      </div>

      {/* Grade Distribution Chart */}
      <div className={`p-4 rounded-lg shadow-sm ${
        theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Distribuição de Notas
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className={`text-sm ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Excelente (8-10)
            </span>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${(gradeDistribution.excellent / totalGrades) * 100}%` }}
                ></div>
              </div>
              <span className={`text-sm font-medium ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {gradeDistribution.excellent}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className={`text-sm ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Bom (6-7.9)
            </span>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${(gradeDistribution.good / totalGrades) * 100}%` }}
                ></div>
              </div>
              <span className={`text-sm font-medium ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {gradeDistribution.good}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className={`text-sm ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Regular (4-5.9)
            </span>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full" 
                  style={{ width: `${(gradeDistribution.fair / totalGrades) * 100}%` }}
                ></div>
              </div>
              <span className={`text-sm font-medium ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {gradeDistribution.fair}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className={`text-sm ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Insuficiente (0-3.9)
            </span>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full" 
                  style={{ width: `${(gradeDistribution.poor / totalGrades) * 100}%` }}
                ></div>
              </div>
              <span className={`text-sm font-medium ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {gradeDistribution.poor}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Desempenho por Disciplina */}
      <div className={`p-4 rounded-lg shadow-sm ${
        theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Desempenho por Disciplina
        </h3>
        <div className="space-y-3">
          {subjectAverages.slice(0, 6).map((subject, index) => (
            <div key={subject.subject} className="flex items-center justify-between">
              <span className={`text-sm ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {subject.subject}
              </span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      subject.average >= 8 ? 'bg-green-500' :
                      subject.average >= 6 ? 'bg-blue-500' :
                      subject.average >= 4 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${(subject.average / 10) * 100}%` }}
                  ></div>
                </div>
                <span className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {subject.average}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Estudantes em Risco */}
      <div className={`p-4 rounded-lg shadow-sm ${
        theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Estudantes em Risco
        </h3>
        <div className="space-y-2">
          {studentsAtRisk.slice(0, 5).map((student) => (
            <div key={student.id} className="flex items-center justify-between p-2 rounded bg-red-50 dark:bg-red-900/20">
              <span className={`text-sm ${
                theme === 'dark' ? 'text-red-300' : 'text-red-700'
              }`}>
                {student.name}
              </span>
              <span className={`text-sm font-medium ${
                theme === 'dark' ? 'text-red-400' : 'text-red-600'
              }`}>
                Média: {student.average}
              </span>
            </div>
          ))}
          {studentsAtRisk.length === 0 && (
            <div className={`text-sm text-center py-4 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Nenhum estudante em risco
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatisticsChart;
