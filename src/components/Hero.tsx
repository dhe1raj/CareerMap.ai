
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div className="relative overflow-hidden hero-gradient">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-grid-white/10 bg-[length:20px_20px] [mask-image:radial-gradient(white,transparent_70%)]" />
      
      <div className="container relative flex flex-col items-center justify-center px-4 py-20 md:py-32 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl animate-fade-in">
          Design Your Dream
          <span className="block">Career with AI</span>
        </h1>
        
        <p className="mt-6 text-lg leading-8 text-white/90 max-w-3xl mx-auto animate-slide-in">
          Get personalized career paths and AI-generated roadmaps to guide your professional journey.
        </p>
        
        <div className="mt-10 flex items-center justify-center gap-x-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <Button 
            size="lg" 
            className="text-lg font-medium group transition-all bg-white text-primary hover:bg-white/90"
            asChild
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Link to="/signup">
              Get Started
              <ChevronRight 
                className={`ml-2 h-4 w-4 transition-transform duration-300 ${isHovered ? "translate-x-1" : ""}`} 
              />
            </Link>
          </Button>
          
          <Button 
            size="lg"
            variant="outline" 
            className="text-lg font-medium border-white text-white hover:bg-white/10"
            asChild
          >
            <Link to="/login">
              Login
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
