
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { GeminiProvider } from "@/context/GeminiContext";
import AuthGuard from "@/components/AuthGuard";
import { useEffect } from "react";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import CareerDesigner from "./pages/CareerDesigner";
import CareerDesign from "./pages/CareerDesign";
import CareerMatches from "./pages/CareerMatches";
import RoleDetails from "./pages/RoleDetails";
import Roadmap from "./pages/Roadmap";
import CareerChat from "./pages/CareerChat";
import ResumeAnalysis from "./pages/ResumeAnalysis";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Features from "./pages/Features";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import GenZCareerDecider from "./pages/GenZCareerDecider";

// Create a custom hook to remove any unwanted popups that might be appearing
const useRemovePopups = () => {
  useEffect(() => {
    // Check for and remove any recurring popups that might be present
    const removePopups = () => {
      const popupElements = document.querySelectorAll('.popup-notification, .ai-thinking-popup, [id*="popup"], [class*="popup"]');
      popupElements.forEach(element => {
        if (element.textContent?.includes('AI is thinking') || element.textContent?.includes('retrying')) {
          element.remove();
          console.log('Removed recurring popup');
        }
      });
    };
    
    // Run immediately and then set on an interval
    removePopups();
    const interval = setInterval(removePopups, 1000);
    
    return () => clearInterval(interval);
  }, []);
};

// Component to use the hook
const PopupRemover = () => {
  useRemovePopups();
  return null;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <GeminiProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <PopupRemover />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/about" element={<About />} />
              <Route path="/features" element={<Features />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              
              {/* Protected routes */}
              <Route 
                path="/dashboard" 
                element={
                  <AuthGuard>
                    <Dashboard />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/career-designer" 
                element={
                  <AuthGuard>
                    <CareerDesigner />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/career-design" 
                element={
                  <AuthGuard>
                    <CareerDesign />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/career-matches" 
                element={
                  <AuthGuard>
                    <CareerMatches />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/role/:id" 
                element={
                  <AuthGuard>
                    <RoleDetails />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/roadmap/:id" 
                element={
                  <AuthGuard>
                    <Roadmap />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/roadmap" 
                element={
                  <AuthGuard>
                    <Roadmap />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/career-chat" 
                element={
                  <AuthGuard>
                    <CareerChat />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/resume-analysis" 
                element={
                  <AuthGuard>
                    <ResumeAnalysis />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <AuthGuard>
                    <Settings />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/genz-career-decider" 
                element={
                  <AuthGuard>
                    <GenZCareerDecider />
                  </AuthGuard>
                } 
              />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </GeminiProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
