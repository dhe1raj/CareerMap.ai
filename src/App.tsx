import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import CareerChat from "./pages/CareerChat";
import ResumeAnalysis from "./pages/ResumeAnalysis";
import CareerMatches from "./pages/CareerMatches";
import Roadmap from "./pages/Roadmap";
import Settings from "./pages/Settings";
import GeminiSettings from "./pages/GeminiSettings";
import ProfileSettings from "./pages/ProfileSettings";

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

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      
      {/* Protected routes - only accessible if the user is logged in */}
      <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/career-chat" element={user ? <CareerChat /> : <Navigate to="/login" />} />
      <Route path="/resume-analysis" element={user ? <ResumeAnalysis /> : <Navigate to="/login" />} />
      <Route path="/career-matches" element={user ? <CareerMatches /> : <Navigate to="/login" />} />
      <Route path="/roadmap" element={user ? <Roadmap /> : <Navigate to="/login" />} />
      <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} />
      <Route path="/gemini-settings" element={user ? <GeminiSettings /> : <Navigate to="/login" />} />

      {/* Add the new ProfileSettings route */}
      <Route path="/profile-settings" element={<ProfileSettings />} />

      {/* Redirect to dashboard if logged in, otherwise to login */}
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
