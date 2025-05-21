
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Features() {
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
      <main className="flex-grow">
        {/* Hero section */}
        <section className="bg-gradient-to-br from-brand-500/30 to-brand-700/30 backdrop-blur-md text-white py-16 md:py-24 border-b border-white/10">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in text-glow">Features</h1>
            <p className="text-xl md:text-2xl max-w-3xl">
              Discover how our AI-powered tools can help you design your ideal career path.
            </p>
          </div>
        </section>

        {/* Main features */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-white text-glow-sm">Our Core Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {/* Feature 1 */}
              <Card className="overflow-hidden border-0 shadow-lg glass-card transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:-translate-y-1">
                <div className="h-48 bg-gradient-to-r from-brand-400/40 to-brand-600/40 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center neon-border">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-brand-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
                <CardContent className="p-6">
                  <Badge className="mb-2" variant="glass">Personalized</Badge>
                  <h3 className="text-2xl font-bold mb-3 text-white text-glow-sm">Career Designer</h3>
                  <p className="text-white/70 mb-4">
                    Answer a few questions about your skills, interests, and goals, and our AI will suggest ideal career paths that match your unique profile.
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start text-white/80">
                      <span className="text-brand-400 mr-2">✓</span>
                      Personalized role recommendations
                    </li>
                    <li className="flex items-start text-white/80">
                      <span className="text-brand-400 mr-2">✓</span>
                      Skills gap analysis
                    </li>
                    <li className="flex items-start text-white/80">
                      <span className="text-brand-400 mr-2">✓</span>
                      Salary and job market insights
                    </li>
                  </ul>
                  <Button variant="neon" asChild>
                    <Link to="/career-designer">Try Career Designer</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Feature 2 */}
              <Card className="overflow-hidden border-0 shadow-lg glass-card transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:-translate-y-1">
                <div className="h-48 bg-gradient-to-r from-brand-600/40 to-brand-400/40 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center neon-border">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-brand-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                </div>
                <CardContent className="p-6">
                  <Badge className="mb-2" variant="glass">Smart</Badge>
                  <h3 className="text-2xl font-bold mb-3 text-white text-glow-sm">Career Roadmap</h3>
                  <p className="text-white/70 mb-4">
                    Get a detailed, step-by-step plan to reach your career goals with customized learning resources and milestones.
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start text-white/80">
                      <span className="text-brand-400 mr-2">✓</span>
                      Customized learning path
                    </li>
                    <li className="flex items-start text-white/80">
                      <span className="text-brand-400 mr-2">✓</span>
                      Course and certification recommendations
                    </li>
                    <li className="flex items-start text-white/80">
                      <span className="text-brand-400 mr-2">✓</span>
                      Milestone tracking
                    </li>
                  </ul>
                  <Button variant="neon" asChild>
                    <Link to="/career-matches">Explore Roadmaps</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 3 */}
              <Card className="glass-card hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">Career Chat AI</h3>
                  <p className="text-white/70 mb-4">
                    Chat with our AI assistant to get answers to all your career questions and receive personalized advice.
                  </p>
                  <Button variant="outline" asChild>
                    <Link to="/career-chat">Try Chat AI</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Feature 4 */}
              <Card className="glass-card hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">Role Explorer</h3>
                  <p className="text-white/70 mb-4">
                    Browse detailed information about hundreds of career roles, including skills required, salary ranges, and growth prospects.
                  </p>
                  <Button variant="outline" asChild>
                    <Link to="/career-matches">Explore Roles</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Feature 5 */}
              <Card className="glass-card hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">Progress Tracking</h3>
                  <p className="text-white/70 mb-4">
                    Track your progress along your career roadmap and celebrate milestones as you build skills and advance.
                  </p>
                  <Button variant="outline" asChild>
                    <Link to="/dashboard">View Dashboard</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to action */}
        <section className="py-16 bg-brand-900/30 backdrop-blur-md border-t border-white/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white text-glow-sm">Ready to Start Your Career Journey?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto text-white/80">
              Join thousands of professionals who have found their ideal career path with CareerPath.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" variant="neon" asChild className="px-8 py-6 text-base">
                <Link to="/signup">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="px-8 py-6 text-base">
                <Link to="/login">Login</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
