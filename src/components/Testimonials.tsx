
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Alex Johnson",
    role: "Frontend Developer",
    content: "CareerPath helped me transition from a marketing role to becoming a frontend developer. The roadmap was so detailed and practical!",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces&auto=format&q=60",
    initials: "AJ"
  },
  {
    name: "Priya Sharma",
    role: "Data Analyst",
    content: "The AI career matching suggested data analysis as my ideal path, and it was spot on! I'm now working at a company I love.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces&auto=format&q=60",
    initials: "PS"
  },
  {
    name: "Marcus Chen",
    role: "UX Designer",
    content: "The Career Chat AI was like having a mentor available 24/7. It guided me through building my portfolio and preparing for interviews.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=faces&auto=format&q=60",
    initials: "MC"
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { 
    y: 0, 
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export default function Testimonials() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-brand-400/5 blur-[120px] -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-brand-500/5 blur-[100px] -z-10"></div>
      
      <div className="container px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-brand-200 via-brand-300 to-brand-400 neon-purple-text">
            Success Stories
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Real people who transformed their careers with CareerPath's guidance.
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index} 
              variants={item}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.2)] h-full overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-400/0 to-brand-500/0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="#9b87f5"
                        stroke="#9b87f5"
                        className="mr-1"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-white/90 italic mb-2">"{testimonial.content}"</p>
                </CardContent>
                <CardFooter className="pt-4 pb-6 border-t border-white/10 mt-auto">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3 ring-1 ring-white/20">
                      <AvatarImage src={testimonial.image} alt={testimonial.name} />
                      <AvatarFallback className="bg-brand-800 text-white">{testimonial.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-white">{testimonial.name}</p>
                      <p className="text-sm text-white/60">{testimonial.role}</p>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
