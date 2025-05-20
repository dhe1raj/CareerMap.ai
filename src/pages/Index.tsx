
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-brand-900 to-black overflow-hidden">
      {/* Glassmorphism background elements */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-brand-400/30 blur-[100px]"></div>
        <div className="absolute bottom-20 right-1/4 w-72 h-72 rounded-full bg-brand-500/20 blur-[80px]"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full bg-brand-600/30 blur-[90px]"></div>
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
