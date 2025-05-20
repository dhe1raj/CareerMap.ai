
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Users, HelpCircle, Contact } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero section */}
        <section className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">About CareerPath</h1>
            <p className="text-xl md:text-2xl max-w-3xl">
              We're on a mission to help people discover and pursue their ideal career paths using the power of AI.
            </p>
          </div>
        </section>

        {/* Our Mission */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Our Mission</h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-lg mb-6">
                At CareerPath, we believe everyone deserves a fulfilling career that aligns with their skills, interests, and life goals.
              </p>
              <p className="text-lg mb-6">
                Our AI-powered platform breaks down the barriers to career discovery and development, making personalized guidance accessible to all.
              </p>
              <p className="text-lg">
                We're committed to leveraging cutting-edge technology to democratize career planning and create clear, actionable pathways to professional success.
              </p>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card>
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                    <Users className="w-12 h-12 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Leadership</h3>
                  <p className="text-gray-600">
                    Our diverse leadership team brings decades of experience in tech, education, and career development.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                    <HelpCircle className="w-12 h-12 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">AI Experts</h3>
                  <p className="text-gray-600">
                    Our AI team is dedicated to building models that deliver accurate, personalized career guidance.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-violet-100 rounded-full flex items-center justify-center mb-4">
                    <Contact className="w-12 h-12 text-violet-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Support</h3>
                  <p className="text-gray-600">
                    Our customer success team ensures you get the most value from our platform throughout your career journey.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div>
                <h3 className="text-xl font-bold mb-3 text-purple-600">Innovation</h3>
                <p className="text-gray-700">
                  We constantly push the boundaries of what's possible with AI and career guidance technology.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-3 text-purple-600">Accessibility</h3>
                <p className="text-gray-700">
                  We're committed to making career guidance available to everyone, regardless of background or resources.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-3 text-purple-600">Quality</h3>
                <p className="text-gray-700">
                  We strive for excellence in our AI algorithms, ensuring reliable and valuable guidance.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-3 text-purple-600">Empowerment</h3>
                <p className="text-gray-700">
                  We believe in empowering individuals to take control of their career paths and professional growth.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Get in Touch</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Have questions about our platform or want to learn more about how we can help with your career journey?
            </p>
            <a 
              href="mailto:contact@careerpath.ai" 
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
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
