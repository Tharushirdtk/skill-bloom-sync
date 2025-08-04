import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { UserProvider } from './context/UserContext';
import ProtectedRoute from './components/ProtectedRoute';

// Import pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EmployeeDirectory from './pages/EmployeeDirectory';
import Profile from './pages/Profile';
import SkillManagement from './pages/SkillManagement';
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Create MUI theme with purple colors
const theme = createTheme({
  palette: {
    primary: {
      main: 'hsl(262, 47%, 45%)',
      light: 'hsl(262, 60%, 75%)',
      dark: 'hsl(262, 47%, 35%)',
    },
    secondary: {
      main: 'hsl(262, 30%, 85%)',
      light: 'hsl(262, 30%, 95%)',
      dark: 'hsl(262, 30%, 75%)',
    },
    background: {
      default: 'hsl(262, 15%, 99%)',
      paper: 'hsl(0, 0%, 100%)',
    },
    text: {
      primary: 'hsl(224, 47%, 12%)',
      secondary: 'hsl(262, 8%, 46%)',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px -4px hsl(262 47% 45% / 0.15)',
        },
      },
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/employees" 
                element={
                  <ProtectedRoute>
                    <EmployeeDirectory />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/skills" 
                element={
                  <ProtectedRoute>
                    <SkillManagement />
                  </ProtectedRoute>
                } 
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </UserProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
