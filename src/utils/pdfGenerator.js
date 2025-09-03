// PDF Generation utility using jsPDF
export const generateStudentGradesPDF = (student, grades, subjects) => {
  // Create a simple text-based report that can be downloaded
  const studentGrades = grades.filter(g => g.studentId === student.id);
  
  let content = `RELATÓRIO DE NOTAS - SINA\n`;
  content += `================================\n\n`;
  content += `Estudante: ${student.name}\n`;
  content += `Turma: ${student.class}\n`;
  content += `Data do Relatório: ${new Date().toLocaleDateString('pt-BR')}\n\n`;
  content += `DISCIPLINAS E NOTAS:\n`;
  content += `--------------------\n\n`;
  
  // Group grades by subject
  const gradesBySubject = {};
  studentGrades.forEach(grade => {
    if (!gradesBySubject[grade.subjectName]) {
      gradesBySubject[grade.subjectName] = [];
    }
    gradesBySubject[grade.subjectName].push(grade);
  });
  
  // Add grades for each subject
  Object.keys(gradesBySubject).forEach(subjectName => {
    const subjectGrades = gradesBySubject[subjectName];
    const average = subjectGrades.reduce((sum, g) => sum + g.grade, 0) / subjectGrades.length;
    
    content += `${subjectName}:\n`;
    content += `  Média: ${average.toFixed(1)}\n`;
    content += `  Avaliações:\n`;
    
    subjectGrades.forEach(grade => {
      content += `    - ${grade.type}: ${grade.grade} (${new Date(grade.date).toLocaleDateString('pt-BR')})\n`;
    });
    content += `\n`;
  });
  
  // Calculate overall average
  const overallAverage = studentGrades.reduce((sum, g) => sum + g.grade, 0) / studentGrades.length;
  content += `RESUMO:\n`;
  content += `--------\n`;
  content += `Média Geral: ${overallAverage.toFixed(1)}\n`;
  content += `Total de Avaliações: ${studentGrades.length}\n`;
  content += `Situação: ${overallAverage >= 6 ? 'APROVADO' : 'EM RECUPERAÇÃO'}\n\n`;
  
  content += `Relatório gerado pelo SINA - Sistema Inteligente de Notas Acadêmicas\n`;
  
  // Create and download the file
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `relatorio_${student.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const generateClassGradesPDF = (students, grades, subjects) => {
  let content = `RELATÓRIO GERAL DA TURMA - SINA\n`;
  content += `===================================\n\n`;
  content += `Data do Relatório: ${new Date().toLocaleDateString('pt-BR')}\n`;
  content += `Total de Estudantes: ${students.length}\n`;
  content += `Total de Disciplinas: ${subjects.length}\n`;
  content += `Total de Avaliações: ${grades.length}\n\n`;
  
  content += `DESEMPENHO POR DISCIPLINA:\n`;
  content += `--------------------------\n\n`;
  
  subjects.forEach(subject => {
    const subjectGrades = grades.filter(g => g.subjectId === subject.id);
    const average = subjectGrades.length > 0 
      ? subjectGrades.reduce((sum, g) => sum + g.grade, 0) / subjectGrades.length 
      : 0;
    const passedStudents = subjectGrades.filter(g => g.grade >= 6).length;
    const passRate = subjectGrades.length > 0 ? (passedStudents / subjectGrades.length) * 100 : 0;
    
    content += `${subject.name} (${subject.area}):\n`;
    content += `  Média da Turma: ${average.toFixed(1)}\n`;
    content += `  Taxa de Aprovação: ${passRate.toFixed(1)}%\n`;
    content += `  Total de Avaliações: ${subjectGrades.length}\n\n`;
  });
  
  content += `RANKING DOS ESTUDANTES:\n`;
  content += `-----------------------\n\n`;
  
  // Calculate student averages
  const studentAverages = students.map(student => {
    const studentGrades = grades.filter(g => g.studentId === student.id);
    const average = studentGrades.length > 0 
      ? studentGrades.reduce((sum, g) => sum + g.grade, 0) / studentGrades.length 
      : 0;
    return { ...student, average };
  }).sort((a, b) => b.average - a.average);
  
  studentAverages.forEach((student, index) => {
    content += `${index + 1}º ${student.name} (${student.class}): ${student.average.toFixed(1)}\n`;
  });
  
  content += `\nRelatório gerado pelo SINA - Sistema Inteligente de Notas Acadêmicas\n`;
  
  // Create and download the file
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `relatorio_turma_${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
