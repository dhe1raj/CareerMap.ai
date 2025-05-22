
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SuggestionChip } from "@/components/dashboard/SuggestionChip";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="text-center glass-morphism p-8 rounded-xl max-w-md shadow-[0_0_15px_rgba(168,85,247,0.2)]">
        <h1 className="text-6xl font-bold mb-4 text-gradient">404</h1>
        <p className="text-xl text-white/80 mb-6">Oops! This page doesn't exist</p>
        <div className="flex flex-col gap-4">
          <Button 
            onClick={() => navigate("/")}
            className="glowing-purple w-full"
          >
            Return to Home
          </Button>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            <SuggestionChip label="Dashboard" route="/dashboard" />
            <SuggestionChip label="Career Design" route="/career-designer" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
