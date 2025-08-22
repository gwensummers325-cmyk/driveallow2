import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsOfService() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">Terms of Service</CardTitle>
              <p className="text-center text-gray-600">Last updated: December 2024</p>
            </CardHeader>
            <CardContent className="prose max-w-none space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  By accessing or using DriveAllow, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Service Description</h2>
                <p className="text-gray-700 leading-relaxed">
                  DriveAllow is a teen driver monitoring and allowance management platform that helps families promote safe driving through financial incentives and real-time behavior tracking using smartphone sensors and GPS data.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Parental Consent and Authorization</h2>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    <strong>For Parents:</strong> By registering as a parent user, you represent that you have legal authority over the minor teen(s) you are monitoring and consent to the collection and use of their location and driving data.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>For Teens:</strong> Teen users under 18 must have explicit parental consent to use DriveAllow. By using this service, you acknowledge that your parents have authorized monitoring of your driving behavior.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">4. User Responsibilities</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">All Users</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>Provide accurate and truthful information</li>
                      <li>Keep login credentials secure</li>
                      <li>Use the service in compliance with all applicable laws</li>
                      <li>Respect the privacy and safety of others</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Teen Users</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>Allow continuous monitoring during driving</li>
                      <li>Keep the mobile device active during trips</li>
                      <li>Drive safely and follow all traffic laws</li>
                      <li>Report any app malfunctions to parents</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Parent Users</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>Use monitoring data responsibly and for safety purposes</li>
                      <li>Set reasonable allowance and penalty amounts</li>
                      <li>Review and discuss driving incidents with teens</li>
                      <li>Respect teen's privacy within the scope of safety monitoring</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Prohibited Uses</h2>
                <p className="text-gray-700 leading-relaxed mb-4">You may not use DriveAllow to:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Violate any laws or regulations</li>
                  <li>Harass, abuse, or harm another person</li>
                  <li>Impersonate another person or entity</li>
                  <li>Interfere with or disrupt the service</li>
                  <li>Access or attempt to access accounts you do not own</li>
                  <li>Use the service for commercial purposes without authorization</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Service Limitations and Disclaimers</h2>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Accuracy:</strong> While we strive for accuracy, DriveAllow relies on smartphone sensors and GPS which may have limitations. We do not guarantee 100% accurate detection of all driving behaviors.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Emergency Services:</strong> DriveAllow is not an emergency service. In case of accidents or emergencies, contact emergency services immediately (911 in the US).
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Device Compatibility:</strong> Service quality depends on device capabilities, network connectivity, and proper app permissions.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Limitation of Liability</h2>
                <p className="text-gray-700 leading-relaxed">
                  DriveAllow and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, or goodwill, arising from your use of the service. Our total liability is limited to the amount you paid for the service in the past 12 months.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Privacy and Data</h2>
                <p className="text-gray-700 leading-relaxed">
                  Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, to understand our practices regarding the collection and use of your information.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Account Termination</h2>
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right to terminate or suspend accounts for violation of these terms. You may terminate your account at any time. Upon termination, your access to the service will cease, though some data may be retained as described in our Privacy Policy.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Indemnification</h2>
                <p className="text-gray-700 leading-relaxed">
                  You agree to indemnify and hold harmless DriveAllow from any claims, damages, losses, costs, or expenses arising from your use of the service, violation of these terms, or infringement of any rights of another.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Governing Law</h2>
                <p className="text-gray-700 leading-relaxed">
                  These Terms shall be governed by and construed in accordance with the laws of [Your State/Country], without regard to its conflict of law provisions. Any disputes shall be resolved in the courts of [Your Jurisdiction].
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">12. Changes to Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right to modify these terms at any time. We will notify users of significant changes via email or app notification. Continued use of DriveAllow constitutes acceptance of the modified terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">13. Contact Information</h2>
                <p className="text-gray-700 leading-relaxed">
                  For questions about these Terms of Service, contact us at:<br />
                  Email: legal@driveallow.com<br />
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