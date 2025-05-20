
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

export default function CTA() {
  const { user } = useAuth();
  
  return (
    <div className="py-20 sm:py-28 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-2xl text-center p-10 rounded-2xl futuristic-glass"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-brand-400/20 via-brand-500/20 to-brand-400/20 rounded-2xl blur-lg -z-10"></div>
          
          <div className="absolute inset-0 rounded-2xl overflow-hidden">
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand-400/70 to-transparent"></div>
            <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-brand-400/70 to-transparent"></div>
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/70 to-transparent"></div>
            <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-brand-400/70 to-transparent"></div>
          </div>
          
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl neon-purple-text text-white">
            Ready to find your perfect career?
          </h2>
          
          <p className="mt-4 text-lg text-white/80">
            Get personalized career recommendations and a roadmap to success with our AI-powered tools.
          </p>
          
          <div className="mt-10 flex items-center justify-center">
            {user ? (
              <Button size="lg" asChild className="neon-button rounded-xl px-8 py-6">
                <Link to="/dashboard">
                  Go to Dashboard
                </Link>
              </Button>
            ) : (
              <Button size="lg" asChild className="neon-button rounded-xl px-8 py-6">
                <Link to="/auth?tab=signup">
                  Get Started
                </Link>
              </Button>
            )}
          </div>
        </motion.div>
      </div>
      
      {/* Background glow effect */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-40 bg-brand-400/30 blur-[80px] rounded-full"></div>
    </div>
  );
}
