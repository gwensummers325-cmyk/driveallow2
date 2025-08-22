import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">DriveAllow</h3>
            <p className="text-gray-300 text-sm">
              Incentivizing safe teen driving through smart allowance management that rewards good driving habits.
            </p>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h4 className="text-md font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy-policy" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-gray-300 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="text-gray-300 hover:text-white transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/accessibility" className="text-gray-300 hover:text-white transition-colors">
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-md font-semibold">Support</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>support@driveallow.com</li>
              <li>1-800-DRIVE-SAFE</li>
              <li>Mon-Fri 9AM-6PM EST</li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-md font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/auth/parent" className="text-gray-300 hover:text-white transition-colors">
                  Parent Dashboard
                </Link>
              </li>
              <li>
                <Link href="/auth/teen" className="text-gray-300 hover:text-white transition-colors">
                  Teen Dashboard
                </Link>
              </li>
              <li>
                <Link href="/mobile-data" className="text-gray-300 hover:text-white transition-colors">
                  Mobile Tracking
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} DriveAllow. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="text-gray-400 text-sm">Made with safety in mind</span>
          </div>
        </div>
      </div>
    </footer>
  );
}