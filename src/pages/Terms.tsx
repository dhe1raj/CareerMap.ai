
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
              <h2 className="text-2xl font-semibold mb-4">Agreement to Terms</h2>
              <p className="text-gray-700">
                By accessing or using CareerForge ("we," "our," or "us"), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">Use License</h2>
              <p className="text-gray-700">
                Permission is granted to temporarily access the materials on CareerForge's website for personal, non-commercial use only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-700">
                <li>Modify or copy the materials;</li>
                <li>Use the materials for any commercial purpose;</li>
                <li>Attempt to decompile or reverse engineer any software contained on CareerForge;</li>
                <li>Remove any copyright or other proprietary notations from the materials;</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">Disclaimer</h2>
              <p className="text-gray-700">
                The materials on CareerForge's website are provided on an 'as is' basis. CareerForge makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
              <p className="text-gray-700 mt-3">
                Further, CareerForge does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">Limitations</h2>
              <p className="text-gray-700">
                In no event shall CareerForge or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on CareerForge's website, even if CareerForge or a CareerForge authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">Accuracy of Materials</h2>
              <p className="text-gray-700">
                The materials appearing on CareerForge's website could include technical, typographical, or photographic errors. CareerForge does not warrant that any of the materials on its website are accurate, complete or current. CareerForge may make changes to the materials contained on its website at any time without notice. However, CareerForge does not make any commitment to update the materials.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">Links</h2>
              <p className="text-gray-700">
                CareerForge has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by CareerForge of the site. Use of any such linked website is at the user's own risk.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">Modifications</h2>
              <p className="text-gray-700">
                CareerForge may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">Governing Law</h2>
              <p className="text-gray-700">
                These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
              <p className="text-gray-700">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="mt-3 text-gray-700">
                <p>Email: legal@careerforge.ai</p>
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
