import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('sina-user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('sina-user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username, password) => {
    // Default credentials for professor
    const defaultCredentials = {
      username: 'professor',
      password: 'professor'
    };

    if (username === defaultCredentials.username && password === defaultCredentials.password) {
      const userData = {
        id: 1,
        username: 'professor',
        name: 'Prof. Maria Silva',
        role: 'teacher',
        email: 'maria.silva@escola.edu.br',
        loginTime: new Date().toISOString()
      };
      
      setUser(userData);
      localStorage.setItem('sina-user', JSON.stringify(userData));
      return { success: true, user: userData };
    } else {
      return { success: false, error: 'Usuário ou senha inválidos' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sina-user');
  };

  const updateCredentials = (newUsername, newPassword) => {
    // In a real application, this would make an API call
    // For now, we'll just update localStorage
    const credentials = {
      username: newUsername,
      password: newPassword
    };
    localStorage.setItem('sina-credentials', JSON.stringify(credentials));
  };

  const getCredentials = () => {
    const saved = localStorage.getItem('sina-credentials');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Error parsing credentials:', error);
      }
    }
    return { username: 'professor', password: 'professor' };
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    updateCredentials,
    getCredentials,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 