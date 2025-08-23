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
              <p className="text-center text-gray-600">Last updated: August 23, 2025</p>
            </CardHeader>
            <CardContent className="prose max-w-none space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
                <div className="bg-red-50 border-2 border-red-200 p-4 rounded-lg mb-4">
                  <p className="text-red-800 font-bold text-lg mb-2">
                    IMPORTANT NOTICE:
                  </p>
                  <p className="text-red-800 text-sm leading-relaxed mb-2">
                    PLEASE READ THESE DRIVEALLOW TERMS OF SERVICE (THE "TERMS OF SERVICE") CAREFULLY BEFORE USING THE DRIVEALLOW SERVICES (DEFINED BELOW). THESE TERMS OF SERVICE CONTAIN A BINDING INDIVIDUAL ARBITRATION AGREEMENT AND CLASS ACTION WAIVER IN THE SECTION TITLED "DISPUTE RESOLUTION; CLASS ACTION WAIVER." THIS AFFECTS YOUR RIGHTS WITH RESPECT TO ANY "DISPUTE" BETWEEN YOU AND DRIVEALLOW, INC. ("DRIVEALLOW," "WE," OR "US") AND MAY REQUIRE YOU TO RESOLVE DISPUTES IN BINDING, INDIVIDUAL ARBITRATION, AND NOT IN COURT.
                  </p>
                  <p className="text-red-800 text-sm font-semibold">
                    IF YOU DO NOT AGREE WITH ALL OF THE TERMS AND CONDITIONS OF THESE TERMS OF SERVICE, YOU SHOULD NOT USE THE DRIVEALLOW SERVICES.
                  </p>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Your use of the DriveAllow website, mobile application, and related services are subject to your compliance with these Terms of Service. These Terms constitute a legally binding agreement between DriveAllow, Inc. and you.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">2. DriveAllow Services Overview</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  DriveAllow Services include paid subscription services and features provided through our website, mobile application, and platform, including but not limited to:
                </p>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">A) Teen Driver Monitoring Services</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Real-time GPS tracking, driving behavior analysis, speed monitoring, phone usage detection during driving, and incident reporting using smartphone sensor data and location services.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">B) Allowance Management System</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Automated allowance calculation, penalty application, bonus rewards, transaction tracking, and financial behavior incentives based on driving performance.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">C) Family Communication and Notifications</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Email notifications for driving incidents, automated violation reporting, allowance payment notifications, and family safety communications.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Account Types and Authority</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Primary Accountholder (Parent/Guardian)</h3>
                    <p className="text-gray-700 leading-relaxed">
                      The "Primary Accountholder" is the individual who opens and is responsible for the DriveAllow account, including all teen accounts, allowance settings, penalty configurations, and financial management. Must be at least 18 years old and have legal authority over the minor teens being monitored.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Teen Account</h3>
                    <p className="text-gray-700 leading-relaxed">
                      A "Teen Account" is a sub-account established by the Primary Accountholder for monitoring and managing a minor's driving behavior. Teen users under 18 must have explicit parental consent and cannot modify monitoring settings, allowance parameters, or account configurations.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Authorized Approver</h3>
                    <p className="text-gray-700 leading-relaxed">
                      The Primary Accountholder may designate an "Authorized Approver" (typically a spouse or family member) to share certain account management responsibilities. The Authorized Approver cannot close accounts, remove the Primary Accountholder's access, or fundamentally alter account structure.
                    </p>
                  </div>
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
                <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Electronic Communications and Consent</h2>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                  <p className="text-blue-800 font-semibold">
                    ELECTRONIC COMMUNICATIONS AGREEMENT
                  </p>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    By opening a DriveAllow account, you consent to receiving electronic communications including disclosures, notices, agreements, fee schedules, violation reports, allowance notifications, and other important information from DriveAllow via email, text message, push notifications, and in-app messages.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Communication Methods:</strong> We may communicate with you via: (1) Email to your registered email address, (2) Text messages to your mobile phone number, (3) Push notifications through the mobile application, (4) In-app messages and alerts, (5) Postal mail to your registered address when required by law.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Your Responsibilities:</strong> You must keep your contact information current and check your email regularly. You are responsible for ensuring your device can receive our communications and that your spam filters allow our messages.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Service Limitations and Disclaimers</h2>
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
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Recording and Monitoring:</strong> When you contact DriveAllow customer support by phone, email, or chat, we may monitor and record conversations for quality assurance, training, and service improvement purposes. Chat features use automated systems, not human representatives.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Account Closure and Data Retention</h2>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Account Closure:</strong> Primary Accountholders can close accounts through app settings or by contacting customer support. Teen accounts can only be closed by the Primary Accountholder, not by the teen user.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Data Retention After Closure:</strong> After account closure, DriveAllow may retain data as needed to: (1) Resolve disputes and provide customer support, (2) Comply with legal obligations and law enforcement requests, (3) Prevent fraud and abuse, (4) Enforce these Terms of Service, (5) Maintain business records as required by law.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Data Deletion Requests:</strong> Users may request data deletion by contacting customer support. We will comply with applicable data protection laws while preserving data required for legal or business purposes.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Third-Party Service Providers</h2>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    DriveAllow works with trusted third-party service providers to deliver our services, including but not limited to:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li><strong>Mapping and Location Services:</strong> HERE Maps API for speed limit data and location verification</li>
                    <li><strong>Email Services:</strong> SMTP providers for incident notifications and system communications</li>
                    <li><strong>Database and Hosting:</strong> Cloud infrastructure providers for secure data storage and app hosting</li>
                    <li><strong>Payment Processing:</strong> If payment features are added, we will partner with regulated financial institutions</li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed">
                    These service providers are contractually bound to protect your information and use it only for providing services to DriveAllow. We regularly review our partners' security practices and data handling procedures.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Customer Service and Contact Information</h2>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Support Options:</strong> Contact DriveAllow customer support through:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Email: support@driveallow.com</li>
                    <li>In-app chat and support features</li>
                    <li>Online help center and documentation</li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Business Address:</strong> DriveAllow, Inc., 123 Technology Way, Suite 100, Austin, TX 78701
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Response Times:</strong> We strive to respond to support requests within 24 hours during business days. Emergency safety issues receive priority handling.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Limitation of Liability</h2>
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