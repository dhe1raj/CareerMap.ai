
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOMetadata from "@/components/SEOMetadata";

export default function Terms() {
  // JSON-LD schema for Terms page
  const termsJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Terms and Conditions | CareerMapAI",
    "description": "Terms and conditions for using CareerMapAI's services. Our platform policies, user agreements, and legal information.",
    "publisher": {
      "@type": "Organization",
      "name": "CareerMapAI",
      "logo": {
        "@type": "ImageObject",
        "url": "https://careermapai.in/lovable-uploads/6dada9e0-7c2b-4be1-8795-cb8580fec628.png"
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEOMetadata 
        title="Terms and Conditions | CareerMapAI"
        description="Terms and conditions for using CareerMapAI's services. Our platform policies, user agreements, and legal information."
        keywords="careermapai terms, career map ai conditions, terms of service, user agreement, legal terms"
        canonicalPath="/terms"
        jsonLd={termsJsonLd}
      />
      <Navbar />
      <main className="flex-grow py-16 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Terms and Conditions</h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p className="text-gray-700">
                Welcome to CareerMapAI ("we," "our," or "us"). These Terms and Conditions govern your use of our website located at 
                careermapai.in (the "Service") and form a binding contractual agreement between you, the user of the Service and us.
              </p>
              <p className="text-gray-700 mt-3">
                By accessing or using the Service, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. 
                If you do not agree to these Terms and Conditions, please do not use our Service.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Definitions</h2>
              <p className="text-gray-700">
                Throughout these Terms and Conditions, the following terms shall have the meanings defined below:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-700">
                <li>"User" refers to any individual who accesses or uses our Service.</li>
                <li>"Content" refers to all text, data, information, software, graphics, photographs, and other materials uploaded, downloaded, or appearing on the Service.</li>
                <li>"User Content" refers to any content submitted by users, including career information, profiles, and feedback.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
              <p className="text-gray-700">
                To access certain features of our Service, you may be required to create an account. You are responsible for:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-700">
                <li>Maintaining the confidentiality of your account credentials.</li>
                <li>All activities that occur under your account.</li>
                <li>Providing accurate and complete information when creating your account.</li>
                <li>Notifying us immediately of any unauthorized use of your account.</li>
              </ul>
              <p className="text-gray-700 mt-3">
                We reserve the right to suspend or terminate accounts that violate our terms or policies.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">4. User Content</h2>
              <p className="text-gray-700">
                By submitting User Content to the Service, you:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-700">
                <li>Grant us a non-exclusive, transferable, sub-licensable, royalty-free, worldwide license to use, modify, adapt, reproduce, distribute, and publish the User Content.</li>
                <li>Represent and warrant that you own or have the necessary rights to submit the User Content.</li>
                <li>Acknowledge that your User Content may be visible to other users of the Service.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Prohibited Activities</h2>
              <p className="text-gray-700">
                You agree not to engage in any of the following activities:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-700">
                <li>Violating any applicable laws or regulations.</li>
                <li>Impersonating any person or entity or falsely stating or otherwise misrepresenting your affiliation.</li>
                <li>Uploading viruses or malicious code or conducting any activity that disrupts the Service.</li>
                <li>Attempting to access any unauthorized parts of the Service.</li>
                <li>Using the Service for any illegal or unauthorized purpose.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
              <p className="text-gray-700">
                The Service and its original content, features, and functionality are owned by CareerMapAI and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Termination</h2>
              <p className="text-gray-700">
                We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason, including, without limitation, if you breach these Terms and Conditions.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
              <p className="text-gray-700">
                In no event shall CareerMapAI, its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Changes to Terms</h2>
              <p className="text-gray-700">
                We reserve the right to modify or replace these Terms and Conditions at any time. We will provide notice of any significant changes by posting the new Terms and Conditions on this page.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
              <p className="text-gray-700">
                If you have any questions about these Terms and Conditions, please contact us at:
              </p>
              <div className="mt-3 text-gray-700">
                <p>Email: legal@careermapai.in</p>
                <p className="mt-2">Last Updated: May 21, 2025</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
