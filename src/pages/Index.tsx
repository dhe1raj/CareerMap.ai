
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import { useEffect } from "react";

export default function Index() {
  // Add scroll animation effect
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el);
      // Initially hide the element
      el.classList.add('opacity-0');
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-cyber-deeper via-brand-900 to-cyber-dark overflow-hidden noise-bg">
      {/* Futuristic background elements */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-brand-400/10 blur-[120px] animate-pulse-glow"></div>
        <div className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full bg-brand-500/10 blur-[100px] animate-pulse-glow"></div>
        <div className="absolute top-1/3 right-1/3 w-64 h-64 rounded-full bg-brand-600/10 blur-[150px] animate-pulse-glow"></div>
        
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNNjAgMEgwdjYwaDYwVjB6TTMwIDYwVjBtMzAgMzBIMCIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
      </div>
      
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <div className="animate-on-scroll">
          <Features />
        </div>
        <div className="animate-on-scroll">
          <Testimonials />
        </div>
        <div className="animate-on-scroll">
          <CTA />
        </div>
      </main>
      <Footer />
    </div>
  );
}
