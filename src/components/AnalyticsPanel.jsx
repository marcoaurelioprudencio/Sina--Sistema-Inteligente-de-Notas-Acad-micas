import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Award, 
  AlertTriangle,
  BarChart3,
  Users,
  Calendar
} from 'lucide-react';

const AnalyticsPanel = ({ studentsWithGrades, subjectGrades, subject }) => {
  const { theme } = useTheme();

  // Calculate analytics data
  const analytics = {
    totalStudents: studentsWithGrades.length,
    totalEvaluations: subjectGrades.length,
    averageGrade: subjectGrades.length > 0 
      ? subjectGrades.reduce((sum, g) => sum + g.grade, 0) / subjectGrades.length 
      : 0,
    passedStudents: studentsWithGrades.filter(s => s.status === 'passed').length,
    atRiskStudents: studentsWithGrades.filter(s => s.status === 'at-risk').length,
    failedStudents: studentsWithGrades.filter(s => s.status === 'failed').length,
    noGradesStudents: studentsWithGrades.filter(s => s.status === 'no-grades').length
  };

  // Grade distribution
  const gradeDistribution = {
    excellent: subjectGrades.filter(g => g.grade >= 9).length,
    good: subjectGrades.filter(g => g.grade >= 7 && g.grade < 9).length,
    average: subjectGrades.filter(g => g.grade >= 6 && g.grade < 7).length,
    belowAverage: subjectGrades.filter(g => g.grade >= 4 && g.grade < 6).length,
    poor: subjectGrades.filter(g => g.grade < 4).length
  };

  // Performance trends (mock data - in real app would compare with historical data)
  const trends = {
    averageChange: +0.3, // +0.3 points compared to last period
    passRateChange: +5, // +5% compared to last period
    participationChange: +2 // +2 more students with grades
  };

  // Grade timeline for chart
  const gradeTimeline = subjectGrades
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .reduce((acc, grade) => {
      const month = new Date(grade.date).toLocaleDateString('pt-BR', { month: 'short' });
      if (!acc[month]) acc[month] = [];
      acc[month].push(grade.grade);
      return acc;
    }, {});

  const timelineData = Object.entries(gradeTimeline).map(([month, grades]) => ({
    month,
    average: grades.reduce((sum, g) => sum + g, 0) / grades.length,
    count: grades.length
  }));

  const StatCard = ({ icon: Icon, title, value, subtitle, trend, color = 'blue' }) => (
    <div className={`p-4 rounded-lg border ${
      theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <Icon className={`h-5 w-5 text-${color}-500`} />
        {trend !== undefined && (
          <div className={`flex items-center text-sm ${
            trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-500'
          }`}>
            {trend > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : 
             trend < 0 ? <TrendingDown className="h-3 w-3 mr-1" /> : null}
            {trend > 0 ? '+' : ''}{trend}
          </div>
        )}
      </div>
      <div className={`text-2xl font-bold mb-1 ${
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
  );

  const DistributionBar = ({ label, count, total, color }) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    
    return (
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
            {label}
          </span>
          <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            {count} ({percentage.toFixed(1)}%)
          </span>
        </div>
        <div className={`w-full bg-gray-200 rounded-full h-2 ${
          theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
        }`}>
          <div 
            className={`h-2 rounded-full bg-${color}-500`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className={`p-6 border-t ${
      theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
    }`}>
      <div className="mb-6">
        <h3 className={`text-lg font-semibold mb-2 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Analytics da Disciplina
        </h3>
        <p className={`text-sm ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Insights detalhados sobre o desempenho em {subject.name}
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={Users}
          title="Estudantes Ativos"
          value={analytics.totalStudents}
          trend={trends.participationChange}
          color="blue"
        />
        <StatCard
          icon={BarChart3}
          title="Média Geral"
          value={analytics.averageGrade.toFixed(1)}
          trend={trends.averageChange}
          color="green"
        />
        <StatCard
          icon={Award}
          title="Taxa de Aprovação"
          value={`${((analytics.passedStudents / analytics.totalStudents) * 100).toFixed(1)}%`}
          trend={trends.passRateChange}
          color="purple"
        />
        <StatCard
          icon={AlertTriangle}
          title="Estudantes em Risco"
          value={analytics.atRiskStudents + analytics.failedStudents}
          subtitle={`${analytics.atRiskStudents} em risco, ${analytics.failedStudents} reprovados`}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grade Distribution */}
        <div className={`p-4 rounded-lg border ${
          theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
        }`}>
          <h4 className={`text-md font-semibold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Distribuição de Notas
          </h4>
          
          <DistributionBar 
            label="Excelente (9.0-10.0)" 
            count={gradeDistribution.excellent} 
            total={subjectGrades.length} 
            color="green" 
          />
          <DistributionBar 
            label="Bom (7.0-8.9)" 
            count={gradeDistribution.good} 
            total={subjectGrades.length} 
            color="blue" 
          />
          <DistributionBar 
            label="Regular (6.0-6.9)" 
            count={gradeDistribution.average} 
            total={subjectGrades.length} 
            color="yellow" 
          />
          <DistributionBar 
            label="Abaixo da Média (4.0-5.9)" 
            count={gradeDistribution.belowAverage} 
            total={subjectGrades.length} 
            color="orange" 
          />
          <DistributionBar 
            label="Insuficiente (0.0-3.9)" 
            count={gradeDistribution.poor} 
            total={subjectGrades.length} 
            color="red" 
          />
        </div>

        {/* Performance Timeline */}
        <div className={`p-4 rounded-lg border ${
          theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
        }`}>
          <h4 className={`text-md font-semibold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Evolução Temporal
          </h4>
          
          {timelineData.length > 0 ? (
            <div className="space-y-3">
              {timelineData.map((data, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className={`text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {data.month}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${
                      data.average >= 7 ? 'text-green-600' : 
                      data.average >= 6 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {data.average.toFixed(1)}
                    </span>
                    <span className={`text-xs ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      ({data.count} avaliações)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`text-center py-4 text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Dados insuficientes para análise temporal
            </div>
          )}
        </div>
      </div>

      {/* Insights and Recommendations */}
      <div className={`mt-6 p-4 rounded-lg border ${
        theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-blue-50 border-blue-200'
      }`}>
        <h4 className={`text-md font-semibold mb-3 ${
          theme === 'dark' ? 'text-white' : 'text-blue-900'
        }`}>
          Insights e Recomendações
        </h4>
        
        <div className="space-y-2 text-sm">
          {analytics.atRiskStudents > 0 && (
            <div className={`flex items-start space-x-2 ${
              theme === 'dark' ? 'text-yellow-300' : 'text-yellow-700'
            }`}>
              <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>
                {analytics.atRiskStudents} estudante(s) em risco precisam de atenção especial
              </span>
            </div>
          )}
          
          {analytics.averageGrade < 6 && (
            <div className={`flex items-start space-x-2 ${
              theme === 'dark' ? 'text-red-300' : 'text-red-700'
            }`}>
              <TrendingDown className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>
                Média geral abaixo do esperado - considere revisar metodologia
              </span>
            </div>
          )}
          
          {analytics.passedStudents / analytics.totalStudents > 0.8 && (
            <div className={`flex items-start space-x-2 ${
              theme === 'dark' ? 'text-green-300' : 'text-green-700'
            }`}>
              <Award className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>
                Excelente taxa de aprovação! Continue com as estratégias atuais
              </span>
            </div>
          )}
          
          {analytics.noGradesStudents > 0 && (
            <div className={`flex items-start space-x-2 ${
              theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
            }`}>
              <Users className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>
                {analytics.noGradesStudents} estudante(s) ainda não possuem avaliações
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;
