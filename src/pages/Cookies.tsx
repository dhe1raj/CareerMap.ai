
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Cookies() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-16 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Cookie Policy</h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">What Are Cookies</h2>
              <p className="text-gray-700">
                Cookies are small text files that are placed on your device when you visit a website. 
                They are widely used to make websites work more efficiently and provide information to 
                the website owners. Cookies enhance your browsing experience by allowing websites 
                to remember your preferences and understand how you use different parts of a website.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">How We Use Cookies</h2>
              <p className="text-gray-700">
                At CareerMap, we use cookies for various purposes, including:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-700">
                <li><strong>Essential cookies:</strong> These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and account access.</li>
                <li><strong>Analytical/Performance cookies:</strong> These cookies allow us to recognize and count the number of visitors and see how visitors move around our website. This helps us improve the way our website works.</li>
                <li><strong>Functionality cookies:</strong> These cookies are used to recognize you when you return to our website. They enable us to personalize our content for you and remember your preferences.</li>
                <li><strong>Targeting cookies:</strong> These cookies record your visit to our website, the pages you have visited, and the links you have followed. We use this information to make our website and the advertising displayed on it more relevant to your interests.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">Types of Cookies We Use</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">1. Session Cookies</h3>
                  <p className="text-gray-700">
                    Session cookies are temporary and deleted from your device when you close your web browser. 
                    We use session cookies to help us track internet usage as described above.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900">2. Persistent Cookies</h3>
                  <p className="text-gray-700">
                    Persistent cookies remain on your device for a set period or until you delete them. 
                    They are activated each time you visit the website that created the cookie. 
                    We use persistent cookies to help us recognize you as a unique visitor when you return to our website.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900">3. Third-Party Cookies</h3>
                  <p className="text-gray-700">
                    These cookies are placed by third-party services that appear on our pages. 
                    We use third-party cookies for analytics, marketing, and functionality purposes.
                  </p>
                </div>
              </div>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">Managing Cookies</h2>
              <p className="text-gray-700">
                Most web browsers allow you to manage your cookie preferences. You can:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-700">
                <li>Delete cookies from your device</li>
                <li>Block cookies by activating the setting on your browser that allows you to refuse the setting of all or some cookies</li>
                <li>Set your browser to notify you when you receive a cookie</li>
              </ul>
              <p className="text-gray-700 mt-3">
                Please note that if you limit the ability of websites to set cookies, you may worsen your overall user 
                experience and/or lose the ability to access certain features of our website.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">Changes to Our Cookie Policy</h2>
              <p className="text-gray-700">
                We may update our Cookie Policy from time to time. Any changes will be posted on this page. 
                We encourage you to periodically review this page for the latest information on our cookie practices.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p className="text-gray-700">
                If you have any questions about our Cookie Policy, please contact us at:
              </p>
              <div className="mt-3 text-gray-700">
                <p>Email: privacy@careermap.ai</p>
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
