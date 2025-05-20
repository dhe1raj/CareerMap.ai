
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { GeminiProvider } from "./context/GeminiContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CareerChat from "./pages/CareerChat";
import ResumeAnalysis from "./pages/ResumeAnalysis";
import CareerMatches from "./pages/CareerMatches";
import Roadmap from "./pages/Roadmap";
import Settings from "./pages/Settings";
import ProfileSettings from "./pages/ProfileSettings";
import AccountSettings from "./pages/AccountSettings";
import CareerDesigner from "./pages/CareerDesigner";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import Features from "./pages/Features";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import DashboardLayoutEnhanced from "./components/DashboardLayoutEnhanced";
import AuthGuard from "./components/AuthGuard";

function App() {
  return (
    <AuthProvider>
      <GeminiProvider>
        <Router>
          <AppContent />
        </Router>
      </GeminiProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const { user } = useAuth();
  
  console.log("Auth state in AppContent:", user ? "Logged in" : "Not logged in");

  return (
    <Routes>
      {/* Public routes accessible to everyone */}
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />
      <Route path="/" element={<Index />} />
      <Route path="/features" element={<Features />} />
      <Route path="/about" element={<About />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      
      {/* Protected routes with DashboardLayoutEnhanced */}
      <Route
        path="/dashboard"
        element={
          <AuthGuard>
            <DashboardLayoutEnhanced>
              <Dashboard />
            </DashboardLayoutEnhanced>
          </AuthGuard>
        }
      />
      <Route
        path="/career-chat"
        element={
          <AuthGuard>
            <DashboardLayoutEnhanced>
              <CareerChat />
            </DashboardLayoutEnhanced>
          </AuthGuard>
        }
      />
      <Route
        path="/resume-analysis"
        element={
          <AuthGuard>
            <DashboardLayoutEnhanced>
              <ResumeAnalysis />
            </DashboardLayoutEnhanced>
          </AuthGuard>
        }
      />
      <Route
        path="/career-matches"
        element={
          <AuthGuard>
            <DashboardLayoutEnhanced>
              <CareerMatches />
            </DashboardLayoutEnhanced>
          </AuthGuard>
        }
      />
      <Route
        path="/roadmap"
        element={
          <AuthGuard>
            <DashboardLayoutEnhanced>
              <Roadmap />
            </DashboardLayoutEnhanced>
          </AuthGuard>
        }
      />
      <Route
        path="/career-designer"
        element={
          <AuthGuard>
            <DashboardLayoutEnhanced>
              <CareerDesigner />
            </DashboardLayoutEnhanced>
          </AuthGuard>
        }
      />
      <Route
        path="/settings"
        element={
          <AuthGuard>
            <DashboardLayoutEnhanced>
              <Settings />
            </DashboardLayoutEnhanced>
          </AuthGuard>
        }
      />
      <Route
        path="/profile-settings"
        element={
          <AuthGuard>
            <DashboardLayoutEnhanced>
              <ProfileSettings />
            </DashboardLayoutEnhanced>
          </AuthGuard>
        }
      />
      <Route
        path="/account-settings"
        element={
          <AuthGuard>
            <DashboardLayoutEnhanced>
              <AccountSettings />
            </DashboardLayoutEnhanced>
          </AuthGuard>
        }
      />
      
      {/* 404 route to catch all unknown routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
