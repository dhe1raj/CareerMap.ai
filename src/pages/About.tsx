
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Users, HelpCircle, Contact } from "lucide-react";
import { Helmet } from 'react-helmet-async';

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-cyber-deeper via-brand-900 to-cyber-dark">
      <Helmet>
        <title>About CareerMap | AI-Powered Career Planning Platform</title>
        <meta name="description" content="Learn about CareerMap's mission to help people discover their ideal career paths through AI-powered guidance and personalized roadmaps." />
        <meta name="keywords" content="career guidance, AI career planning, about CareerMap, career path platform, professional development" />
        <link rel="canonical" href="https://careermap.ai/about" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "CareerMap",
              "url": "https://careermap.ai",
              "logo": "https://careermap.ai/lovable-uploads/6dada9e0-7c2b-4be1-8795-cb8580fec628.png",
              "description": "AI-powered career planning and roadmap generator.",
              "foundingDate": "2023",
              "email": "contact@careermap.ai"
            }
          `}
        </script>
      </Helmet>
      
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in text-glow">About CareerMap</h1>
            <p className="text-xl md:text-2xl max-w-3xl">
              We're on a mission to help people discover and pursue their ideal career paths using the power of AI.
            </p>
          </div>
        </section>

        {/* Our Mission */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-white text-glow-sm">Our Mission</h2>
            <div className="max-w-3xl mx-auto glass-card p-8 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]">
              <p className="text-lg mb-6 text-white/90">
                At CareerMap, we believe everyone deserves a fulfilling career that aligns with their skills, interests, and life goals.
              </p>
              <p className="text-lg mb-6 text-white/90">
                Our AI-powered platform breaks down the barriers to career discovery and development, making personalized guidance accessible to all.
              </p>
              <p className="text-lg text-white/90">
                We're committed to leveraging cutting-edge technology to democratize career planning and create clear, actionable pathways to professional success.
              </p>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16" id="team">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-white text-glow-sm">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="glass-card hover:scale-105 transition-transform duration-300">
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-brand-400/30 to-brand-600/30 backdrop-blur-md rounded-full flex items-center justify-center mb-4 neon-border">
                    <Users className="w-12 h-12 text-brand-300" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">Leadership</h3>
                  <p className="text-white/70">
                    Our diverse leadership team brings decades of experience in tech, education, and career development.
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card hover:scale-105 transition-transform duration-300">
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-brand-400/30 to-brand-600/30 backdrop-blur-md rounded-full flex items-center justify-center mb-4 neon-border">
                    <HelpCircle className="w-12 h-12 text-brand-300" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">AI Experts</h3>
                  <p className="text-white/70">
                    Our AI team is dedicated to building models that deliver accurate, personalized career guidance.
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card hover:scale-105 transition-transform duration-300">
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-brand-400/30 to-brand-600/30 backdrop-blur-md rounded-full flex items-center justify-center mb-4 neon-border">
                    <Contact className="w-12 h-12 text-brand-300" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">Support</h3>
                  <p className="text-white/70">
                    Our customer success team ensures you get the most value from our platform throughout your career journey.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16" id="values">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-white text-glow-sm">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="glass-card p-6 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all">
                <h3 className="text-xl font-bold mb-3 text-brand-300">Innovation</h3>
                <p className="text-white/70">
                  We constantly push the boundaries of what's possible with AI and career guidance technology.
                </p>
              </div>
              
              <div className="glass-card p-6 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all">
                <h3 className="text-xl font-bold mb-3 text-brand-300">Accessibility</h3>
                <p className="text-white/70">
                  We're committed to making career guidance available to everyone, regardless of background or resources.
                </p>
              </div>
              
              <div className="glass-card p-6 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all">
                <h3 className="text-xl font-bold mb-3 text-brand-300">Quality</h3>
                <p className="text-white/70">
                  We strive for excellence in our AI algorithms, ensuring reliable and valuable guidance.
                </p>
              </div>
              
              <div className="glass-card p-6 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all">
                <h3 className="text-xl font-bold mb-3 text-brand-300">Empowerment</h3>
                <p className="text-white/70">
                  We believe in empowering individuals to take control of their career paths and professional growth.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-16" id="contact">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white text-glow-sm">Get in Touch</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto text-white/70">
              Have questions about our platform or want to learn more about how we can help with your career journey?
            </p>
            <a 
              href="mailto:contact@careermap.ai" 
              className="inline-flex items-center px-6 py-3 rounded-md neon-button hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all"
              aria-label="Contact CareerMap via email"
            >
              Contact Us
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
