
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { GeminiProvider } from './context/GeminiContext';
import { Toaster } from '@/components/ui/sonner';
import Index from './pages/Index';
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
import Features from './pages/Features';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Cookies from './pages/Cookies';
import Founder from './pages/Founder';
import { useAuth } from './context/AuthContext';
import { supabase } from './integrations/supabase/client';
import setupRoadmapTables from "./utils/supabase-setup";

function App() {
  return (
    <AuthProvider>
      <GeminiProvider>
        <Router>
          <AppContent />
        </Router>
        <Toaster position="top-right" />
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
      <Route path="/auth" element={user ? <Navigate to="/dashboard" /> : <Auth />} />
      <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/auth" />} />
      <Route path="/settings" element={user ? <Settings /> : <Navigate to="/auth" />} />
      <Route path="/career-designer" element={user ? <CareerDesigner /> : <Navigate to="/auth" />} />
      <Route path="/roadmap" element={user ? <Roadmap /> : <Navigate to="/auth" />} />
      <Route path="/roadmap/:roadmapId" element={user ? <Roadmap /> : <Navigate to="/auth" />} />
      <Route path="/career-matches" element={user ? <CareerMatches /> : <Navigate to="/auth" />} />
      <Route path="/resume-analysis" element={user ? <ResumeAnalysis /> : <Navigate to="/auth" />} />
      <Route path="/career-progress" element={user ? <CareerProgressPage /> : <Navigate to="/auth" />} />
      <Route path="/career-resources" element={user ? <CareerResources /> : <Navigate to="/auth" />} />
      <Route path="/career-resources/:roadmapId" element={user ? <CareerResources /> : <Navigate to="/auth" />} />
      <Route path="/role-details/:roleId" element={user ? <Roadmap /> : <Navigate to="/auth" />} />
      
      {/* Static pages that don't require authentication */}
      <Route path="/about" element={<About />} />
      <Route path="/features" element={<Features />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/cookies" element={<Cookies />} />
      <Route path="/founder" element={<Founder />} />
      
      <Route path="/" element={<Index />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
