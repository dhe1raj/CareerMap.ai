
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
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-300 to-brand-500 rounded-full blur-md opacity-75 animate-pulse-glow"></div>
              <img 
                src="/lovable-uploads/9ae4cbff-f439-40be-949e-407cd109074b.png" 
                alt="CareerForge Logo" 
                className="relative h-48 z-10" 
              />
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl font-bold tracking-tight sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-brand-200 via-brand-300 to-brand-400 drop-shadow-[0_0_30px_rgba(161,123,245,0.6)] neon-purple-text"
          >
            Design Your Perfect Career Path
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-6 text-lg leading-8 text-white/80 max-w-2xl mx-auto futuristic-glass p-5 rounded-xl"
          >
            Discover career paths matched to your skills and preferences.
            Get personalized roadmaps, AI guidance, and resources to achieve your career goals.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-10 flex items-center justify-center gap-x-6"
          >
            {user ? (
              <Button size="lg" asChild className="neon-button rounded-xl text-base px-8 py-6">
                <Link to="/dashboard">
                  Go to Dashboard
                </Link>
              </Button>
            ) : (
              <>
                <Button size="lg" asChild className="neon-button rounded-xl text-base px-8 py-6">
                  <Link to="/auth?tab=signup">
                    Get Started
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="bg-white/5 backdrop-blur-sm border-white/20 hover:bg-white/10 text-white rounded-xl text-base px-8 py-6">
                  <Link to="/auth">
                    Log in
                  </Link>
                </Button>
              </>
            )}
          </motion.div>
        </div>
      </div>
      
      {/* Improved decorative background elements */}
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
            fillOpacity=".15"
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
              <stop stopColor="#a17bf5" />
              <stop offset="1" stopColor="#724dc9" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Enhanced floating particles with better positioning and animation */}
      <div className="absolute inset-0 -z-5 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div 
            key={i}
            className="absolute w-2 h-2 rounded-full bg-brand-400"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            initial={{ opacity: 0.3 }}
            animate={{ 
              opacity: [0.3, 0.8, 0.3], 
              y: [0, -15, 0],
            }}
            transition={{ 
              duration: Math.random() * 3 + 4,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse",
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>
    </div>
  );
}
