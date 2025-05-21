
import React from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Mail, Github, Linkedin } from "lucide-react";
import SEOMetadata from "@/components/SEOMetadata";

const Founder = () => {
  return (
    <>
      <SEOMetadata
        title="Meet Deeraj - Founder of CareerMapAI"
        description="Learn about Deeraj, the 17-year-old founder of CareerMapAI - building smarter, more accessible career planning tools for Gen Z."
        keywords="Deeraj, CareerMapAI, founder, tech entrepreneur, career planning, AI career tools, GITAM University"
        canonicalPath="/founder"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "Deeraj",
          "jobTitle": "Founder & Builder",
          "description": "Founder of CareerMapAI, a platform for AI-powered career roadmap generation.",
          "affiliation": {
            "@type": "Organization",
            "name": "CareerMapAI"
          },
          "url": "https://careermapai.in/founder",
          "sameAs": [
            "https://github.com/dhe1raj",
            "https://www.linkedin.com/in/dhe1raj/"
          ]
        }}
      />
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-black/90 to-brand-900/80">
        <Navbar />
        
        <main className="flex-grow">
          {/* Hero Section */}
          <section className="container max-w-6xl px-4 py-12 md:py-20 mx-auto">
            <div className="relative glass-morphism rounded-2xl p-8 md:p-12 overflow-hidden">
              <div className="absolute inset-0 -z-10">
                <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-brand-400/10 blur-[130px] animate-pulse-glow"></div>
                <div className="absolute bottom-20 right-1/4 w-72 h-72 rounded-full bg-brand-500/10 blur-[100px] animate-pulse-glow"></div>
              </div>

              <div className="flex flex-col md:flex-row items-center md:items-center gap-10">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className="w-full md:w-1/2 flex justify-center md:justify-start"
                >
                  <div className="relative">
                    <div className="absolute -inset-2 bg-gradient-to-r from-brand-400 to-brand-600 rounded-full blur-md opacity-40 animate-pulse-glow"></div>
                    <img 
                      src="/lovable-uploads/fbfa90e3-d0b7-460d-b236-b92a802795ea.png" 
                      alt="Deeraj - Founder of CareerMapAI" 
                      className="relative rounded-full w-64 h-64 object-cover border-4 border-white/10 shadow-2xl shadow-brand-500/30 z-10" 
                    />
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="w-full md:w-1/2 text-center md:text-left"
                >
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-brand-300 mb-4">
                    Founder of CareerMap
                  </h1>
                  <p className="text-xl md:text-2xl text-white/80 italic mb-8">
                    Driven by curiosity. Built with purpose.
                  </p>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Founder Details Section */}
          <section className="container max-w-6xl px-4 py-12 mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="glass-morphism rounded-2xl p-8 md:p-12"
            >
              <div className="flex flex-col gap-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Deeraj</h2>
                  <p className="text-xl text-brand-400 font-medium mb-4">Founder & Builder of CareerMapAI</p>
                  <div className="text-white/70">
                    <p>Age: 17</p>
                    <p>Currently: 1st Year CSE student at <span className="text-white font-medium">GITAM University (Class of 2025)</span></p>
                  </div>
                </div>
                
                <div className="mt-2">
                  <p className="text-white/80 text-lg leading-relaxed">
                    I started CareerMap to make career planning smarter and more accessible. As a Gen Z techie, 
                    I've always believed in solving problems with creativity and code. I wanted to help students and 
                    professionals take control of their future with AI — not just follow the crowd.
                  </p>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-4">
                  <a 
                    href="https://github.com/dhe1raj" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-white/80 hover:text-white transition-colors px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10"
                  >
                    <Github size={18} />
                    <span>GitHub</span>
                  </a>
                  <a 
                    href="https://www.linkedin.com/in/dhe1raj/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-white/80 hover:text-white transition-colors px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10"
                  >
                    <Linkedin size={18} />
                    <span>LinkedIn</span>
                  </a>
                  <a 
                    href="mailto:dasaridheerajdheeraj@gmail.com" 
                    className="flex items-center gap-2 text-white/80 hover:text-white transition-colors px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10"
                  >
                    <Mail size={18} />
                    <span>Email</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </section>

          {/* Vision Section */}
          <section className="container max-w-6xl px-4 py-12 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="glass-morphism rounded-2xl p-8 md:p-12"
            >
              <h2 className="text-3xl font-bold text-white mb-8">Why I Built CareerMap</h2>
              
              <div className="bg-white/5 border-l-4 border-brand-400 pl-6 py-4 mb-8 rounded-r-lg">
                <p className="text-xl text-white/90 italic">
                  "Most career tools are boring, confusing, or built by people who don't get us. 
                  I wanted to change that. CareerMap is built for our generation — visual, 
                  AI-powered, and built with empathy."
                </p>
              </div>
              
              <div>
                <h3 className="text-2xl font-semibold text-brand-300 mb-4">The Vision Ahead</h3>
                <p className="text-lg text-white/80 leading-relaxed">
                  I see CareerMap growing into a full ecosystem — with mentor matching, 
                  job-ready training paths, and AI that grows with you. My mission is to empower 
                  students across India (and beyond) to design their own success story.
                </p>
              </div>
              
              <div className="mt-10">
                <Button 
                  variant="neon" 
                  size="lg"
                  className="w-full sm:w-auto"
                  asChild
                >
                  <a href="mailto:dasaridheerajdheeraj@gmail.com">
                    Message Deeraj
                  </a>
                </Button>
              </div>
            </motion.div>
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Founder;
