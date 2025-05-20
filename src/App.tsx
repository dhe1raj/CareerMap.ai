
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CareerDesigner from "./pages/CareerDesigner";
import CareerMatches from "./pages/CareerMatches";
import RoleDetails from "./pages/RoleDetails";
import Roadmap from "./pages/Roadmap";
import CareerChat from "./pages/CareerChat";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/career-designer" element={<CareerDesigner />} />
          <Route path="/career-matches" element={<CareerMatches />} />
          <Route path="/role/:id" element={<RoleDetails />} />
          <Route path="/roadmap/:id" element={<Roadmap />} />
          <Route path="/career-chat" element={<CareerChat />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
