import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Accessibility() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">Accessibility Statement</CardTitle>
              <p className="text-center text-gray-600">Last updated: December 2024</p>
            </CardHeader>
            <CardContent className="prose max-w-none space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Our Commitment</h2>
                <p className="text-gray-700 leading-relaxed">
                  DriveAllow is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone, and apply the relevant accessibility standards to ensure we provide equal access to all users.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Accessibility Standards</h2>
                <p className="text-gray-700 leading-relaxed">
                  DriveAllow aims to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards. These guidelines explain how to make web content accessible to people with a wide array of disabilities, including visual, auditory, physical, speech, cognitive, language, learning, and neurological disabilities.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Accessibility Features</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Visual Accessibility</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>High contrast color schemes for better readability</li>
                      <li>Scalable fonts that work with browser zoom up to 200%</li>
                      <li>Alternative text for all informational images</li>
                      <li>Clear visual focus indicators for keyboard navigation</li>
                      <li>Color is not used as the sole method of conveying information</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Keyboard Navigation</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>All interactive elements are keyboard accessible</li>
                      <li>Logical tab order throughout the interface</li>
                      <li>Skip navigation links to main content areas</li>
                      <li>Keyboard shortcuts documented where available</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Screen Reader Support</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>Semantic HTML structure for proper navigation</li>
                      <li>ARIA labels and descriptions where needed</li>
                      <li>Descriptive link text and button labels</li>
                      <li>Proper heading hierarchy for content organization</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Content and Language</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>Clear and simple language throughout the interface</li>
                      <li>Consistent navigation and layout patterns</li>
                      <li>Error messages that are clear and actionable</li>
                      <li>Important information is presented in multiple ways</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Mobile Accessibility</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Since DriveAllow includes mobile functionality for teen drivers, we ensure our mobile interface is accessible:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Touch targets are at least 44x44 pixels for easy interaction</li>
                  <li>Support for mobile screen readers (VoiceOver on iOS, TalkBack on Android)</li>
                  <li>Responsive design that works across different screen sizes</li>
                  <li>Voice control compatibility where supported by the device</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Known Limitations</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  While we strive for full accessibility, some areas may have limitations:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Real-time driving data visualization may have limited screen reader descriptions</li>
                  <li>Some third-party mapping features may not be fully accessible</li>
                  <li>Complex data tables may require additional navigation techniques</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  We are actively working to address these limitations in future updates.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Assistive Technologies</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  DriveAllow is designed to be compatible with the following assistive technologies:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Screen readers (JAWS, NVDA, VoiceOver, TalkBack)</li>
                  <li>Speech recognition software</li>
                  <li>Keyboard-only navigation</li>
                  <li>Switch navigation devices</li>
                  <li>Browser zoom functionality</li>
                  <li>High contrast and magnification tools</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Testing and Evaluation</h2>
                <p className="text-gray-700 leading-relaxed">
                  We regularly test our website and mobile application using automated accessibility testing tools, manual testing with assistive technologies, and feedback from users with disabilities. Our development team includes accessibility reviews as part of our standard development process.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Feedback and Support</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We welcome your feedback on the accessibility of DriveAllow. If you encounter any accessibility barriers or have suggestions for improvement, please let us know:
                </p>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                  <p className="text-gray-700">
                    <strong>Email:</strong> accessibility@driveallow.com<br />
                    <strong>Phone:</strong> [Your Phone Number]<br />
                    <strong>Mail:</strong> [Your Business Address]
                  </p>
                </div>
                <p className="text-gray-700 leading-relaxed mt-4">
                  We aim to respond to accessibility feedback within 5 business days and will work with you to find a suitable solution.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Alternative Access</h2>
                <p className="text-gray-700 leading-relaxed">
                  If you are unable to access any content or functionality on DriveAllow due to a disability, we can provide alternative formats or methods to access the information. Please contact our support team, and we will work to accommodate your needs.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Ongoing Efforts</h2>
                <p className="text-gray-700 leading-relaxed">
                  Accessibility is an ongoing effort. We are continuously working to improve the accessibility of DriveAllow through regular audits, user feedback, and updates based on evolving accessibility standards and best practices.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Third-Party Content</h2>
                <p className="text-gray-700 leading-relaxed">
                  Some content on DriveAllow may be provided by third parties (such as mapping services). While we strive to ensure all content meets our accessibility standards, we may have limited control over third-party accessibility features. We encourage third-party providers to maintain accessible content and will work with them to address any issues.
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}