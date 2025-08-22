import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CookiePolicy() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">Cookie Policy</CardTitle>
              <p className="text-center text-gray-600">Last updated: December 2024</p>
            </CardHeader>
            <CardContent className="prose max-w-none space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">What Are Cookies?</h2>
                <p className="text-gray-700 leading-relaxed">
                  Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to the owners of the site. DriveAllow uses cookies to enhance your experience and provide essential functionality.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">How We Use Cookies</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  DriveAllow uses cookies for several purposes:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>To keep you logged into your account during your session</li>
                  <li>To remember your preferences and settings</li>
                  <li>To ensure the security of your account and prevent fraud</li>
                  <li>To analyze how our service is used and improve functionality</li>
                  <li>To provide personalized content and features</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Types of Cookies We Use</h2>
                
                <div className="space-y-6">
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Essential Cookies</h3>
                    <p className="text-gray-700 leading-relaxed mb-2">
                      These cookies are necessary for DriveAllow to function properly. They enable core functionality such as security, network management, and accessibility.
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                      <li><strong>Session Cookies:</strong> Keep you logged in during your visit</li>
                      <li><strong>Security Cookies:</strong> Protect against cross-site request forgery</li>
                      <li><strong>Authentication Cookies:</strong> Verify your identity and maintain login state</li>
                    </ul>
                    <p className="text-sm text-gray-600 mt-2 italic">These cookies cannot be disabled as they are essential for the service to function.</p>
                  </div>

                  <div className="bg-green-50 border-l-4 border-green-400 p-4">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Functional Cookies</h3>
                    <p className="text-gray-700 leading-relaxed mb-2">
                      These cookies enable enhanced functionality and personalization, such as remembering your preferences.
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                      <li><strong>Preference Cookies:</strong> Remember your settings and dashboard preferences</li>
                      <li><strong>Language Cookies:</strong> Remember your preferred language</li>
                      <li><strong>Theme Cookies:</strong> Remember your display preferences</li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Analytics Cookies</h3>
                    <p className="text-gray-700 leading-relaxed mb-2">
                      These cookies help us understand how visitors use DriveAllow by collecting and reporting information anonymously.
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                      <li><strong>Usage Analytics:</strong> Track how features are used to improve the service</li>
                      <li><strong>Performance Analytics:</strong> Monitor app performance and identify issues</li>
                      <li><strong>Error Tracking:</strong> Help us identify and fix bugs</li>
                    </ul>
                    <p className="text-sm text-gray-600 mt-2 italic">These cookies are aggregated and anonymized.</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Third-Party Cookies</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  DriveAllow may use services from trusted third-party providers that may set their own cookies:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li><strong>HERE Maps:</strong> For location services and mapping functionality</li>
                  <li><strong>Authentication Providers:</strong> For secure login and session management</li>
                  <li><strong>Analytics Services:</strong> For understanding service usage and performance</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  These third parties have their own privacy policies and cookie policies, which we encourage you to review.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Cookie Duration</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Session Cookies</h3>
                    <p className="text-gray-700 leading-relaxed">
                      These are temporary cookies that expire when you close your browser. They are essential for maintaining your login session while using DriveAllow.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Persistent Cookies</h3>
                    <p className="text-gray-700 leading-relaxed">
                      These cookies remain on your device for a set period or until you delete them. They remember your preferences between visits, typically lasting:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 mt-2">
                      <li>Preference cookies: Up to 1 year</li>
                      <li>Analytics cookies: Up to 2 years</li>
                      <li>Authentication cookies: Up to 30 days</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Managing Your Cookie Preferences</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Browser Settings</h3>
                    <p className="text-gray-700 leading-relaxed mb-3">
                      Most web browsers allow you to control cookies through their settings. You can:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>View what cookies are stored and delete them individually</li>
                      <li>Block third-party cookies</li>
                      <li>Block cookies from particular sites</li>
                      <li>Block all cookies from being set</li>
                      <li>Delete all cookies when you close your browser</li>
                    </ul>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Important Note</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Disabling essential cookies may impact your ability to use DriveAllow. Some features may not work properly, and you may need to log in repeatedly during your session.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Browser-Specific Instructions</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Chrome</h3>
                    <p className="text-gray-700 text-sm">Settings → Privacy and security → Cookies and other site data</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Firefox</h3>
                    <p className="text-gray-700 text-sm">Settings → Privacy & Security → Cookies and Site Data</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Safari</h3>
                    <p className="text-gray-700 text-sm">Preferences → Privacy → Manage Website Data</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Edge</h3>
                    <p className="text-gray-700 text-sm">Settings → Site permissions → Cookies and site data</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Mobile App Data</h2>
                <p className="text-gray-700 leading-relaxed">
                  When using DriveAllow on mobile devices, we may store similar data locally on your device to provide functionality equivalent to web cookies. This includes login tokens, preferences, and cached data to improve performance. You can manage this data through your device's application settings.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Updates to This Policy</h2>
                <p className="text-gray-700 leading-relaxed">
                  We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any significant changes by posting a notice on our website or sending you an email notification.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Contact Us</h2>
                <p className="text-gray-700 leading-relaxed">
                  If you have any questions about our use of cookies or this Cookie Policy, please contact us at:<br />
                  <br />
                  Email: privacy@driveallow.com<br />
                  Address: [Your Business Address]<br />
                  Phone: [Your Phone Number]
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}