import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { GeminiProvider } from './context/GeminiContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import CareerDesigner from './pages/CareerDesigner';
import Roadmap from './pages/Roadmap';
import CareerMatches from './pages/CareerMatches';
import ResumeAnalysis from './pages/ResumeAnalysis';
import CareerProgressPage from './pages/CareerProgress';
import RoadmapDetailsPage from './pages/RoadmapDetails';
import NotFound from './pages/NotFound';
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
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      </GeminiProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const { authInitialized, user } = useAuth();
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
    console.log('Authentication Initialized:', authInitialized);
    console.log('Current User:', user);
  }, [authInitialized, user]);

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
      <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <SignupPage />} />
      <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} />
      <Route path="/career-designer" element={user ? <CareerDesigner /> : <Navigate to="/login" />} />
      <Route path="/roadmap" element={user ? <Roadmap /> : <Navigate to="/login" />} />
      <Route path="/career-matches" element={user ? <CareerMatches /> : <Navigate to="/login" />} />
      <Route path="/resume-analysis" element={user ? <ResumeAnalysis /> : <Navigate to="/login" />} />
      <Route path="/career-progress" element={user ? <CareerProgressPage /> : <Navigate to="/login" />} />
      <Route path="/roadmap/:roadmapId" element={user ? <RoadmapDetailsPage /> : <Navigate to="/login" />} />
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
