
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Github, Linkedin, Twitter } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import SEOMetadata from "@/components/SEOMetadata";

export default function Founder() {
  // Animation effect for elements
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in");
        }
      });
    });

    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
      observer.observe(el);
      // Start with opacity 0
      el.classList.add("opacity-0");
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <SEOMetadata
        title="Meet the Founder | CareerMapAI – Vision, Story & Mission"
        description="Meet Deeraj, 17-year-old founder of CareerMapAI – the neon-bright platform using Google Gemini to craft AI career roadmaps for Gen Z. Discover his vision and the traction behind India's fastest-growing career tech startup."
        keywords="Deeraj Dasari, CareerMapAI founder, AI career roadmaps, Gen Z careers, career tech startup India"
        canonicalPath="/founder"
        ogImage="/lovable-uploads/a01ed682-7cde-4dbe-82c8-572345951c1d.png"
        ogType="profile"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "Deeraj Dasari",
          "jobTitle": "Founder",
          "description": "Gen-Z technologist transforming career planning with AI. Fuelled by code, creativity & community.",
          "image": "/lovable-uploads/a01ed682-7cde-4dbe-82c8-572345951c1d.png",
          "sameAs": [
            "https://github.com/deerajdasari",
            "https://linkedin.com/in/deerajdasari",
            "https://twitter.com/deerajdasari"
          ],
          "alumniOf": "Computer Science and Engineering",
          "birthDate": "2007"
        }}
      />

      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow">
          {/* Hero Section */}
          <section className="relative overflow-hidden glass-morphism bg-gradient-to-br from-[#1E1B31] to-[#9F68F0] py-16 lg:py-24">
            <div className="absolute inset-0 opacity-20">
              <div id="particles-js" className="h-full w-full"></div>
            </div>
            
            <div className="container mx-auto px-4">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                {/* Founder Image */}
                <div className="lg:w-[45%] flex justify-center animate-on-scroll">
                  <div className="relative rounded-full overflow-hidden w-64 h-64 md:w-80 md:h-80 border-2 border-white/20 shadow-lg shadow-brand-400/30">
                    <img 
                      src="/lovable-uploads/a01ed682-7cde-4dbe-82c8-572345951c1d.png" 
                      alt="Deeraj Dasari, Founder of CareerMapAI" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 rounded-full shadow-[0_0_25px_rgba(159,104,240,0.5)] pointer-events-none"></div>
                  </div>
                </div>
                
                {/* Hero Text */}
                <div className="lg:w-[55%] text-center lg:text-left animate-on-scroll">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                    Founder of CareerMapAI
                  </h1>
                  <h2 className="text-xl md:text-2xl italic text-white/80 mb-6">
                    "Driven by curiosity. Built with purpose."
                  </h2>
                </div>
              </div>
            </div>
          </section>

          {/* Founder Snapshot Card */}
          <section className="py-16 container mx-auto px-4">
            <div className="max-w-[480px] mx-auto glass-card rounded-xl p-8 backdrop-blur-xl bg-white/5 border border-white/10 shadow-lg transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12),0_0_15px_rgba(168,85,247,0.3)] hover:translate-y-[-5px] animate-on-scroll">
              <h2 className="text-2xl font-bold mb-4 text-center">Deeraj Dasari</h2>
              
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                <span className="px-3 py-1 rounded-full bg-brand-500/20 text-sm border border-brand-400/30">
                  Founder & Builder
                </span>
                <span className="px-3 py-1 rounded-full bg-brand-500/20 text-sm border border-brand-400/30">
                  Age: 17
                </span>
                <span className="px-3 py-1 rounded-full bg-brand-500/20 text-sm border border-brand-400/30">
                  1st Year CSE
                </span>
              </div>
              
              <p className="text-center mb-6 text-white/80">
                Gen-Z technologist transforming career planning with AI.<br />
                Fuelled by code, creativity & community.
              </p>
              
              <div className="flex justify-center gap-4 mb-6">
                <a href="https://github.com/deerajdasari" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile" className="p-2 rounded-full hover:bg-white/10 transition-colors">
                  <Github className="h-6 w-6 text-white hover:text-brand-400 transition-colors" />
                </a>
                <a href="https://linkedin.com/in/deerajdasari" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile" className="p-2 rounded-full hover:bg-white/10 transition-colors">
                  <Linkedin className="h-6 w-6 text-white hover:text-brand-400 transition-colors" />
                </a>
                <a href="https://twitter.com/deerajdasari" target="_blank" rel="noopener noreferrer" aria-label="Twitter Profile" className="p-2 rounded-full hover:bg-white/10 transition-colors">
                  <Twitter className="h-6 w-6 text-white hover:text-brand-400 transition-colors" />
                </a>
              </div>
              
              <div className="text-center">
                <Button className="glowing-purple" asChild>
                  <a href="mailto:deeraj@careermapai.in">Connect with Deeraj</a>
                </Button>
              </div>
            </div>
          </section>

          {/* Story & Vision Section */}
          <section className="py-16 bg-gradient-to-br from-cyber-deeper to-cyber-dark">
            <div className="container mx-auto px-4">
              <div className="flex flex-col lg:flex-row gap-12 items-center">
                {/* Quote Column */}
                <div className="lg:w-1/2 animate-on-scroll">
                  <blockquote className="text-2xl md:text-3xl font-serif italic bg-gradient-to-br from-white via-white/90 to-white/70 bg-clip-text text-transparent leading-relaxed">
                    "Most career tools are built by people who don't get us. 
                    I'm changing that with empathy and AI."
                  </blockquote>
                </div>
                
                {/* Story Column */}
                <div className="lg:w-1/2 space-y-8 animate-on-scroll">
                  <div>
                    <h3 className="text-xl font-bold mb-3 text-white">Why I Built CareerMap</h3>
                    <p className="text-white/80">
                      As a first-year CSE student, I saw firsthand how challenging career planning is for Gen Z in India. 
                      We face overwhelming options, outdated guidance, and anxiety about making the right choices. 
                      Traditional career platforms felt disconnected from our reality - built by people who don't understand our challenges.
                      
                      I created CareerMapAI to solve this exact problem. By merging AI with empathetic design, we're building the career 
                      companion I wish I had. One that understands India's unique context, offers personalized guidance, and grows 
                      alongside you through your professional journey.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold mb-3 text-white">The Vision Ahead</h3>
                    <p className="text-white/80">
                      CareerMapAI is evolving beyond roadmaps. Our next-generation features include AI mentor matching that connects 
                      users with professionals in their dream careers, sophisticated job preparation tools tailored for the Indian market, 
                      and comprehensive skill assessments. We're starting with India's unique needs before expanding globally.
                      
                      I'm building CareerMapAI to be the career platform I needed when making my own career decisions - intuitive, 
                      personalized, and genuinely helpful.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-10 text-center animate-on-scroll">
                <h4 className="text-xl font-semibold bg-gradient-to-r from-brand-300 to-brand-500 bg-clip-text text-transparent">
                  Backed by Purpose, Designed for Scale.
                </h4>
                <p className="mt-4 text-white/70 italic">
                  Actively seeking strategic partners & early-stage investors.
                </p>
              </div>
            </div>
          </section>

          {/* Featured Badges Section (Optional) */}
          <section className="py-12 animate-on-scroll">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto glass-morphism rounded-xl p-6">
                <div className="flex flex-wrap justify-center items-center gap-8">
                  <div className="w-20 h-12 bg-white/10 rounded flex items-center justify-center">
                    <span className="text-xs font-semibold text-white/80">YourStory</span>
                  </div>
                  <div className="w-20 h-12 bg-white/10 rounded flex items-center justify-center">
                    <span className="text-xs font-semibold text-white/80">HackerNoon</span>
                  </div>
                  <div className="w-20 h-12 bg-white/10 rounded flex items-center justify-center">
                    <span className="text-xs font-semibold text-white/80">CodeCrew</span>
                  </div>
                  <div className="w-20 h-12 bg-white/10 rounded flex items-center justify-center">
                    <span className="text-xs font-semibold text-white/80">TechSoc</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Call-to-Action Footer */}
          <section className="py-16 bg-gradient-to-br from-cyber-midnight to-cyber-deeper animate-on-scroll">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-white via-white/90 to-white/70 bg-clip-text text-transparent mb-8">
                Join us in mapping the future of careers.
              </h2>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
                <Button size="lg" className="glowing-purple">
                  <a href="https://calendly.com/careermapai/demo" target="_blank" rel="noopener noreferrer">
                    Request Demo
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/">Back to Home</Link>
                </Button>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
