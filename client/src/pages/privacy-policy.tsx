import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicy() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">Privacy Policy</CardTitle>
              <p className="text-center text-gray-600">Last updated: December 2024</p>
            </CardHeader>
            <CardContent className="prose max-w-none space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Introduction</h2>
                <p className="text-gray-700 leading-relaxed">
                  DriveAllow ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our teen driver monitoring and allowance management service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Information We Collect</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Personal Information</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>Name, email address, and contact information</li>
                      <li>Parent-teen relationship verification</li>
                      <li>Account credentials and preferences</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Driving Data</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>GPS location and speed data from mobile devices</li>
                      <li>Accelerometer data for detecting driving behaviors</li>
                      <li>Driving incidents and violations</li>
                      <li>Route information and trip history</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Financial Data</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>Allowance amounts and settings</li>
                      <li>Transaction history (penalties, bonuses)</li>
                      <li>Payment method information (if applicable)</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">3. How We Use Your Information</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Monitor teen driving behavior and safety</li>
                  <li>Calculate and manage allowances and penalties</li>
                  <li>Send notifications about driving incidents</li>
                  <li>Provide parental oversight and reporting</li>
                  <li>Improve our service and user experience</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Teen Privacy Rights</h2>
                <p className="text-gray-700 leading-relaxed">
                  We recognize that teens have privacy rights. However, DriveAllow is designed as a family safety tool requiring parental supervision. Teen users under 18 must have parental consent to use our service. Parents have access to all driving data and transaction history for safety and oversight purposes.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Data Sharing and Disclosure</h2>
                <p className="text-gray-700 leading-relaxed mb-4">We do not sell your personal information. We may share information in these limited circumstances:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>With emergency services if immediate safety risk is detected</li>
                  <li>When required by law or legal process</li>
                  <li>With service providers who assist in app functionality</li>
                  <li>In case of business transfer or merger (with user notification)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Data Security</h2>
                <p className="text-gray-700 leading-relaxed">
                  We implement industry-standard security measures including encryption, secure data transmission, and access controls. However, no method of transmission over the internet is 100% secure. We regularly update our security practices and systems.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Data Retention</h2>
                <p className="text-gray-700 leading-relaxed">
                  We retain driving data for up to 2 years for safety analysis and reporting. Account information is retained while your account is active. You may request data deletion, though some information may be retained for legal compliance.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Your Rights</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Access your personal information</li>
                  <li>Request corrections to inaccurate data</li>
                  <li>Request deletion of your account and data</li>
                  <li>Opt out of non-essential communications</li>
                  <li>Export your data in a common format</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">9. International Users</h2>
                <p className="text-gray-700 leading-relaxed">
                  DriveAllow is primarily designed for users in the United States. If you are located outside the US, your information may be transferred to and processed in the United States where our servers are located.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Changes to This Policy</h2>
                <p className="text-gray-700 leading-relaxed">
                  We may update this Privacy Policy periodically. We will notify you of significant changes via email or app notification. Continued use of DriveAllow constitutes acceptance of the updated policy.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Contact Us</h2>
                <p className="text-gray-700 leading-relaxed">
                  For questions about this Privacy Policy or your data, contact us at:<br />
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