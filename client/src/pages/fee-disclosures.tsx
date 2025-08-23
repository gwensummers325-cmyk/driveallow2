import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FeeDisclosures() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">Fee Disclosures</CardTitle>
              <p className="text-center text-gray-600">Last updated: August 23, 2025</p>
            </CardHeader>
            <CardContent className="prose max-w-none space-y-6">
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                <p className="text-blue-800 font-semibold text-lg">
                  DriveAllow Fee Structure
                </p>
                <p className="text-blue-700 text-sm mt-1">
                  Transparent pricing for teen driver monitoring and allowance management services.
                </p>
              </div>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Monthly Subscription Plans</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2 text-left">Plan Type</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Monthly Fee</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Features Included</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2 font-medium">DriveAllow Basic</td>
                        <td className="border border-gray-300 px-4 py-2">$9.99</td>
                        <td className="border border-gray-300 px-4 py-2">
                          <ul className="text-sm space-y-1">
                            <li>• GPS driving monitoring</li>
                            <li>• Basic allowance management</li>
                            <li>• Email notifications</li>
                            <li>• Up to 2 teen drivers</li>
                          </ul>
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2 font-medium">DriveAllow Plus</td>
                        <td className="border border-gray-300 px-4 py-2">$19.99</td>
                        <td className="border border-gray-300 px-4 py-2">
                          <ul className="text-sm space-y-1">
                            <li>• All Basic features</li>
                            <li>• Advanced phone usage monitoring</li>
                            <li>• Real-time violation detection</li>
                            <li>• Comprehensive reporting</li>
                            <li>• Up to 5 teen drivers</li>
                          </ul>
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2 font-medium">DriveAllow Family</td>
                        <td className="border border-gray-300 px-4 py-2">$29.99</td>
                        <td className="border border-gray-300 px-4 py-2">
                          <ul className="text-sm space-y-1">
                            <li>• All Plus features</li>
                            <li>• Family location sharing</li>
                            <li>• Emergency notifications</li>
                            <li>• Unlimited teen drivers</li>
                            <li>• Priority customer support</li>
                          </ul>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-gray-600 text-sm mt-4">
                  * Monthly fees are billed 7 days after registration, then recurring monthly on the same day. A refund of the initial monthly fee is available if cancelled within the first 7 days.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Additional Service Fees</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2 text-left">Service</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Fee</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">Account Setup</td>
                        <td className="border border-gray-300 px-4 py-2">$0.00</td>
                        <td className="border border-gray-300 px-4 py-2">Free account creation and setup</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">Data Export</td>
                        <td className="border border-gray-300 px-4 py-2">$0.00</td>
                        <td className="border border-gray-300 px-4 py-2">Free data export in standard formats</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">Premium Support</td>
                        <td className="border border-gray-300 px-4 py-2">$4.99/month</td>
                        <td className="border border-gray-300 px-4 py-2">Optional phone support and priority assistance</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">Historical Data Retention (&gt;2 years)</td>
                        <td className="border border-gray-300 px-4 py-2">$2.99/month</td>
                        <td className="border border-gray-300 px-4 py-2">Optional extended data storage beyond standard 2-year retention</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Free Services</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Account registration and basic setup</li>
                  <li>Standard customer support via email and chat</li>
                  <li>Data export and account closure</li>
                  <li>Security monitoring and fraud protection</li>
                  <li>Standard data retention for 2 years</li>
                  <li>Basic reporting and analytics</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Billing and Payment Terms</h2>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Billing Cycle:</strong> Monthly fees are charged on the same day each month. Your billing date is established when you first subscribe and can be viewed in your account settings.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Payment Methods:</strong> Subscription fees would be processed through secure third-party payment processors. DriveAllow does not handle payment processing directly.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Failed Payments:</strong> If a payment fails, we will attempt to charge your payment method up to 3 times over 7 days. Services may be suspended if payment cannot be processed.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Refund Policy:</strong> Monthly fees are refundable if cancelled within 7 days of the initial charge. Subsequent monthly charges are non-refundable, but you can cancel anytime to prevent future charges.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Cancellation:</strong> You can cancel your subscription anytime through account settings. Your service will continue until the end of your current billing period.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Price Changes</h2>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <p className="text-yellow-800">
                    <strong>Advance Notice:</strong> We will provide at least 30 days advance notice of any price increases. You may cancel your subscription before the increase takes effect to avoid the new pricing.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Important Disclosures</h2>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Not a Financial Institution:</strong> DriveAllow is not a bank, credit union, or financial institution. We provide teen driving monitoring and allowance tracking services only. We do not handle, store, or process any actual money. All allowance amounts displayed are for tracking and educational purposes only.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Data Usage:</strong> Our services require data connections. Standard mobile data charges from your carrier may apply when using location services and real-time monitoring features.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Third-Party Services:</strong> Our monitoring features use third-party services (mapping data, notifications) but do not involve financial transactions. Standard mobile data charges from your carrier may apply when using location services.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Contact Information</h2>
                <div className="space-y-2">
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Billing Questions:</strong> billing@driveallow.com
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Customer Support:</strong> support@driveallow.com
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Business Address:</strong> DriveAllow, Inc., 123 Technology Way, Suite 100, Austin, TX 78701
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Phone:</strong> 1-800-DRIVEALLOW (1-800-374-8325)
                  </p>
                </div>
              </section>

              <div className="bg-gray-100 border border-gray-300 p-4 mt-8">
                <p className="text-gray-700 text-sm">
                  <strong>Legal Notice:</strong> These fee disclosures are part of your service agreement with DriveAllow. For complete terms and conditions, please review our Terms of Service and Privacy Policy. All fees are subject to applicable taxes where required by law.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}