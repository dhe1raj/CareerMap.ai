
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import SEOMetadata from "@/components/SEOMetadata";

export default function Index() {
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-cyber-deeper via-brand-900 to-cyber-dark overflow-hidden noise-bg">
      <SEOMetadata 
        title="CareerMapAI - India's #1 AI-Powered Career Roadmap Generator"
        description="CareerMapAI is India's #1 AI-powered career roadmap builder, helping Gen Z design their future with AI precision. Create your personalized career path today."
        keywords="careermapai, career map ai, ai roadmap builder, ai career planner, career progress tracker, india career planning"
        canonicalPath="/"
        jsonLd={homeJsonLd}
      />
      
      {/* Background elements with subtle non-animated effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-brand-400/10 blur-[120px]"></div>
        <div className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full bg-brand-500/10 blur-[100px]"></div>
        <div className="absolute top-1/3 right-1/3 w-64 h-64 rounded-full bg-brand-600/10 blur-[150px]"></div>
        
        {/* Subtle grid overlay with improved opacity */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNNjAgMEgwdjYwaDYwVjB6TTMwIDYwVjBtMzAgMzBIMCIgc3Ryb2tlPSNyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIi8+PC9nPjwvc3ZnPg==')] opacity-15"></div>
      </div>
      
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
