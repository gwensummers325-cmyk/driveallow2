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
                <p className="text-gray-700 leading-relaxed mt-4">
                  <strong>IMPORTANT:</strong> These terms include a binding arbitration clause and class action waiver that affect your legal rights. Please read them carefully.
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
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                  <p className="text-red-800 font-semibold">
                    IMPORTANT SAFETY DISCLAIMER: DRIVEALLOW IS NOT A SUBSTITUTE FOR RESPONSIBLE DRIVING OR PARENTAL SUPERVISION.
                  </p>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Technology Limitations:</strong> DriveAllow relies on smartphone sensors, GPS, and third-party data which may be inaccurate, delayed, or unavailable. We do not guarantee 100% accurate detection of driving behaviors, violations, or incidents. False positives and missed violations may occur.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>No Emergency Services:</strong> DriveAllow is not an emergency service and should never be relied upon for emergency assistance. In case of accidents or emergencies, contact emergency services immediately (911 in the US). We are not responsible for delayed or failed emergency communications.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Device Dependency:</strong> Service functionality depends entirely on device capabilities, battery life, network connectivity, proper app permissions, and user compliance. Service may be unavailable without notice.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>No Accident Prevention:</strong> DriveAllow does not prevent accidents, traffic violations, or unsafe driving. The service is for monitoring and educational purposes only.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Limitation of Liability</h2>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                  <p className="text-yellow-800 font-semibold">
                    IMPORTANT LIABILITY LIMITATIONS - READ CAREFULLY
                  </p>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    <strong>NO LIABILITY FOR DRIVING INCIDENTS:</strong> DriveAllow and its operators, employees, agents, and affiliates shall have NO LIABILITY WHATSOEVER for any traffic accidents, collisions, violations, injuries, deaths, property damage, or any other incidents that occur while using or not using the service, regardless of whether such incidents were detected, reported, or prevented by our service.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Excluded Damages:</strong> We shall not be liable for any indirect, incidental, special, consequential, punitive, or exemplary damages, including without limitation: loss of profits, revenue, data, use, goodwill; business interruption; personal injury; property damage; or any other damages arising from your use of the service.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Liability Cap:</strong> Our total aggregate liability for all claims shall not exceed the lesser of (a) $100 or (b) the amount you paid for the service in the 12 months preceding the claim.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Assumption of Risk:</strong> By using DriveAllow, you acknowledge and assume all risks associated with teen driving and monitoring technology limitations.
                  </p>
                </div>
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
                  You agree to defend, indemnify, and hold harmless DriveAllow, its officers, directors, employees, agents, licensors, and suppliers from and against all claims, damages, losses, costs, and expenses (including reasonable attorneys' fees) arising from or relating to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mt-4">
                  <li>Your use or misuse of the service</li>
                  <li>Any driving incidents, accidents, or violations by monitored teens</li>
                  <li>Your violation of these Terms of Service</li>
                  <li>Your violation of any rights of another party</li>
                  <li>Any false or misleading information you provide</li>
                  <li>Any failure to supervise or properly instruct teen drivers</li>
                  <li>Any reliance on or use of data provided by the service</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Dispute Resolution and Arbitration</h2>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                  <p className="text-blue-800 font-semibold">
                    BINDING ARBITRATION AND CLASS ACTION WAIVER
                  </p>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Governing Law:</strong> These Terms shall be governed by and construed in accordance with the laws of Delaware, United States, without regard to conflict of law provisions.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Mandatory Arbitration:</strong> Any dispute arising from these Terms or your use of DriveAllow must be resolved through binding individual arbitration under the American Arbitration Association Commercial Arbitration Rules. The arbitration will be conducted in Delaware or via videoconference.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Class Action Waiver:</strong> You agree to waive your right to participate in class actions, class arbitrations, or representative actions against DriveAllow.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Exception:</strong> Either party may seek injunctive relief in court for intellectual property violations or breaches of confidentiality.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">12. Changes to Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right to modify these terms at any time. We will notify users of significant changes via email or app notification. Continued use of DriveAllow constitutes acceptance of the modified terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">12. Force Majeure</h2>
                <p className="text-gray-700 leading-relaxed">
                  DriveAllow shall not be liable for any delays or failures in performance due to circumstances beyond our reasonable control, including but not limited to: acts of God, natural disasters, war, terrorism, government actions, network outages, or third-party service failures.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">13. Intellectual Property</h2>
                <p className="text-gray-700 leading-relaxed">
                  DriveAllow and its content, features, and functionality are owned by us and protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, sell, or lease any part of our service without written permission.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">14. Severability</h2>
                <p className="text-gray-700 leading-relaxed">
                  If any provision of these Terms is found to be unenforceable, that provision shall be enforced to the maximum extent possible, and the remaining provisions shall remain in full force and effect.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">15. Contact Information</h2>
                <p className="text-gray-700 leading-relaxed">
                  For questions about these Terms of Service, contact us at:<br />
                  Email: legal@driveallow.com<br />
                  Address: 1234 Business Lane, Suite 100, Dover, DE 19901<br />
                  Phone: 1-800-DRIVEALLOW
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}