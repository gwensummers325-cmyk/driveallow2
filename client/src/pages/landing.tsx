import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, DollarSign, Bell, Users, Car, Heart, Eye, CheckCircle, ArrowRight, Star, Smartphone, Mail } from "lucide-react";
import { useLocation } from "wouter";
import { Layout } from "@/components/layout";
import illustrationImage from "@assets/Gemini_Generated_Image_vpd2ukvpd2ukvpd2_1755869635476.png";

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
            <div className="text-center lg:text-left relative">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight font-anton headline-animate relative z-10 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent animate-gradient">
                Drive Safe. Get Rewarded.
              </h2>
              
              {/* Moving Car Animation */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <Car className="absolute top-1/2 -translate-y-1/2 h-8 w-8 text-primary headline-car" />
              </div>
              
              <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                DriveAllow incentivizes safe teen driving using smart allowance management that rewards good driving habits.
              </p>

              {/* Social Proof Testimonials */}
              <div className="mb-8 space-y-3">
                {/* Parent Testimonial */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-white/50">
                  <div className="flex items-center mb-2">
                    <div className="flex space-x-1 mr-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <div className="text-xs text-gray-600">
                      <span className="font-semibold text-gray-800">Sarah M.</span> • Parent
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 italic">
                    "Finally, peace of mind! My daughter's driving has improved dramatically since we started using DriveAllow."
                  </p>
                </div>

                {/* Teen Testimonial */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-white/50">
                  <div className="flex items-center mb-2">
                    <div className="flex space-x-1 mr-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <div className="text-xs text-gray-600">
                      <span className="font-semibold text-gray-800">Alex T.</span> • Teen Driver
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 italic">
                    "I love earning bonuses for safe driving! Way better than just getting lectured."
                  </p>
                </div>
              </div>
              
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

            {/* Right side - 3D Illustration */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-lg" style={{perspective: '1000px'}}>
                {/* 3D Illustration Container */}
                <div className="illustration-3d relative">
                  {/* Background depth layer */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-white to-orange-100 rounded-3xl transform translate-x-2 translate-y-2 blur-sm opacity-30"></div>
                  
                  {/* Middle depth layer */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50 rounded-3xl transform translate-x-1 translate-y-1 opacity-60 shadow-lg"></div>
                  
                  {/* Main illustration container */}
                  <div className="relative bg-white rounded-3xl shadow-2xl border border-white/50 p-8 transform hover:rotateY-5 hover:rotateX-2 transition-all duration-700 hover:scale-105">
                    {/* Inner shadow for depth */}
                    <div className="absolute inset-4 rounded-2xl shadow-inner bg-gradient-to-br from-white/50 to-transparent"></div>
                    
                    {/* Main illustration */}
                    <div className="relative z-10 transform hover:translateZ-10 transition-transform duration-500">
                      <img 
                        src={illustrationImage} 
                        alt="Parents waving goodbye to teen driver" 
                        className="w-full h-auto max-h-80 object-contain rounded-2xl transform hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    
                    {/* Floating elements for extra depth */}
                    <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-500 rounded-full shadow-lg transform animate-bounce" style={{animationDelay: '0.5s'}}>
                      <div className="w-full h-full flex items-center justify-center text-white text-sm font-bold">✓</div>
                    </div>
                    
                    <div className="absolute -bottom-4 -left-4 w-10 h-10 bg-blue-500 rounded-full shadow-lg flex items-center justify-center transform animate-pulse">
                      <DollarSign className="h-5 w-5 text-white" />
                    </div>
                    
                    {/* Light reflection effect */}
                    <div className="absolute top-6 left-6 w-16 h-16 bg-white/20 rounded-full blur-xl transform rotate-45"></div>
                  </div>
                  
                  {/* Ground shadow */}
                  <div className="absolute -bottom-6 left-4 right-4 h-6 bg-black/10 rounded-full blur-lg transform skew-x-12"></div>
                </div>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-12">
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
          
          {/* Peace of Mind Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
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
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Phone Use Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Track phone usage while driving to prevent distractions and promote safer driving habits.
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
          
          {/* Second row - centered */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Unlimited Teen Drivers</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Monitor as many teen drivers as you need with no additional fees or restrictions.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Star className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">Automatic Safety Scoring</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Real-time safety scores help teens understand their driving performance and improve habits.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle className="text-lg">Email Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Stay informed with instant email alerts about driving incidents and safety milestones.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="bg-gradient-to-r from-primary to-blue-600 text-white py-16 rounded-3xl mt-16">
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Teen's Driving?
            </h2>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Join thousands of families who've improved their teen's driving safety with DriveAllow's smart allowance system.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button 
                size="lg"
                variant="secondary"
                onClick={() => setLocation('/auth/parent')}
                className="bg-white text-primary hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg transition-all hover:shadow-xl hover:scale-105"
                data-testid="cta-parent-signup"
              >
                <Users className="h-5 w-5 mr-2" />
                Start as Parent
              </Button>
              
              <Button 
                size="lg"
                onClick={() => setLocation('/auth/teen')}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg transition-all hover:shadow-xl hover:scale-105"
                data-testid="cta-teen-signin"
              >
                <Car className="h-5 w-5 mr-2" />
                Sign In as Teen
              </Button>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-blue-100">
              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                <span>100% Safe & Secure</span>
              </div>
              <div className="flex items-center">
                <Star className="h-5 w-5 mr-2 text-yellow-300" />
                <span>4.9/5 Family Rating</span>
              </div>
              <div className="flex items-center">
                <Heart className="h-5 w-5 mr-2 text-red-300" />
                <span>Trusted by 10,000+ Families</span>
              </div>
            </div>
          </div>
        </div>

      </div>
      </div>
    </Layout>
  );
}
