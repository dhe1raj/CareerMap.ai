
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-cyber-deeper via-brand-900 to-cyber-dark">
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-brand-400/10 blur-[130px] animate-pulse-glow"></div>
        <div className="absolute bottom-20 right-1/4 w-72 h-72 rounded-full bg-brand-500/10 blur-[100px] animate-pulse-glow"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full bg-brand-600/10 blur-[120px] animate-pulse-glow"></div>
        
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNNjAgMEgwdjYwaDYwVjB6TTMwIDYwVjBtMzAgMzBIMCIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
      </div>
      
      <Navbar />
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="mb-6">
            <h1 className="text-8xl font-bold text-brand-400 mb-2 text-glow">404</h1>
            <p className="text-2xl text-white mb-6">Page not found</p>
            <p className="text-white/70 mb-8">
              We couldn't find the page you were looking for. It might have been removed or doesn't exist.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="neon" size="lg" asChild>
              <Link to="/">Return to Home</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/career-designer">Try Career Designer</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
