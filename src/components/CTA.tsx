
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function CTA() {
  const { user } = useAuth();
  
  return (
    <div className="py-16 sm:py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-2xl text-center p-8 rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
          <div className="absolute -inset-1 bg-gradient-to-r from-brand-300/20 via-brand-500/20 to-brand-300/20 rounded-2xl blur-lg -z-10"></div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-gradient">
            Ready to find your perfect career?
          </h2>
          <p className="mt-4 text-lg text-white/70">
            Get personalized career recommendations and a roadmap to success with our AI-powered tools.
          </p>
          <div className="mt-10 flex items-center justify-center">
            {user ? (
              <Button size="lg" asChild className="glass-button bg-brand-500 hover:bg-brand-600 text-white shadow-[0_0_15px_rgba(155,135,245,0.5)]">
                <Link to="/dashboard">
                  Go to Dashboard
                </Link>
              </Button>
            ) : (
              <Button size="lg" asChild className="glass-button bg-brand-500 hover:bg-brand-600 text-white shadow-[0_0_15px_rgba(155,135,245,0.5)]">
                <Link to="/auth?tab=signup">
                  Get Started
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
