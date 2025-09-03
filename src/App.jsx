import React from "react";
import Routes from "./Routes";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import { FontSizeProvider } from "./contexts/FontSizeContext";

function App() {
  return (
    <ThemeProvider>
      <FontSizeProvider>
        <LanguageProvider>
          <AuthProvider>
            <DataProvider>
              <Routes />
            </DataProvider>
          </AuthProvider>
        </LanguageProvider>
      </FontSizeProvider>
    </ThemeProvider>
  );
}

export default App;