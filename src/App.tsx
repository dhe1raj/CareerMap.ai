
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { GeminiProvider } from './context/GeminiContext';
import { Toaster } from '@/components/ui/sonner';
import Index from './pages/Index';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import CareerDesigner from './pages/CareerDesigner';
import Roadmap from './pages/Roadmap';
import CareerMatches from './pages/CareerMatches';
import ResumeAnalysis from './pages/ResumeAnalysis';
import CareerProgressPage from './pages/CareerProgress';
import CareerResources from './pages/CareerResources';
import NotFound from './pages/NotFound';
import About from './pages/About';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import { useAuth } from './context/AuthContext';
import { supabase } from './integrations/supabase/client';
import setupRoadmapTables from "./utils/supabase-setup";

function App() {
  return (
    <AuthProvider>
      <GeminiProvider>
        <Router>
          <AppContent />
          <Toaster position="top-right" />
        </Router>
      </GeminiProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const { user } = useAuth();
  const [session, setSession] = useState(null);
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  useEffect(() => {
    // Initialize roadmap tables in Supabase if needed
    setupRoadmapTables().then(result => {
      if (result.success) {
        console.log("Roadmap tables setup completed");
      } else {
        console.error("Failed to set up roadmap tables:", result.error);
      }
    });
    
    // Log the authentication status and user information
    console.log('Current User:', user);
  }, [user]);

  return (
    <Routes>
      {/* Public routes that are accessible to everyone */}
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<About />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      
      {/* Authentication routes */}
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />
      <Route path="/auth" element={user ? <Navigate to="/dashboard" /> : <Auth />} />
      
      {/* Protected routes that require authentication */}
      <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} />
      <Route path="/career-designer" element={user ? <CareerDesigner /> : <Navigate to="/login" />} />
      <Route path="/roadmap" element={user ? <Roadmap /> : <Navigate to="/login" />} />
      <Route path="/roadmap/:roadmapId" element={user ? <Roadmap /> : <Navigate to="/login" />} />
      <Route path="/career-matches" element={user ? <CareerMatches /> : <Navigate to="/login" />} />
      <Route path="/resume-analysis" element={user ? <ResumeAnalysis /> : <Navigate to="/login" />} />
      <Route path="/career-progress" element={user ? <CareerProgressPage /> : <Navigate to="/login" />} />
      <Route path="/career-resources" element={user ? <CareerResources /> : <Navigate to="/login" />} />
      <Route path="/career-resources/:roadmapId" element={user ? <CareerResources /> : <Navigate to="/login" />} />
      <Route path="/role-details/:roleId" element={user ? <Roadmap /> : <Navigate to="/login" />} />
      
      {/* Catch-all for 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
