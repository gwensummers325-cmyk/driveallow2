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
              <p className="text-center text-gray-600">Last updated: August 23, 2025</p>
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
                <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Types of Information We Collect and How</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We collect the following categories of personal information:
                </p>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Identifiers and Contact Details</h3>
                    <p className="text-gray-700 text-sm mb-2">Such as name, postal addresses, email addresses, telephone numbers, or other addresses at which you are able to receive communications.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Official Identification Information</h3>
                    <p className="text-gray-700 text-sm mb-2">Such as driver's license numbers, state ID information, or other government-issued identification that may be necessary to comply with legal obligations and verify user identity.</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Demographic Information</h3>
                    <p className="text-gray-700 text-sm mb-2">Such as age, date of birth, and family relationship information.</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Device and Network Information</h3>
                    <p className="text-gray-700 text-sm mb-2">Such as mobile device operating system type and version, manufacturer and model, browser type, IP address, unique identifiers, language settings, mobile device carrier, and general location information associated with IP address.</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Location and Motion Data</h3>
                    <p className="text-gray-700 text-sm mb-2">When you choose to use our monitoring features, we collect precise location data including GPS coordinates, speed data, and activity data through sensor and motion detectors on mobile devices. This requires background location access even when not actively using the app.</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Usage and Interaction Information</h3>
                    <p className="text-gray-700 text-sm mb-2">Such as pages viewed, time spent in app, driving behavior patterns, phone interactions during driving, and app usage statistics.</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Communications with Us</h3>
                    <p className="text-gray-700 text-sm mb-2">Such as customer service requests, chat interactions, and other information you choose to provide through the service, including any images or information submitted.</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Allowance Tracking Information</h3>
                    <p className="text-gray-700 text-sm mb-2">Such as allowance settings, penalty amounts, bonus tracking, and account activity for educational and monitoring purposes. No actual financial transactions are processed.</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Data Collection Sources</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We collect personal information from a variety of sources, including:
                </p>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">From You and Your Family</h3>
                    <p className="text-gray-700 text-sm">Including identifiers, contact details, demographic information, location information, communications with us, and preferences.</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Automatically from Devices</h3>
                    <p className="text-gray-700 text-sm">Including device and usage information, location data, and interaction patterns, some collected via cookies and similar technologies.</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Other Third Parties</h3>
                    <p className="text-gray-700 text-sm">Including mapping services (HERE Maps), email service providers, business partners, and other individuals when contact information is shared with us.</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Cookies and Similar Technologies</h2>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                  <p className="text-blue-800 font-semibold">
                    COOKIES AND TRACKING TECHNOLOGIES
                  </p>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    Like many digital platforms, DriveAllow and our service providers may collect device information and other personal information automatically using cookies and other similar technologies to help us enable functionality, analytics and service improvement.
                  </p>
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">Cookies</h3>
                      <p className="text-gray-700 text-sm">You can control cookies through your browser settings. Note that disabling cookies may affect service functionality.</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">Session Replay</h3>
                      <p className="text-gray-700 text-sm">We may use services that record user interactions with our app to help diagnose problems and identify areas for improvement. These replays include clicks, touches, scrolls, and keystrokes.</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">Analytics Tools</h3>
                      <p className="text-gray-700 text-sm">We use analytics services to understand how our service is used and to improve user experience.</p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">5. How We Use Personal Information</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">To Provide and Improve Services</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                      <li>Monitor teen driving behavior and safety in real-time</li>
                      <li>Calculate and manage allowances, penalties, and bonuses automatically</li>
                      <li>Send notifications about driving incidents and violations</li>
                      <li>Provide parental oversight dashboards and reporting</li>
                      <li>Customize and improve the service based on usage patterns</li>
                      <li>Provide customer support and respond to inquiries</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">To Maintain Security and Integrity</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                      <li>Detect, prevent, and investigate fraud or unauthorized activities</li>
                      <li>Evaluate and monitor service security</li>
                      <li>Enforce our Terms of Service and prevent violations</li>
                      <li>Protect our rights, privacy, safety, and property</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">To Comply with Laws</h3>
                    <p className="text-gray-700 text-sm">Including responding to law enforcement requests and as required by applicable law, court orders, or governmental regulations.</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Recording and Monitoring</h2>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    When you contact us for support or use our chat features, we and our third-party vendors may monitor and record conversations for quality assurance, training, and service improvement. We may also collect your internet and usage information associated with your use of chat features for the same purposes.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Important:</strong> When you use our chat features or automated support, you are not communicating with a human representative.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Teen Privacy and Parental Rights</h2>
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
                    <strong>COPPA Compliance:</strong> For users under 13, we comply with the Children's Online Privacy Protection Act (COPPA). We do not knowingly collect personal information from children under 13 without verifiable parental consent. If we discover we have collected information from a child under 13 without consent, we will delete it promptly.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>CCPA and State Privacy Laws:</strong> For residents of California and other states with privacy laws, we comply with applicable requirements regarding minors' personal information, including additional protections for users under 16.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Parental Access and Control:</strong> Parents have full access to all data collected about their minor teens and can: (1) Review all personal information we've collected, (2) Direct us to delete their teen's personal information, (3) Refuse to permit further collection or use of their teen's information, (4) Access their teen's location and driving data in real-time.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Teen Rights Upon Majority:</strong> When teens reach 18, they may: (1) Request to convert their account to an independent adult account, (2) Request deletion of their historical data, (3) Modify their privacy settings independently, (4) Opt out of further monitoring.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">8. How We Share Personal Information</h2>
                <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
                  <p className="text-green-800 font-semibold">
                    WE DO NOT SELL PERSONAL INFORMATION
                  </p>
                  <p className="text-green-700 text-sm mt-1">
                    DriveAllow does not sell, rent, or lease your personal information to third parties for marketing or commercial purposes.
                  </p>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">We may share personal information in these specific circumstances:</p>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Within Your Family</h3>
                    <p className="text-gray-700 text-sm">Information you or your family provide may be accessible to other family members through the Service. Parents can see teen account activity, and authorized users may see certain information about the primary account holder.</p>
                  </div>
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
                    <p className="text-gray-700 text-sm mb-2">
                      We may share data with trusted third-party service providers who assist with our operations, including:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                      <li>Cloud hosting and infrastructure providers for secure data storage</li>
                      <li>Mapping services (HERE Maps) for speed limit and location data</li>
                      <li>Email service providers for incident notifications</li>
                      <li>Analytics providers for service improvement</li>
                      <li>Customer support platforms</li>
                    </ul>
                    <p className="text-gray-700 text-sm mt-2">
                      These providers are contractually bound to protect your information and may only use it to provide services to DriveAllow.
                    </p>
                  </div>

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