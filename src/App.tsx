
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
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

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

function AppContent() {
  const { user } = useAuth();
  
  console.log("Auth state:", user ? "Logged in" : "Not logged in");

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
      
      {/* Protected routes - only accessible if the user is logged in */}
      <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/career-chat" element={user ? <CareerChat /> : <Navigate to="/login" />} />
      <Route path="/resume-analysis" element={user ? <ResumeAnalysis /> : <Navigate to="/login" />} />
      <Route path="/career-matches" element={user ? <CareerMatches /> : <Navigate to="/login" />} />
      <Route path="/roadmap" element={user ? <Roadmap /> : <Navigate to="/login" />} />
      <Route path="/career-designer" element={user ? <CareerDesigner /> : <Navigate to="/login" />} />
      <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} />
      <Route path="/profile-settings" element={user ? <ProfileSettings /> : <Navigate to="/login" />} />
      <Route path="/account-settings" element={user ? <AccountSettings /> : <Navigate to="/login" />} />
      
      {/* 404 route to catch all unknown routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
