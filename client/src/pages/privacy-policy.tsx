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
                  DriveAllow, Inc. ("we," "our," "us," or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our teen driver monitoring and allowance management service (the "Service").
                </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                  <strong>Legal Basis:</strong> For users in the European Economic Area, our legal basis for processing personal data includes: legitimate interests (safety monitoring), contractual necessity (service provision), legal compliance, and parental consent (for minors).
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
                <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Teen Privacy and Parental Rights</h2>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                  <p className="text-blue-800 font-semibold">
                    IMPORTANT: Special provisions apply to users under 18
                  </p>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Parental Consent Required:</strong> Teen users under 18 cannot use DriveAllow without verifiable parental consent. By registering a teen account, parents affirm they have legal authority over the minor and consent to all data collection and processing described in this policy.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>COPPA Compliance:</strong> For users under 13, we comply with the Children's Online Privacy Protection Act (COPPA). We do not knowingly collect personal information from children under 13 without parental consent.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Parental Access:</strong> Parents have full access to all data collected about their minor teens, including location data, driving behavior, and financial transactions. This access continues until the teen reaches 18 or the account is terminated.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Teen Rights Upon Majority:</strong> When teens reach 18, they may request to convert their account to an independent adult account or request deletion of their data.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Data Sharing and Disclosure</h2>
                <p className="text-gray-700 leading-relaxed mb-4">We do not sell, rent, or lease your personal information to third parties. We may share information in these specific circumstances:</p>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Emergency Situations</h3>
                    <p className="text-gray-700 leading-relaxed">
                      We may immediately share location and incident data with emergency services (911, police, hospitals) if our systems detect indicators of severe accidents or safety risks. This may occur without prior notice to protect life and safety.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Legal Requirements</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>Court orders, subpoenas, or legal process</li>
                      <li>Law enforcement requests with proper authority</li>
                      <li>Compliance with applicable laws and regulations</li>
                      <li>Protection of our rights, property, or safety</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Service Providers</h3>
                    <p className="text-gray-700 leading-relaxed">
                      We may share data with trusted third-party service providers who assist with: hosting, mapping services, payment processing, analytics, and customer support. These providers are contractually bound to protect your information.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Business Transfers</h3>
                    <p className="text-gray-700 leading-relaxed">
                      In the event of a merger, acquisition, or sale of assets, user data may be transferred to the new entity. Users will be notified with at least 30 days' notice and the opportunity to delete their accounts.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Data Security</h2>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Security Measures:</strong> We implement industry-standard security measures including AES-256 encryption, secure HTTPS transmission, multi-factor authentication, regular security audits, and strict access controls.
                  </p>
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <p className="text-yellow-800">
                      <strong>Security Disclaimer:</strong> Despite our security measures, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security of your information. You acknowledge and accept these inherent risks when using our service.
                    </p>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Breach Notification:</strong> In the event of a data breach affecting personal information, we will notify affected users within 72 hours of discovery and report to applicable authorities as required by law.
                  </p>
                </div>
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
                <h2 className="text-xl font-semibold text-gray-900 mb-3">9. International Data Transfers</h2>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Primary Jurisdiction:</strong> DriveAllow is based in the United States and primarily designed for US users. Our servers and data processing facilities are located in the United States.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>International Transfers:</strong> If you are located outside the United States, your personal information will be transferred to and processed in the United States, which may have different data protection laws than your country of residence.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>EU/EEA Users:</strong> For users in the European Economic Area, we rely on adequacy decisions, Standard Contractual Clauses, or your explicit consent for international transfers. You have the right to obtain information about transfer safeguards.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>State Law Compliance:</strong> We comply with applicable US state privacy laws including the California Consumer Privacy Act (CCPA), Virginia Consumer Data Protection Act (VCDPA), and similar regulations.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Changes to This Policy</h2>
                <p className="text-gray-700 leading-relaxed">
                  We may update this Privacy Policy periodically. We will notify you of significant changes via email or app notification. Continued use of DriveAllow constitutes acceptance of the updated policy.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Data Protection Officer and Contact Information</h2>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    For questions about this Privacy Policy, your data rights, or to exercise any of your rights, contact us at:
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">
                      <strong>Privacy Officer:</strong><br />
                      DriveAllow, Inc.<br />
                      1234 Business Lane, Suite 100<br />
                      Dover, DE 19901<br />
                      Email: privacy@driveallow.com<br />
                      Phone: 1-800-DRIVEALLOW<br />
                      Fax: (302) 555-0199
                    </p>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Response Time:</strong> We will respond to privacy requests within 30 days. For complex requests, we may extend this period by an additional 60 days with notification.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>EU Representative:</strong> If you are in the European Economic Area and we are required to appoint an EU representative, contact information will be provided upon request.
                  </p>
                </div>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}