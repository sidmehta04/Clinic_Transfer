import React from 'react';
import { ThemeProvider } from './components/theme-provider';
import ClinicDashboard from './components/ClinicDashboard';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-background font-sans antialiased">
        <nav className="border-b bg-card">
          <div className="container flex h-16 items-center px-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-primary">Clinic Transfer Dashboard</h1>
            </div>
          </div>
        </nav>

        <main className="container mx-auto py-6 px-4">
          <ClinicDashboard />
        </main>

        <footer className="border-t mt-auto py-6 bg-card">
          <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row px-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              2024 and 2025 Clinic Transfers
            </p>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;