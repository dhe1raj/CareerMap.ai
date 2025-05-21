import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import { motion } from "framer-motion";
import SEOMetadata from "@/components/SEOMetadata";
import { Toaster } from "@/components/ui/toaster";

export default function Index() {
  // Add scroll animation effect with improved threshold and behavior
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          // Once it's visible, no need to keep observing
          observer.unobserve(entry.target);
        }
      });
    }, { 
      threshold: 0.15,
      rootMargin: "0px 0px -100px 0px" 
    });

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el);
      // Initially hide the element
      el.classList.add('opacity-0');
    });

    return () => observer.disconnect();
  }, []);

  // JSON-LD schema for the homepage
  const homeJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "CareerMapAI",
    "url": "https://careermapai.in",
    "description": "India's #1 AI-powered career planning and roadmap generator for your professional journey",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://careermapai.in/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="min-h-screen flex flex-col bg-gradient-to-b from-cyber-deeper via-brand-900 to-cyber-dark overflow-hidden noise-bg"
      >
        <SEOMetadata 
          title="CareerMapAI - India's #1 AI-Powered Career Roadmap Generator"
          description="CareerMapAI is India's #1 AI-powered career roadmap builder, helping Gen Z design their future with AI precision. Create your personalized career path today."
          keywords="careermapai, career map ai, ai roadmap builder, ai career planner, career progress tracker, india career planning"
          canonicalPath="/"
          jsonLd={homeJsonLd}
        />
        
        {/* Enhanced background elements with floating animations */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-brand-400/10 blur-[120px] animate-pulse-glow"></div>
          <div className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full bg-brand-500/10 blur-[100px] animate-pulse-glow" style={{ animationDelay: "1s" }}></div>
          <div className="absolute top-1/3 right-1/3 w-64 h-64 rounded-full bg-brand-600/10 blur-[150px] animate-pulse-glow" style={{ animationDelay: "2s" }}></div>
          
          {/* Floating orb elements with glow effects */}
          <motion.div
            className="absolute top-[15%] left-[10%] w-4 h-4 rounded-full bg-brand-400/40 shadow-[0_0_15px_5px_rgba(168,85,247,0.3)]"
            animate={{
              y: [0, -10, 0],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          ></motion.div>
          
          <motion.div
            className="absolute bottom-[20%] right-[15%] w-6 h-6 rounded-full bg-purple-500/40 shadow-[0_0_20px_8px_rgba(168,85,247,0.3)]"
            animate={{
              y: [0, 15, 0],
              opacity: [0.6, 0.9, 0.6],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          ></motion.div>
          
          <motion.div
            className="absolute top-[40%] right-[8%] w-3 h-3 rounded-full bg-brand-300/40 shadow-[0_0_10px_5px_rgba(168,85,247,0.3)]"
            animate={{
              y: [0, -12, 0],
              x: [0, 8, 0],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          ></motion.div>
          
          {/* Subtle grid overlay with improved opacity */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNNjAgMEgwdjYwaDYwVjB6TTMwIDYwVjBtMzAgMzBIMCIgc3Ryb2tlPSNyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIi8+PC9nPjwvc3ZnPg==')] opacity-15"></div>
        </div>
        
        <Navbar />
        <main className="flex-grow">
          <Hero />
          <motion.div 
            className="animate-on-scroll"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <Features />
          </motion.div>
          <motion.div 
            className="animate-on-scroll"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <Testimonials />
          </motion.div>
          <motion.div 
            className="animate-on-scroll"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <CTA />
          </motion.div>
        </main>
        <Footer />
      </motion.div>
      <Toaster />
    </>
  );
}
