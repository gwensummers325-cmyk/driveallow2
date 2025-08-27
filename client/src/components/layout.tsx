import { Button } from "@/components/ui/button";
import { Car, ArrowLeft, Mail, Phone, Shield, Heart } from "lucide-react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import logoImage from "@assets/DriveAllow_1756305424410.png";

interface LayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  backPath?: string;
}

export function Layout({ children, showBackButton = true, backPath }: LayoutProps) {
  const [location, setLocation] = useLocation();
  const { user, logoutMutation } = useAuth();

  const handleBack = () => {
    if (backPath) {
      setLocation(backPath);
    } else if (user) {
      setLocation("/");
    } else {
      setLocation("/");
    }
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              {showBackButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </Button>
              )}
              
              <div className="flex items-center cursor-pointer" onClick={() => setLocation("/")}>
                <img 
                  src={logoImage} 
                  alt="DriveAllow" 
                  className="h-10 w-auto"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2 md:space-x-4">
              {user ? (
                <div className="flex items-center space-x-2 md:space-x-4">
                  <span className="text-xs md:text-sm text-gray-600 hidden sm:block">
                    Welcome, {user.firstName}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                    className="text-xs md:text-sm px-2 md:px-3"
                  >
                    {logoutMutation.isPending ? "Signing Out..." : "Sign Out"}
                  </Button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {location !== '/auth/parent' && (
                    <Button 
                      size="sm"
                      onClick={() => setLocation('/auth/parent')}
                      className="text-xs px-2 py-1.5 sm:px-3 sm:py-2 md:text-sm whitespace-nowrap bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary text-white font-semibold shadow-md"
                    >
                      Parent or Guardian
                    </Button>
                  )}
                  {location !== '/auth/teen' && (
                    <Button 
                      size="sm"
                      onClick={() => setLocation('/auth/teen')}
                      className="text-xs px-2 py-1.5 sm:px-3 sm:py-2 md:text-sm whitespace-nowrap"
                    >
                      Teen
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center">
                <Car className="h-6 w-6 text-primary mr-2" />
                <h3 className="text-xl font-bold">DriveAllow</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Smart allowance management for teen drivers. Teaching safe driving habits through financial incentives.
              </p>
              <div className="flex space-x-4">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-sm text-gray-400">Trusted by thousands of families</span>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Features</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Smart allowance management</li>
                <li>• Email notifications</li>
                <li>• Parent & teen dashboards</li>
                <li>• Bonus & penalty system</li>
                <li>• Safe driving rewards</li>
              </ul>
            </div>

            {/* Safety & Support */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Safety & Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• 24/7 family support</li>
                <li>• Secure data protection</li>
                <li>• Privacy guaranteed</li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Contact Us</h4>
              <div className="space-y-3 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>safe@driveallow.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4 text-red-400" />
                  <span>Family safety first</span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-700">
                <p className="text-xs text-gray-500">
                  Questions about teen driving safety?<br/>
                  Our family support team is here to help.
                </p>
              </div>
            </div>
          </div>
          
          {/* Important Disclaimers */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <div className="space-y-4 text-xs text-gray-500">
              <p>
                <strong className="text-gray-400">Important:</strong> Secret or nonconsensual use of DriveAllow to collect or track information of others is strictly prohibited.
              </p>
              <p>
                Impact Detection and Notification may be unavailable in certain instances, such as when the cellular or other signals are unavailable or intermittent. If the cellphone experiences a loss of wireless service, then no data will be transmitted.
              </p>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="mt-8 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © 2025 DriveAllow. All rights reserved. Building safer roads, one teen at a time.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0 text-sm text-gray-400">
              <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/cookie-policy" className="hover:text-white transition-colors">Cookie Policy</Link>
              <Link href="/accessibility" className="hover:text-white transition-colors">Accessibility</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}