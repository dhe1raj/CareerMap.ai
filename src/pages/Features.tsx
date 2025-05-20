
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Features() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero section */}
        <section className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">Features</h1>
            <p className="text-xl md:text-2xl max-w-3xl">
              Discover how our AI-powered tools can help you design your ideal career path.
            </p>
          </div>
        </section>

        {/* Main features */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Our Core Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {/* Feature 1 */}
              <Card className="overflow-hidden border-0 shadow-lg">
                <div className="h-48 bg-gradient-to-r from-purple-500 to-indigo-600"></div>
                <CardContent className="p-6">
                  <Badge className="mb-2">Personalized</Badge>
                  <h3 className="text-2xl font-bold mb-3">Career Designer</h3>
                  <p className="text-gray-600 mb-4">
                    Answer a few questions about your skills, interests, and goals, and our AI will suggest ideal career paths that match your unique profile.
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Personalized role recommendations
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Skills gap analysis
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Salary and job market insights
                    </li>
                  </ul>
                  <Button asChild>
                    <Link to="/career-designer">Try Career Designer</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Feature 2 */}
              <Card className="overflow-hidden border-0 shadow-lg">
                <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                <CardContent className="p-6">
                  <Badge className="mb-2">Smart</Badge>
                  <h3 className="text-2xl font-bold mb-3">Career Roadmap</h3>
                  <p className="text-gray-600 mb-4">
                    Get a detailed, step-by-step plan to reach your career goals with customized learning resources and milestones.
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Customized learning path
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Course and certification recommendations
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Milestone tracking
                    </li>
                  </ul>
                  <Button asChild>
                    <Link to="/career-matches">Explore Roadmaps</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 3 */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-3">Career Chat AI</h3>
                  <p className="text-gray-600 mb-4">
                    Chat with our AI assistant to get answers to all your career questions and receive personalized advice.
                  </p>
                  <Button variant="outline" asChild>
                    <Link to="/career-chat">Try Chat AI</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Feature 4 */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-3">Role Explorer</h3>
                  <p className="text-gray-600 mb-4">
                    Browse detailed information about hundreds of career roles, including skills required, salary ranges, and growth prospects.
                  </p>
                  <Button variant="outline" asChild>
                    <Link to="/career-matches">Explore Roles</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Feature 5 */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-3">Progress Tracking</h3>
                  <p className="text-gray-600 mb-4">
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
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Career Journey?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who have found their ideal career path with CareerPath.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" asChild>
                <Link to="/signup">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
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
