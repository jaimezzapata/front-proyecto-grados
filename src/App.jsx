import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './core/theme/ThemeContext';
import { AuthProvider } from './core/context/AuthContext';
import { ThemeSidebarTab } from './core/theme/ThemeSidebarTab';
import { router } from './router';

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ThemeSidebarTab />
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
