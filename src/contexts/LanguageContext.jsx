import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  pt: {
    // Login
    'login': 'Entrar',
    'logout': 'Sair',
    'username': 'Nome de usuário',
    'password': 'Senha',
    'login-title': 'Login do Professor',
    'login-subtitle': 'Acesse o Sistema SINA',
    'login-button': 'Entrar no Sistema',
    'login-error': 'Usuário ou senha inválidos',
    'login-required': 'É necessário fazer login para acessar esta página',
    'remember-me': 'Lembrar de mim',
    'forgot-password': 'Esqueci minha senha',
    'welcome-back': 'Bem-vindo de volta',
    'professor': 'Professor',
    
    // Student Management
    'student-management': 'Gerenciar Estudantes',
    'add-student': 'Adicionar Estudante',
    'edit-student': 'Editar Estudante',
    'delete-student': 'Excluir Estudante',
    'student-name': 'Nome do Estudante',
    'student-id': 'ID do Estudante',
    'student-email': 'Email do Estudante',
    'student-class': 'Turma',
    'student-added': 'Estudante adicionado com sucesso',
    'student-updated': 'Estudante atualizado com sucesso',
    'student-deleted': 'Estudante excluído com sucesso',
    'confirm-delete-student': 'Tem certeza que deseja excluir este estudante?',
    'student-list': 'Lista de Estudantes',
    'no-students': 'Nenhum estudante encontrado',
    'search-students': 'Buscar estudantes...',
    
    // Grade Management
    'grade-management': 'Gerenciar Notas',
    'add-grade': 'Adicionar Nota',
    'edit-grade': 'Editar Nota',
    'delete-grade': 'Excluir Nota',
    'grade-value': 'Nota',
    'grade-subject': 'Disciplina',
    'grade-date': 'Data',
    'grade-type': 'Tipo de Avaliação',
    'grade-added': 'Nota adicionada com sucesso',
    'grade-updated': 'Nota atualizada com sucesso',
    'grade-deleted': 'Nota excluída com sucesso',
    'confirm-delete-grade': 'Tem certeza que deseja excluir esta nota?',
    'grade-list': 'Lista de Notas',
    'no-grades': 'Nenhuma nota encontrada',
    'student-grades': 'Notas do Estudante',
    'average-grade': 'Média',
    'grades': 'notas',
    'select-student': 'Selecionar estudante',
    'select-subject': 'Selecionar disciplina',
    
    // Subjects
    'portuguese-language': 'Língua Portuguesa',
    'english-language': 'Língua Inglesa',
    'arts': 'Arte',
    'physical-education': 'Educação Física',
    'mathematics': 'Matemática',
    'history': 'História',
    'geography': 'Geografia',
    'sociology': 'Sociologia',
    'philosophy': 'Filosofia',
    'physics': 'Física',
    'chemistry': 'Química',
    'biology': 'Biologia',
    
    // Grade Types
    'exam': 'Prova',
    'assignment': 'Trabalho',
    'quiz': 'Teste',
    'project': 'Projeto',
    'participation': 'Participação',
    
    // Header
    overview: 'Visão Geral',
    subjects: 'Disciplinas',
    attendance: 'Frequência',
    students: 'Estudantes',
    settings: 'Configurações',
    help: 'Ajuda',
    reports: 'Relatórios',
    more: 'Mais',
    dashboard: 'Painel',
    
    // Navigation descriptions
    'class-wide-performance-metrics': 'Métricas de desempenho da turma',
    'subject-specific-analytics': 'Análises específicas por disciplina',
    'attendance-tracking-patterns': 'Rastreamento e padrões de frequência',
    'individual-student-analytics': 'Análises individuais dos estudantes',
    
    // User info
    'grade-5-teacher': 'Professora do 5º Ano',
    
    // Main Dashboard
    'student-performance-overview': 'Visão Geral do Desempenho dos Estudantes',
    'monitor-academic-progress': 'Monitorar progresso acadêmico e identificar oportunidades de intervenção',
    'last-updated': 'Última atualização',
    'refresh': 'Atualizar',
    'auto': 'Automático',
    'manual': 'Manual',
    
    // KPI Cards
    'class-average-grade': 'Média da Turma',
    'across-all-subjects': 'Em todas as disciplinas',
    'attendance-rate': 'Taxa de Frequência',
    'current-month': 'Mês atual',
    'students-at-risk': 'Estudantes em Risco',
    'need-attention': 'Necessitam atenção',
    'grade-improvement': 'Melhoria das Notas',
    'students-improving': 'Estudantes melhorando',
    
    // Context Filters
    'context-filters': 'Filtros de Contexto',
    'class': 'Turma',
    'student-group': 'Grupo de Estudantes',
    'time-range': 'Período',
    'select-class': 'Selecionar turma...',
    'select-student-group': 'Selecionar grupo de estudantes...',
    'select-time-range': 'Selecionar período...',
    'active-students': 'Estudantes Ativos',
    'reset-filters': 'Limpar Filtros',
    
    // Class options
    'class-5a-28-students': 'Turma 5A (28 estudantes)',
    'class-5b-26-students': 'Turma 5B (26 estudantes)',
    'class-5c-24-students': 'Turma 5C (24 estudantes)',
    'all-classes-78-students': 'Todas as Turmas (78 estudantes)',
    'morning-session': 'Turno da manhã',
    'afternoon-session': 'Turno da tarde',
    'combined-view': 'Visão combinada',
    
    // Student groups
    'all-students': 'Todos os Estudantes',
    'at-risk-students': 'Estudantes em Risco (8)',
    'high-performers': 'Alto Desempenho (15)',
    'needs-attention': 'Necessitam Atenção (12)',
    
    // Time ranges
    'current-week': 'Semana Atual',
    'current-term': 'Bimestre Atual',
    'academic-year': 'Ano Letivo',
    'custom-range': 'Período Personalizado',
    
    // Footer stats
    'total-students': 'Total de Estudantes',
    'subjects-tracked': 'Disciplinas Acompanhadas',
    'grades-entered': 'Notas Inseridas',
    'data-accuracy': 'Precisão dos Dados',
    
    // Common
    'min-ago': 'min atrás',
    'loading': 'Carregando...',
    'error': 'Erro',
    'success': 'Sucesso',
    'warning': 'Aviso',
    'info': 'Informação',
    'save': 'Salvar',
    'cancel': 'Cancelar',
    'close': 'Fechar',
    'confirm': 'Confirmar',
    'yes': 'Sim',
    'no': 'Não',
    'actions': 'Ações',
    'name': 'Nome',
    'email': 'Email',
    'date': 'Data',
    'status': 'Status',
    'active': 'Ativo',
    'inactive': 'Inativo',
    'search': 'Buscar',
    'filter': 'Filtrar',
    'sort': 'Ordenar',
    'export': 'Exportar',
    'import': 'Importar',
    'print': 'Imprimir',
    'download': 'Baixar',
    'upload': 'Enviar',
    'view': 'Visualizar',
    'edit': 'Editar',
    'delete': 'Excluir',
    'create': 'Criar',
    'update': 'Atualizar',
    'submit': 'Enviar',
    'reset': 'Limpar',
    
    // Theme
    'light-theme': 'Tema Claro',
    'dark-theme': 'Tema Escuro',
    'switch-language': 'Alterar idioma',
    'switch-theme': 'Alterar tema'
  }
};

export const LanguageProvider = ({ children }) => {
  // Forçar sempre português
  const [currentLanguage] = useState('pt');

  const switchLanguage = (language) => {
    // Não permitir mudança de idioma - sempre português
    console.log('Idioma fixado em português');
  };

  const translate = (key) => {
    return translations.pt[key] || key;
  };

  const value = {
    currentLanguage,
    switchLanguage,
    translate,
    t: translate
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};