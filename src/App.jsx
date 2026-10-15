import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './core/theme/ThemeContext';
import { AuthProvider } from './core/context/AuthContext';
import { ThemeControls } from './core/theme/ThemeControls';
import { router } from './router';

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ThemeControls />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              border: 'var(--border-width) solid var(--border-color)',
              borderRadius: 'var(--border-radius)',
              boxShadow: 'var(--shadow-main)',
              fontFamily: 'var(--font-family)',
              fontSize: '0.88rem',
              fontWeight: 600,
            },
            success: {
              iconTheme: {
                primary: 'var(--primary-color)',
                secondary: 'var(--primary-contrast)',
              },
            },
            error: {
              iconTheme: {
                primary: 'var(--accent-color)',
                secondary: '#ffffff',
              },
            },
          }}
        />
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
