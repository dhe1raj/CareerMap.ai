
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function CTA() {
  const { user } = useAuth();
  
  return (
    <div className="bg-muted/50 py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to find your perfect career?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Get personalized career recommendations and a roadmap to success with our AI-powered tools.
          </p>
          <div className="mt-10 flex items-center justify-center">
            {user ? (
              <Button size="lg" asChild>
                <Link to="/dashboard">
                  Go to Dashboard
                </Link>
              </Button>
            ) : (
              <Button size="lg" asChild>
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
