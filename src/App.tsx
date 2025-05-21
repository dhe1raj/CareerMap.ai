
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "./components/ui/theme-provider";
import Home from './pages/index';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import AuthGuard from './components/AuthGuard';
import { AuthProvider } from './context/AuthContext';
import CareerDesigner from './pages/CareerDesigner';
import CareerChat from './pages/CareerChat';
import CareerProgress from './pages/CareerProgress';
import CareerResources from './pages/CareerResources';
import CareerMatches from './pages/CareerMatches';
import Roadmap from './pages/Roadmap';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import ResumeAnalysis from './pages/ResumeAnalysis';
import { GeminiProvider } from './context/GeminiContext';
import GenZCareerDecider from './pages/GenZCareerDecider';

const queryClient = new QueryClient();

function App() {
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <ThemeProvider defaultTheme="dark" storageKey="theme">
      <HelmetProvider>
        <AuthProvider>
          <GeminiProvider>
            <QueryClientProvider client={queryClient}>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/signin" element={<Auth />} />
                  <Route path="/signup" element={<Auth />} />
                  
                  {/* Protected routes */}
                  <Route element={<AuthGuard />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/dashboard/resume" element={<ResumeAnalysis />} />
                    <Route path="/career-designer" element={<CareerDesigner />} />
                    <Route path="/career-chat" element={<CareerChat />} />
                    <Route path="/career-progress" element={<CareerProgress />} />
                    <Route path="/career-resources" element={<CareerResources />} />
                    <Route path="/career-resources/:id" element={<CareerResources />} />
                    <Route path="/career-matches" element={<CareerMatches />} />
                    <Route path="/roadmap/:id" element={<Roadmap />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/genz-career-decider" element={<GenZCareerDecider />} />
                  </Route>
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </QueryClientProvider>
          </GeminiProvider>
        </AuthProvider>
      </HelmetProvider>
    </ThemeProvider>
  );
}

export default App;
