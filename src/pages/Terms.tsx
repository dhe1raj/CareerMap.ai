
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-16 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Terms of Service</h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p className="text-gray-700">
                Welcome to CareerMap. By accessing and using our website and services, you agree to be bound by these Terms of Service 
                ("Terms"). If you do not agree to these Terms, please do not use our services.
              </p>
              <p className="text-gray-700 mt-3">
                These Terms constitute a legally binding agreement between you (the "User") and CareerMap 
                ("we," "us," or "our") regarding your use of our website and services.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Services Description</h2>
              <p className="text-gray-700">
                CareerMap provides AI-powered career planning tools, roadmap generation, career matching, 
                resume analysis, and related career development services. Our services are designed to help 
                users identify and pursue suitable career paths based on their preferences, skills, and goals.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
              <p className="text-gray-700">
                To access certain features of our service, you must register for an account. When registering, you agree to:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-700">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and promptly update your account information</li>
                <li>Keep your password secure and confidential</li>
                <li>Be responsible for all activities that occur under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Acceptable Use Policy</h2>
              <p className="text-gray-700">
                You agree not to use our services to:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-700">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon the rights of others</li>
                <li>Distribute malicious software or harmful content</li>
                <li>Attempt to gain unauthorized access to our systems or user accounts</li>
                <li>Engage in any activity that interferes with or disrupts our services</li>
                <li>Collect or harvest user data without permission</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property Rights</h2>
              <p className="text-gray-700">
                All content on our website, including but not limited to text, graphics, logos, icons, images, 
                audio clips, digital downloads, data compilations, and software, is the property of CareerMap 
                or its content suppliers and is protected by international copyright laws.
              </p>
              <p className="text-gray-700 mt-3">
                The roadmaps, career plans, and other outputs generated through our services are provided for your personal use. 
                You may not redistribute, sell, or otherwise commercialize these outputs without our permission.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Privacy</h2>
              <p className="text-gray-700">
                Our Privacy Policy describes how we collect, use, and share information about you when you use our 
                services. By using CareerMap, you agree to the collection and use of information in accordance with our Privacy Policy.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
              <p className="text-gray-700">
                To the maximum extent permitted by law, CareerMap shall not be liable for any indirect, incidental, 
                special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly 
                or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-700">
                <li>Your use or inability to use our services</li>
                <li>Any unauthorized access to or use of our servers and/or any personal information stored therein</li>
                <li>Any errors or inaccuracies in our content or services</li>
                <li>Any decision made or action taken by you in reliance upon our services</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Changes to Terms</h2>
              <p className="text-gray-700">
                We reserve the right to modify these Terms at any time. If we make material changes, we will notify 
                you by email or by posting a notice on our website. Your continued use of our services after such 
                modifications constitutes your acceptance of the revised Terms.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Contact Information</h2>
              <p className="text-gray-700">
                If you have any questions about these Terms, please contact us at:
              </p>
              <div className="mt-3 text-gray-700">
                <p>Email: legal@careermap.ai</p>
                <p className="mt-2">Last Updated: May 22, 2025</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
