
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Hero() {
  const { user } = useAuth();
  
  return (
    <div className="relative overflow-hidden py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-300 to-brand-500 rounded-full blur opacity-75"></div>
              <img 
                src="/lovable-uploads/9769953f-da50-477d-9f36-89ed2dba060d.png" 
                alt="CareerForge Logo" 
                className="relative h-20 z-10" 
              />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-brand-200 to-brand-400 drop-shadow-[0_0_25px_rgba(155,135,245,0.3)]">
            Design Your Perfect Career Path
          </h1>
          <p className="mt-6 text-lg leading-8 text-white/80 max-w-2xl mx-auto backdrop-blur-sm rounded-lg p-4 bg-white/5 border border-white/10">
            Discover career paths matched to your skills and preferences.
            Get personalized roadmaps, AI guidance, and resources to achieve your career goals.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            {user ? (
              <Button size="lg" asChild className="glass-button bg-brand-500 hover:bg-brand-600 text-white shadow-[0_0_15px_rgba(155,135,245,0.5)]">
                <Link to="/dashboard">
                  Go to Dashboard
                </Link>
              </Button>
            ) : (
              <>
                <Button size="lg" asChild className="glass-button bg-brand-500 hover:bg-brand-600 text-white shadow-[0_0_15px_rgba(155,135,245,0.5)]">
                  <Link to="/auth?tab=signup">
                    Get Started
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 text-white">
                  <Link to="/auth">
                    Log in
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <svg
          className="absolute left-[calc(50%-4rem)] top-10 -z-10 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:left-48 lg:top-[calc(50%-30rem)] xl:left-[calc(50%-24rem)]"
          aria-hidden="true"
          viewBox="0 0 1108 632"
          width="1108"
          height="632"
          fill="none"
        >
          <path
            fill="url(#gradient-purple)"
            fillOpacity=".25"
            d="M235.233 402.609c-127.052 0-207.734-100.457-207.734-293.611 0-197.355 107.444-222.542 193.545-222.542 96.42 0 158.087 54.598 178.369 148.98l125.924-19.21c-12.558-138.283-158.849-253.78-303.41-253.78C99.703-237.554 0-134.812 0 115.412 0 379.638 113.49 539.088 348.018 539.088c139.996 0 254.995-80.482 308.493-227.573l-125.947-27.342c-39.7 98.304-101.345 118.436-295.331 118.436Z"
          />
          <defs>
            <linearGradient
              id="gradient-purple"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#9b87f5" />
              <stop offset="1" stopColor="#6e59a5" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
