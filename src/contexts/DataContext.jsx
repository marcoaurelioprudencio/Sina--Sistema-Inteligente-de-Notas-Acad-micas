import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Base de dados estática dos alunos
const initialStudents = [
  { id: 1, name: 'Ana Beatriz Silva', email: 'ana.silva@escola.edu.br', class: '5A' },
  { id: 2, name: 'João Pedro Almeida', email: 'joao.almeida@escola.edu.br', class: '5A' },
  { id: 3, name: 'Larissa Santos Oliveira', email: 'larissa.oliveira@escola.edu.br', class: '5A' },
  { id: 4, name: 'Rafael Gomes Ferreira', email: 'rafael.ferreira@escola.edu.br', class: '5B' },
  { id: 5, name: 'Vitória Costa Mendes', email: 'vitoria.mendes@escola.edu.br', class: '5B' },
  { id: 6, name: 'Lucas Henrique Souza', email: 'lucas.souza@escola.edu.br', class: '5B' },
  { id: 7, name: 'Camila Rocha Martins', email: 'camila.martins@escola.edu.br', class: '5C' },
  { id: 8, name: 'Matheus Carvalho Lima', email: 'matheus.lima@escola.edu.br', class: '5C' },
  { id: 9, name: 'Gabriela Nunes Pereira', email: 'gabriela.pereira@escola.edu.br', class: '5C' },
  { id: 10, name: 'Bruno Alves Monteiro', email: 'bruno.monteiro@escola.edu.br', class: '5A' },
  { id: 11, name: 'Isabela Fernandes Duarte', email: 'isabela.duarte@escola.edu.br', class: '5B' },
  { id: 12, name: 'Thiago Moreira Lopes', email: 'thiago.lopes@escola.edu.br', class: '5C' },
  { id: 13, name: 'Mariana Araújo Castro', email: 'mariana.castro@escola.edu.br', class: '5A' },
  { id: 14, name: 'Felipe Ramos Correia', email: 'felipe.correia@escola.edu.br', class: '5B' },
  { id: 15, name: 'Júlia Mendes Barros', email: 'julia.barros@escola.edu.br', class: '5C' }
];

// Base de dados estática das matérias
const initialSubjects = [
  // Linguagens e suas Tecnologias
  { id: 1, name: 'Língua Portuguesa', area: 'Linguagens e suas Tecnologias', code: 'LP' },
  { id: 2, name: 'Literatura', area: 'Linguagens e suas Tecnologias', code: 'LIT' },
  { id: 3, name: 'Arte', area: 'Linguagens e suas Tecnologias', code: 'ART' },
  { id: 4, name: 'Educação Física', area: 'Linguagens e suas Tecnologias', code: 'EF' },
  { id: 5, name: 'Língua Inglesa', area: 'Linguagens e suas Tecnologias', code: 'LI' },
  
  // Matemática e suas Tecnologias
  { id: 6, name: 'Matemática', area: 'Matemática e suas Tecnologias', code: 'MAT' },
  
  // Ciências da Natureza e suas Tecnologias
  { id: 7, name: 'Biologia', area: 'Ciências da Natureza e suas Tecnologias', code: 'BIO' },
  { id: 8, name: 'Física', area: 'Ciências da Natureza e suas Tecnologias', code: 'FIS' },
  { id: 9, name: 'Química', area: 'Ciências da Natureza e suas Tecnologias', code: 'QUI' },
  
  // Ciências Humanas e Sociais Aplicadas
  { id: 10, name: 'História', area: 'Ciências Humanas e Sociais Aplicadas', code: 'HIST' },
  { id: 11, name: 'Geografia', area: 'Ciências Humanas e Sociais Aplicadas', code: 'GEO' },
  { id: 12, name: 'Filosofia', area: 'Ciências Humanas e Sociais Aplicadas', code: 'FIL' },
  { id: 13, name: 'Sociologia', area: 'Ciências Humanas e Sociais Aplicadas', code: 'SOC' }
];

// Dados iniciais de notas e frequência (exemplos)
const generateInitialGrades = () => {
  const grades = [];
  
  // Garantir que cada aluno tenha notas em TODAS as matérias
  initialStudents.forEach(student => {
    initialSubjects.forEach(subject => {
      // Gerar notas aleatórias entre 0 e 10
      const grade = Math.floor(Math.random() * 11);
      const attendance = Math.floor(Math.random() * 21) + 80; // 80-100%
      
      grades.push({
        id: grades.length + 1,
        studentId: student.id,
        studentName: student.name,
        subjectId: subject.id,
        subjectName: subject.name,
        grade: grade,
        attendance: attendance,
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Últimos 30 dias
        type: ['Prova', 'Trabalho', 'Teste', 'Projeto', 'Participação'][Math.floor(Math.random() * 5)],
        notes: ''
      });
    });
  });
  
  return grades;
};

export const DataProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Carregar dados do localStorage ou usar dados iniciais
    const savedStudents = localStorage.getItem('sina-students');
    const savedSubjects = localStorage.getItem('sina-subjects');
    const savedGrades = localStorage.getItem('sina-grades');

    if (savedStudents && savedSubjects && savedGrades) {
      try {
        setStudents(JSON.parse(savedStudents));
        setSubjects(JSON.parse(savedSubjects));
        setGrades(JSON.parse(savedGrades));
      } catch (error) {
        console.error('Error loading saved data:', error);
        loadInitialData();
      }
    } else {
      loadInitialData();
    }
    
    setIsLoading(false);
  }, []);

  const loadInitialData = () => {
    setStudents(initialStudents);
    setSubjects(initialSubjects);
    setGrades(generateInitialGrades());
    
    // Salvar no localStorage
    localStorage.setItem('sina-students', JSON.stringify(initialStudents));
    localStorage.setItem('sina-subjects', JSON.stringify(initialSubjects));
    localStorage.setItem('sina-grades', JSON.stringify(generateInitialGrades()));
  };

  // Funções para gerenciar estudantes
  const addStudent = (student) => {
    const newStudent = {
      ...student,
      id: Math.max(...students.map(s => s.id), 0) + 1
    };
    const updatedStudents = [...students, newStudent];
    setStudents(updatedStudents);
    localStorage.setItem('sina-students', JSON.stringify(updatedStudents));
    return newStudent;
  };

  const updateStudent = (id, updates) => {
    const updatedStudents = students.map(student =>
      student.id === id ? { ...student, ...updates } : student
    );
    setStudents(updatedStudents);
    localStorage.setItem('sina-students', JSON.stringify(updatedStudents));
  };

  const deleteStudent = (id) => {
    const updatedStudents = students.filter(student => student.id !== id);
    const updatedGrades = grades.filter(grade => grade.studentId !== id);
    
    setStudents(updatedStudents);
    setGrades(updatedGrades);
    
    localStorage.setItem('sina-students', JSON.stringify(updatedStudents));
    localStorage.setItem('sina-grades', JSON.stringify(updatedGrades));
  };

  // Funções para gerenciar notas
  const addGrade = (grade) => {
    const newGrade = {
      ...grade,
      id: Math.max(...grades.map(g => g.id), 0) + 1,
      date: grade.date || new Date().toISOString().split('T')[0]
    };
    const updatedGrades = [...grades, newGrade];
    setGrades(updatedGrades);
    localStorage.setItem('sina-grades', JSON.stringify(updatedGrades));
    return newGrade;
  };

  const updateGrade = (id, updates) => {
    const updatedGrades = grades.map(grade =>
      grade.id === id ? { ...grade, ...updates } : grade
    );
    setGrades(updatedGrades);
    localStorage.setItem('sina-grades', JSON.stringify(updatedGrades));
  };

  const deleteGrade = (id) => {
    const updatedGrades = grades.filter(grade => grade.id !== id);
    setGrades(updatedGrades);
    localStorage.setItem('sina-grades', JSON.stringify(updatedGrades));
  };

  // Funções de consulta
  const getStudentGrades = (studentId) => {
    return grades.filter(grade => grade.studentId === studentId);
  };

  const getSubjectGrades = (subjectId) => {
    return grades.filter(grade => grade.subjectId === subjectId);
  };

  const getStudentByName = (name) => {
    return students.find(student => 
      student.name.toLowerCase().includes(name.toLowerCase())
    );
  };

  const getSubjectByName = (name) => {
    return subjects.find(subject => 
      subject.name.toLowerCase().includes(name.toLowerCase())
    );
  };

  // Estatísticas
  const getClassAverage = () => {
    if (grades.length === 0) return 0;
    const total = grades.reduce((sum, grade) => sum + grade.grade, 0);
    return Math.round((total / grades.length) * 100) / 100;
  };

  const getAttendanceRate = () => {
    if (grades.length === 0) return 0;
    const total = grades.reduce((sum, grade) => sum + grade.attendance, 0);
    return Math.round((total / grades.length) * 100) / 100;
  };

  const getStudentsAtRisk = () => {
    const studentAverages = students.map(student => {
      const studentGrades = getStudentGrades(student.id);
      if (studentGrades.length === 0) return { ...student, average: 0 };
      
      const average = studentGrades.reduce((sum, grade) => sum + grade.grade, 0) / studentGrades.length;
      return { ...student, average: Math.round(average * 100) / 100 };
    });
    
    return studentAverages.filter(student => student.average < 6);
  };

  const resetData = () => {
    loadInitialData();
  };

  const value = {
    // Estado
    students,
    subjects,
    grades,
    isLoading,
    
    // Funções de estudantes
    addStudent,
    updateStudent,
    deleteStudent,
    
    // Funções de notas
    addGrade,
    updateGrade,
    deleteGrade,
    
    // Funções de consulta
    getStudentGrades,
    getSubjectGrades,
    getStudentByName,
    getSubjectByName,
    
    // Estatísticas
    getClassAverage,
    getAttendanceRate,
    getStudentsAtRisk,
    
    // Utilitários
    resetData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
