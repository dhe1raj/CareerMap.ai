
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-16 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Privacy Policy</h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
              <p className="text-gray-700">
                CareerForge ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how 
                your personal information is collected, used, and disclosed by CareerForge. This Privacy Policy applies to 
                our website, and its associated services (collectively, our "Service").
              </p>
              <p className="text-gray-700 mt-3">
                By accessing or using our Service, you signify that you have read, understood, and agree to our collection, 
                storage, use, and disclosure of your personal information as described in this Privacy Policy.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
              <p className="text-gray-700">
                We collect information that you provide directly to us when you register for an account, create or modify your 
                profile, use the features of our platform, or communicate with us. This information may include:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-700">
                <li>Your name, email address, and password</li>
                <li>Profile information (such as your job title, education, skills)</li>
                <li>Career preference information</li>
                <li>Survey responses</li>
                <li>Information you provide when you contact us</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
              <p className="text-gray-700">
                We use the information we collect for various purposes, including to:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-700">
                <li>Provide, maintain, and improve our Service</li>
                <li>Create and personalize your career roadmap and recommendations</li>
                <li>Process and complete transactions</li>
                <li>Send you technical notices, updates, security alerts, and administrative messages</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Communicate with you about products, services, offers, and events</li>
                <li>Monitor and analyze trends, usage, and activities in connection with our Service</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">Information Sharing and Disclosure</h2>
              <p className="text-gray-700">
                We may share your personal information in the following situations:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-700">
                <li><strong>With service providers:</strong> We may share your information with third-party vendors and service providers that provide services on our behalf, such as hosting, data analytics, and customer service.</li>
                <li><strong>With your consent:</strong> We may share your information when you give us explicit permission to do so.</li>
                <li><strong>For legal reasons:</strong> We may disclose your information where required to do so by law or in response to valid requests by public authorities.</li>
                <li><strong>Business transfers:</strong> We may share or transfer your information in connection with a merger, acquisition, reorganization, or sale of all or a portion of our assets.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
              <p className="text-gray-700">
                We have implemented appropriate technical and organizational security measures designed to protect the security of any personal 
                information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure. 
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
              <p className="text-gray-700">
                Depending on your location, you may have certain rights regarding your personal information, such as:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-700">
                <li>The right to access personal information we hold about you</li>
                <li>The right to request correction of your personal information</li>
                <li>The right to request deletion of your personal information</li>
                <li>The right to opt out of marketing communications</li>
              </ul>
              <p className="text-gray-700 mt-3">
                To exercise these rights, please contact us using the information provided below.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">Changes to This Privacy Policy</h2>
              <p className="text-gray-700">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page 
                and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p className="text-gray-700">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <div className="mt-3 text-gray-700">
                <p>Email: privacy@careerforge.ai</p>
                <p className="mt-2">Last Updated: May 20, 2025</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
