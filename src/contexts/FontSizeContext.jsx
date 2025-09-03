import React, { createContext, useContext, useState, useEffect } from 'react';

const FontSizeContext = createContext();

export const useFontSize = () => {
  const context = useContext(FontSizeContext);
  if (!context) {
    throw new Error('useFontSize must be used within a FontSizeProvider');
  }
  return context;
};

export const FontSizeProvider = ({ children }) => {
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem('sina-font-size');
    return saved || 'medium';
  });

  useEffect(() => {
    localStorage.setItem('sina-font-size', fontSize);
    
    // Apply font size to document root
    const root = document.documentElement;
    root.classList.remove('font-small', 'font-medium', 'font-large', 'font-extra-large');
    root.classList.add(`font-${fontSize}`);
  }, [fontSize]);

  const getFontSizeClasses = () => {
    const sizes = {
      small: {
        text: {
          xs: 'text-xs',
          sm: 'text-sm',
          base: 'text-sm',
          lg: 'text-base',
          xl: 'text-lg',
          '2xl': 'text-xl',
          '3xl': 'text-2xl'
        }
      },
      medium: {
        text: {
          xs: 'text-xs',
          sm: 'text-sm',
          base: 'text-base',
          lg: 'text-lg',
          xl: 'text-xl',
          '2xl': 'text-2xl',
          '3xl': 'text-3xl'
        }
      },
      large: {
        text: {
          xs: 'text-sm',
          sm: 'text-base',
          base: 'text-lg',
          lg: 'text-xl',
          xl: 'text-2xl',
          '2xl': 'text-3xl',
          '3xl': 'text-4xl'
        }
      },
      'extra-large': {
        text: {
          xs: 'text-base',
          sm: 'text-lg',
          base: 'text-xl',
          lg: 'text-2xl',
          xl: 'text-3xl',
          '2xl': 'text-4xl',
          '3xl': 'text-5xl'
        }
      }
    };
    
    return sizes[fontSize] || sizes.medium;
  };

  const value = {
    fontSize,
    setFontSize,
    getFontSizeClasses,
    fontSizeOptions: [
      { value: 'small', label: 'Pequeno' },
      { value: 'medium', label: 'Médio' },
      { value: 'large', label: 'Grande' },
      { value: 'extra-large', label: 'Extra Grande' }
    ]
  };

  return (
    <FontSizeContext.Provider value={value}>
      {children}
    </FontSizeContext.Provider>
  );
};
