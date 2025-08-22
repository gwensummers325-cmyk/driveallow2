import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, DollarSign, Bell, Users, Car, Heart, Eye, CheckCircle, ArrowRight, Star } from "lucide-react";
import { useLocation } from "wouter";
import { Layout } from "@/components/layout";

export default function Landing() {
  const [, setLocation] = useLocation();
  
  return (
    <Layout showBackButton={false}>
      <div className="min-h-screen">

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 text-primary">
            <Car className="h-24 w-24 rotate-45" />
          </div>
          <div className="absolute top-40 right-20 text-green-500">
            <Shield className="h-16 w-16" />
          </div>
          <div className="absolute bottom-20 left-1/4 text-blue-500">
            <Heart className="h-20 w-20" />
          </div>
        </div>

        <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Hero Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            {/* Left side - Text Content */}
            <div className="text-center lg:text-left">
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Drive. Safe. Earn.
              </h2>
              
              <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed">
                DriveAllow incentivizes safe teen driving using smart allowance management that rewards good driving habits.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center lg:items-start lg:justify-start justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <Button 
                    size="lg" 
                    onClick={() => setLocation('/auth/parent')}
                    className="text-lg px-8 py-4 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary shadow-lg"
                  >
                    Parent Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={() => setLocation('/auth/teen')}
                    className="text-lg px-8 py-4 border-2 hover:bg-green-50"
                  >
                    Teen Dashboard
                    <Car className="ml-2 h-5 w-5" />
                  </Button>
                </div>
                
                <div className="flex items-center space-x-2 text-gray-600">
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm">Trusted by thousands of families</span>
                </div>
              </div>
            </div>

            {/* Right side - Story Animation */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-lg">
                {/* Main Story Scene */}
                <div className="story-scene relative h-80 bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl p-8 shadow-2xl border border-white/50">
                  
                  {/* Home Icon */}
                  <div className="absolute top-6 left-6">
                    <div className="home-base bg-blue-600 w-8 h-6 relative">
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-5 border-r-5 border-b-4 border-l-transparent border-r-transparent border-b-blue-600"></div>
                      <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-2 h-3 bg-yellow-300 rounded-sm"></div>
                    </div>
                  </div>

                  {/* Parents watching from home */}
                  <div className="absolute top-8 left-12">
                    <div className="parents-watching bg-white rounded-2xl p-3 shadow-lg border border-gray-100 parent-gentle-wave">
                      <div className="flex items-center space-x-2">
                        {/* Mom silhouette */}
                        <div className="relative">
                          <div className="w-6 h-6 bg-gradient-to-br from-purple-300 to-purple-400 rounded-full relative overflow-hidden">
                            <div className="absolute top-1 left-1 right-1 h-2 bg-purple-500 rounded-t-full opacity-60"></div>
                            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-1 border-b border-purple-600 rounded-b"></div>
                          </div>
                          <div className="absolute -top-1 -right-1 w-2 h-2 text-yellow-400 animate-pulse">👋</div>
                        </div>
                        
                        {/* Dad silhouette */}
                        <div className="relative">
                          <div className="w-6 h-6 bg-gradient-to-br from-blue-300 to-blue-400 rounded-full relative overflow-hidden">
                            <div className="absolute top-0.5 left-1 right-1 h-1.5 bg-blue-500 rounded-t opacity-60"></div>
                            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-1 border-b border-blue-600 rounded-b"></div>
                          </div>
                        </div>
                        
                        <Heart className="h-4 w-4 text-pink-400 fill-pink-200 animate-pulse" />
                      </div>
                      <div className="text-xs text-gray-500 text-center mt-1 font-medium">Peace of Mind</div>
                    </div>
                  </div>

                  {/* Curved road path */}
                  <div className="absolute bottom-20 left-8 right-8">
                    <svg className="w-full h-24" viewBox="0 0 300 100" preserveAspectRatio="none">
                      <path 
                        d="M0,80 Q150,20 300,60" 
                        stroke="#e5e7eb" 
                        strokeWidth="12" 
                        fill="none"
                        className="road-path"
                      />
                      <path 
                        d="M0,80 Q150,20 300,60" 
                        stroke="#fbbf24" 
                        strokeWidth="2" 
                        fill="none" 
                        strokeDasharray="8,6"
                        className="road-dashes"
                      />
                    </svg>
                  </div>

                  {/* Modern car driving along path */}
                  <div className="car-journey absolute bottom-16">
                    <div className="car-modern relative transform-gpu car-smooth-drive">
                      {/* Car body - modern design */}
                      <div className="relative">
                        <div className="car-main bg-gradient-to-r from-emerald-400 to-emerald-500 w-16 h-8 rounded-lg shadow-lg relative">
                          {/* Windshield */}
                          <div className="absolute top-1 left-2 right-1 h-3 bg-gradient-to-b from-sky-100 to-sky-200 rounded-t-lg border border-sky-200"></div>
                          {/* Side windows */}
                          <div className="absolute top-1.5 right-0.5 w-2 h-2 bg-sky-100 rounded-sm"></div>
                          {/* Headlight */}
                          <div className="absolute top-2 -left-0.5 w-1.5 h-1.5 bg-yellow-200 rounded-full car-headlight"></div>
                          {/* Wheels */}
                          <div className="absolute -bottom-1 left-1 w-2.5 h-2.5 bg-gray-700 rounded-full car-wheel"></div>
                          <div className="absolute -bottom-1 right-2 w-2.5 h-2.5 bg-gray-700 rounded-full car-wheel"></div>
                          {/* Wheel rims */}
                          <div className="absolute -bottom-0.5 left-1.5 w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                          <div className="absolute -bottom-0.5 right-2.5 w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                        </div>
                        
                        {/* Safety badge */}
                        <div className="absolute -top-3 -right-2 safety-badge">
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                            <span className="text-white text-xs font-bold">✓</span>
                          </div>
                        </div>
                        
                        {/* Motion lines */}
                        <div className="motion-lines absolute top-1/2 -left-6 transform -translate-y-1/2">
                          <div className="motion-line w-3 h-0.5 bg-emerald-300 rounded motion-trail" style={{animationDelay: '0s'}}></div>
                          <div className="motion-line w-2 h-0.5 bg-emerald-300 rounded mt-1 motion-trail" style={{animationDelay: '0.1s'}}></div>
                          <div className="motion-line w-1 h-0.5 bg-emerald-300 rounded mt-1 motion-trail" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Smart features floating around */}
                  <div className="smart-feature absolute top-16 right-6 feature-float">
                    <div className="bg-white rounded-xl p-2 shadow-lg border border-gray-100">
                      <DollarSign className="h-5 w-5 text-green-500" />
                      <div className="text-xs text-gray-600 font-medium mt-1">+$5</div>
                    </div>
                  </div>

                  <div className="smart-feature absolute bottom-8 right-12 feature-float" style={{animationDelay: '1s'}}>
                    <div className="bg-white rounded-xl p-2 shadow-lg border border-gray-100">
                      <Shield className="h-5 w-5 text-blue-500" />
                      <div className="text-xs text-gray-600 font-medium mt-1">Safe</div>
                    </div>
                  </div>

                  {/* Progress indicator */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-white rounded-full px-4 py-2 shadow-lg border border-gray-100">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-xs text-gray-600 font-medium">Driving Safely</span>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                      </div>
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
          
          {/* Peace of Mind Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">92%</h3>
              <p className="text-gray-600">Improvement in safe driving habits</p>
            </div>
            
            <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">100%</h3>
              <p className="text-gray-600">Parents report peace of mind</p>
            </div>
            
            <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">4.9/5</h3>
              <p className="text-gray-600">Family satisfaction rating</p>
            </div>
          </div>
        </main>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gray-50">

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Smart Allowances</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Automatically manage allowances with configurable penalties and bonuses based on driving behavior.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-success" />
              </div>
              <CardTitle className="text-lg">Safety Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Monitor driving incidents including speeding, harsh braking, and aggressive acceleration.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Bell className="h-6 w-6 text-warning" />
              </div>
              <CardTitle className="text-lg">Email Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Instant email notifications for both parents and teens when incidents occur or bonuses are earned.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-error/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-error" />
              </div>
              <CardTitle className="text-lg">Family Control</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Separate dashboards for parents and teens with role-based access and controls.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                1
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Set Up Allowances</h4>
              <p className="text-gray-600">Configure weekly allowances, penalty amounts, and incentive bonuses for your teen driver.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                2
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Track Driving</h4>
              <p className="text-gray-600">Report driving incidents manually or track violations like speeding and harsh braking.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                3
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Earn & Learn</h4>
              <p className="text-gray-600">Automatic deductions for violations and bonuses for safe driving help teens learn responsible habits.</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </Layout>
  );
}
