import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, DollarSign, Bell, Users, Car, Heart, Eye, CheckCircle, ArrowRight, Star } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Car className="h-6 w-6 text-primary mr-2" />
              <h1 className="text-2xl font-bold text-primary">DriveWise</h1>
            </div>
            <Button onClick={() => window.location.href = '/api/login'}>
              Sign In
            </Button>
          </div>
        </div>
      </header>

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
                DriveWise gives parents the confidence that their teen will drive safely, 
                using smart allowance management that rewards good driving habits and 
                provides instant feedback when it matters most.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center lg:items-start lg:justify-start justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Button 
                  size="lg" 
                  onClick={() => window.location.href = '/api/login'}
                  className="text-lg px-10 py-4 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary shadow-lg"
                >
                  Start Protecting Your Teen
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                
                <div className="flex items-center space-x-2 text-gray-600">
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm">Trusted by thousands of families</span>
                </div>
              </div>
            </div>

            {/* Right side - 3D Animated Scene */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-lg perspective-1000">
                {/* 3D Scene Container */}
                <div className="scene-3d relative h-80 bg-gradient-to-b from-sky-200 via-sky-100 to-green-100 rounded-2xl overflow-hidden shadow-2xl">
                  
                  {/* Background Hills */}
                  <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-green-200 to-green-100 rounded-b-2xl transform-gpu" style={{clipPath: 'polygon(0% 100%, 100% 100%, 100% 60%, 80% 50%, 60% 40%, 40% 50%, 20% 45%, 0% 55%)'}}>
                  </div>
                  
                  {/* 3D Road */}
                  <div className="road-3d absolute bottom-0 left-1/2 transform -translate-x-1/2 w-64 h-32">
                    <div className="road-surface bg-gradient-to-t from-gray-400 to-gray-300 h-full transform-gpu road-perspective shadow-lg">
                      {/* Road lines */}
                      <div className="absolute inset-0 flex justify-center items-center">
                        <div className="road-lines flex flex-col space-y-3 h-full justify-evenly">
                          <div className="w-1 h-4 bg-yellow-200 road-line-animation" style={{animationDelay: '0s'}}></div>
                          <div className="w-1 h-4 bg-yellow-200 road-line-animation" style={{animationDelay: '0.3s'}}></div>
                          <div className="w-1 h-4 bg-yellow-200 road-line-animation" style={{animationDelay: '0.6s'}}></div>
                          <div className="w-1 h-4 bg-yellow-200 road-line-animation" style={{animationDelay: '0.9s'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3D Animated Car */}
                  <div className="car-3d-animation absolute bottom-16 left-1/2 transform -translate-x-1/2">
                    <div className="car-container transform-gpu">
                      <div className="relative">
                        {/* Car body with 3D effect */}
                        <div className="car-body w-20 h-12 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-lg relative shadow-xl transform-gpu car-tilt">
                          {/* Car windows */}
                          <div className="absolute top-1 left-2 right-2 h-4 bg-gradient-to-b from-sky-200 to-sky-300 rounded-t-md"></div>
                          {/* Car wheels */}
                          <div className="absolute -bottom-1 left-1 w-3 h-3 bg-gray-800 rounded-full wheel-spin"></div>
                          <div className="absolute -bottom-1 right-1 w-3 h-3 bg-gray-800 rounded-full wheel-spin"></div>
                          {/* Headlights */}
                          <div className="absolute top-3 -left-1 w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
                          {/* Safety indicator */}
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                            <CheckCircle className="h-4 w-4 text-white" />
                          </div>
                        </div>
                        
                        {/* Exhaust effect */}
                        <div className="absolute top-1/2 -left-3 transform -translate-y-1/2">
                          <div className="exhaust-puff w-2 h-2 bg-gray-300 rounded-full opacity-40 animate-ping" style={{animationDelay: '0s'}}></div>
                          <div className="exhaust-puff absolute -left-2 w-1 h-1 bg-gray-400 rounded-full opacity-30 animate-ping" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3D Parents with Faces */}
                  <div className="parents-3d absolute left-4 top-1/2 transform -translate-y-1/2 z-20">
                    <div className="parents-container bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border transform-gpu parent-wave">
                      {/* Mom */}
                      <div className="parent-figure mb-3 text-center">
                        <div className="parent-face w-12 h-12 bg-gradient-to-br from-pink-100 to-pink-200 rounded-full mx-auto mb-2 relative overflow-hidden shadow-lg face-bob">
                          {/* Hair */}
                          <div className="absolute top-0 left-1 right-1 h-4 bg-amber-600 rounded-t-full"></div>
                          {/* Eyes */}
                          <div className="absolute top-4 left-3 w-1.5 h-1.5 bg-blue-800 rounded-full eye-blink"></div>
                          <div className="absolute top-4 right-3 w-1.5 h-1.5 bg-blue-800 rounded-full eye-blink"></div>
                          {/* Smile */}
                          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-4 h-2 border-b-2 border-pink-600 rounded-b-full smile-animation"></div>
                        </div>
                        <div className="text-xs text-gray-600 font-medium">Mom</div>
                      </div>
                      
                      {/* Dad */}
                      <div className="parent-figure text-center">
                        <div className="parent-face w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full mx-auto mb-2 relative overflow-hidden shadow-lg face-bob" style={{animationDelay: '0.3s'}}>
                          {/* Hair */}
                          <div className="absolute top-1 left-2 right-2 h-3 bg-amber-800 rounded-t-md"></div>
                          {/* Eyes */}
                          <div className="absolute top-4 left-3 w-1.5 h-1.5 bg-brown-800 rounded-full eye-blink" style={{animationDelay: '0.2s'}}></div>
                          <div className="absolute top-4 right-3 w-1.5 h-1.5 bg-brown-800 rounded-full eye-blink" style={{animationDelay: '0.2s'}}></div>
                          {/* Smile */}
                          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-4 h-2 border-b-2 border-orange-600 rounded-b-full smile-animation" style={{animationDelay: '0.5s'}}></div>
                        </div>
                        <div className="text-xs text-gray-600 font-medium">Dad</div>
                      </div>
                      
                      {/* Heart and watching indicator */}
                      <div className="mt-3 text-center">
                        <Heart className="h-6 w-6 text-red-400 fill-red-200 mx-auto heart-beat" />
                        <div className="text-xs text-gray-500 mt-1">Watching with love</div>
                      </div>
                    </div>
                  </div>

                  {/* Floating Safety Message */}
                  <div className="safety-message absolute top-4 right-4 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium shadow-lg transform-gpu float-animation">
                    ✓ Safe & Secure
                  </div>
                  
                  {/* Speed indicator */}
                  <div className="speed-indicator absolute bottom-4 left-4 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                    <span className="speed-value">25</span> mph
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
  );
}
