
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const { user } = useAuth();
  
  return (
    <div className="relative overflow-hidden bg-background py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Design Your Perfect Career Path
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
            Discover career paths matched to your skills and preferences.
            Get personalized roadmaps, AI guidance, and resources to achieve your career goals.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            {user ? (
              <Button size="lg" asChild>
                <Link to="/dashboard">
                  Go to Dashboard
                </Link>
              </Button>
            ) : (
              <>
                <Button size="lg" asChild>
                  <Link to="/auth?tab=signup">
                    Get Started
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
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
            fill="url(#175c433f-44f6-4d59-93f0-c5c51ad5566d)"
            fillOpacity=".25"
            d="M235.233 402.609c-127.052 0-207.734-100.457-207.734-293.611 0-197.355 107.444-222.542 193.545-222.542 96.42 0 158.087 54.598 178.369 148.98l125.924-19.21c-12.558-138.283-158.849-253.78-303.41-253.78C99.703-237.554 0-134.812 0 115.412 0 379.638 113.49 539.088 348.018 539.088c139.996 0 254.995-80.482 308.493-227.573l-125.947-27.342c-39.7 98.304-101.345 118.436-295.331 118.436Z"
          />
        </svg>
      </div>
    </div>
  );
}
