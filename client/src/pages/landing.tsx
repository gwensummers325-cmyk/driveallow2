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
                Watch Your Teen Drive Away
                <span className="block text-4xl md:text-5xl text-primary">
                  with Complete Peace of Mind
                </span>
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

            {/* Right side - Animated Scene */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md">
                {/* Parents watching */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
                  <div className="flex items-center space-x-3 bg-white/90 backdrop-blur-sm rounded-full px-6 py-4 shadow-lg border">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <Eye className="h-5 w-5 text-gray-600" />
                    <Heart className="h-6 w-6 text-red-400 fill-red-100" />
                  </div>
                </div>

                {/* Road */}
                <div className="relative h-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg overflow-hidden">
                  {/* Road lines */}
                  <div className="absolute top-1/2 left-0 w-full h-1 transform -translate-y-1/2">
                    <div className="flex space-x-4 h-full animate-pulse">
                      <div className="flex-1 bg-white opacity-50"></div>
                      <div className="flex-1 bg-transparent"></div>
                      <div className="flex-1 bg-white opacity-50"></div>
                      <div className="flex-1 bg-transparent"></div>
                      <div className="flex-1 bg-white opacity-50"></div>
                    </div>
                  </div>

                  {/* Animated Car */}
                  <div className="absolute top-1/2 transform -translate-y-1/2 car-drive-animation">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center relative shadow-lg">
                        <Car className="h-8 w-8 text-green-600" />
                        {/* Safety indicators */}
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                      </div>
                      {/* Motion trail */}
                      <div className="absolute right-full top-1/2 transform -translate-y-1/2 flex space-x-1">
                        <div className="w-2 h-1 bg-green-400 rounded-full opacity-60 animate-ping" style={{animationDelay: '0ms'}}></div>
                        <div className="w-2 h-1 bg-green-400 rounded-full opacity-40 animate-ping" style={{animationDelay: '200ms'}}></div>
                        <div className="w-2 h-1 bg-green-400 rounded-full opacity-20 animate-ping" style={{animationDelay: '400ms'}}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Safety message */}
                <div className="absolute -bottom-4 right-0 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                  Driving Safely ✓
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
