import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, DollarSign, Bell, Users, Car, Heart, Eye, CheckCircle, ArrowRight, Star, Smartphone, Mail, Activity, TrendingUp, AlertTriangle, Trophy, Clock, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useRef, useEffect } from "react";
import { Layout } from "@/components/layout";
import illustrationImage from "@assets/Gemini_Generated_Image_vpd2ukvpd2ukvpd2_1755869635476.png";

export default function Landing() {
  const [, setLocation] = useLocation();
  const [activeDashboard, setActiveDashboard] = useState<'parent' | 'teen'>('parent');
  const scrollRef = useRef<HTMLDivElement>(null);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Parent of 2 teens",
      rating: 5,
      text: "DriveAllow has completely transformed how my teenagers approach driving. The allowance system motivates them to drive safely, and I finally have peace of mind knowing they're being responsible on the road."
    },
    {
      name: "Mike Rodriguez",
      role: "Father of Emma (16)",
      rating: 5,
      text: "The real-time notifications are a game-changer. I know immediately if there's an incident, and the automatic penalties have really helped my daughter understand the consequences of unsafe driving."
    },
    {
      name: "Jennifer Chen",
      role: "Mother of 3",
      rating: 5,
      text: "Managing allowances for three teen drivers was a nightmare before DriveAllow. Now everything is automated, fair, and transparent. My kids actually compete to be the safest driver!"
    },
    {
      name: "David Thompson",
      role: "Parent",
      rating: 5,
      text: "The dashboard gives me such great visibility into my son's driving habits. He's improved dramatically since we started using DriveAllow, and our car insurance has even gone down!"
    },
    {
      name: "Lisa Martinez",
      role: "Mother of Alex (17)",
      rating: 5,
      text: "What I love most is how DriveAllow encourages positive behavior rather than just punishing mistakes. The bonus system has made my son excited about safe driving achievements."
    },
    {
      name: "Robert Kim",
      role: "Father of twins",
      rating: 5,
      text: "Having twins who just got their licenses was terrifying, but DriveAllow has made the whole experience manageable. The family dashboard keeps everyone accountable and motivated."
    }
  ];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    const scrollSpeed = 0.5; // pixels per frame

    const animate = () => {
      if (scrollContainer) {
        scrollContainer.scrollLeft += scrollSpeed;
        
        // Reset scroll when we've scrolled past all original items
        const maxScroll = scrollContainer.scrollWidth / 2;
        if (scrollContainer.scrollLeft >= maxScroll) {
          scrollContainer.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };
  
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
                    Parent or Guardian
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={() => setLocation('/auth/teen')}
                    className="text-lg px-8 py-4 border-2 hover:bg-green-50"
                  >
                    Teen
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

          {/* Dashboard Preview Section */}
          <div className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl mb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent animate-gradient-x">
                  See DriveAllow in Action
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Experience how our dual dashboard system works for both parents and teens, creating transparency and accountability.
                </p>
              </div>

              {/* Dashboard Toggle */}
              <div className="flex justify-center mb-12">
                <div className="bg-white p-2 rounded-xl shadow-lg border">
                  <button
                    onClick={() => setActiveDashboard('parent')}
                    className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                      activeDashboard === 'parent'
                        ? 'bg-primary text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    data-testid="toggle-parent-dashboard"
                  >
                    <Users className="h-5 w-5 mr-2 inline" />
                    Parent Dashboard
                  </button>
                  <button
                    onClick={() => setActiveDashboard('teen')}
                    className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                      activeDashboard === 'teen'
                        ? 'bg-green-500 text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    data-testid="toggle-teen-dashboard"
                  >
                    <Car className="h-5 w-5 mr-2 inline" />
                    Teen Dashboard
                  </button>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="relative">
                {/* Parent Dashboard */}
                <div className={`transition-all duration-500 ${activeDashboard === 'parent' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute inset-0 pointer-events-none'}`}>
                  <div className="bg-white rounded-2xl shadow-2xl p-8 border">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Left Column - Overview */}
                      <div className="space-y-6">
                        <div className="bg-gradient-to-r from-primary to-blue-600 text-white p-6 rounded-xl">
                          <h3 className="text-lg font-semibold mb-4">Family Overview</h3>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-blue-100">Active Drivers</span>
                              <span className="font-bold">2</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-blue-100">Total Balance</span>
                              <span className="font-bold">$127.50</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-blue-100">Safety Score</span>
                              <div className="flex items-center">
                                <span className="font-bold mr-2">92%</span>
                                <TrendingUp className="h-4 w-4" />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                          <div className="flex items-center mb-2">
                            <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
                            <span className="font-semibold text-orange-800">Recent Alert</span>
                          </div>
                          <p className="text-orange-700 text-sm">Emma had a minor speeding incident on Main St. Penalty: $5.00</p>
                          <p className="text-orange-600 text-xs mt-1">2 hours ago</p>
                        </div>
                      </div>

                      {/* Middle Column - Teen Cards */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Teen Drivers</h3>
                        
                        <div className="bg-green-50 border border-green-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                                A
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">Alex</p>
                                <p className="text-sm text-gray-600">Perfect Week!</p>
                              </div>
                            </div>
                            <Trophy className="h-6 w-6 text-yellow-500" />
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Balance: <span className="font-semibold text-green-600">$75.00</span></span>
                            <span className="text-gray-600">Score: <span className="font-semibold text-green-600">98%</span></span>
                          </div>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                                E
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">Emma</p>
                                <p className="text-sm text-gray-600">Needs improvement</p>
                              </div>
                            </div>
                            <AlertTriangle className="h-6 w-6 text-orange-500" />
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Balance: <span className="font-semibold text-orange-600">$52.50</span></span>
                            <span className="text-gray-600">Score: <span className="font-semibold text-orange-600">85%</span></span>
                          </div>
                        </div>
                      </div>

                      {/* Right Column - Controls */}
                      <div className="space-y-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-4">Quick Actions</h4>
                          <div className="space-y-3">
                            <button className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors">
                              Add Bonus
                            </button>
                            <button className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors">
                              Report Incident
                            </button>
                            <button className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors">
                              View Settings
                            </button>
                          </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                          <div className="flex items-center mb-2">
                            <Activity className="h-5 w-5 text-blue-600 mr-2" />
                            <span className="font-semibold text-blue-800">Live Tracking</span>
                          </div>
                          <p className="text-blue-700 text-sm mb-2">Alex is currently driving</p>
                          <div className="flex items-center text-xs text-blue-600">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>Downtown area • 25 mph</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Teen Dashboard */}
                <div className={`transition-all duration-500 ${activeDashboard === 'teen' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute inset-0 pointer-events-none'}`}>
                  <div className="bg-white rounded-2xl shadow-2xl p-8 border">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Left Column - Personal Stats */}
                      <div className="space-y-6">
                        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl">
                          <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                              <Car className="h-6 w-6" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold">Alex's Dashboard</h3>
                              <p className="text-green-100 text-sm">Safe Driver</p>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-green-100">Current Balance</span>
                              <span className="font-bold text-2xl">$75.00</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-green-100">Safety Score</span>
                              <div className="flex items-center">
                                <span className="font-bold text-xl mr-2">98%</span>
                                <Trophy className="h-5 w-5 text-yellow-300" />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                          <div className="flex items-center mb-2">
                            <Trophy className="h-5 w-5 text-green-600 mr-2" />
                            <span className="font-semibold text-green-800">Achievement Unlocked!</span>
                          </div>
                          <p className="text-green-700 text-sm">Perfect Week - No incidents for 7 days</p>
                          <p className="text-green-600 text-xs mt-1">Bonus: +$10.00</p>
                        </div>
                      </div>

                      {/* Middle Column - Recent Activity */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                        
                        <div className="space-y-3">
                          <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">Safe Trip Complete</p>
                              <p className="text-xs text-gray-600">School to Home • 15 min</p>
                            </div>
                            <span className="text-green-600 font-semibold text-sm">+$2.50</span>
                          </div>

                          <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <Clock className="h-5 w-5 text-blue-500 mr-3" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">Weekly Allowance</p>
                              <p className="text-xs text-gray-600">Automatic deposit</p>
                            </div>
                            <span className="text-blue-600 font-semibold text-sm">+$50.00</span>
                          </div>

                          <div className="flex items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                            <TrendingUp className="h-5 w-5 text-yellow-600 mr-3" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">Safety Improvement</p>
                              <p className="text-xs text-gray-600">Score increased by 5%</p>
                            </div>
                            <span className="text-yellow-600 font-semibold text-sm">+$5.00</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Column - Goals & Progress */}
                      <div className="space-y-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-4">This Week's Goals</h4>
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">Safe Trips</span>
                                <span className="font-medium">8/10</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{width: '80%'}}></div>
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">No Phone Use</span>
                                <span className="font-medium">7/7 days</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{width: '100%'}}></div>
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">Speed Compliance</span>
                                <span className="font-medium">95%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{width: '95%'}}></div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                          <div className="flex items-center mb-2">
                            <Star className="h-5 w-5 text-purple-600 mr-2" />
                            <span className="font-semibold text-purple-800">Next Reward</span>
                          </div>
                          <p className="text-purple-700 text-sm mb-2">Perfect Month Challenge</p>
                          <p className="text-purple-600 text-xs">$25 bonus for 30 days incident-free</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature Highlights */}
              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="bg-white p-6 rounded-xl shadow-lg border">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Real-Time Monitoring</h3>
                  <p className="text-gray-600 text-sm">Live tracking and instant notifications for both parents and teens</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg border">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Gamified Learning</h3>
                  <p className="text-gray-600 text-sm">Achievement system that motivates teens to drive safely</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg border">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Family Transparency</h3>
                  <p className="text-gray-600 text-sm">Open communication through shared data and progress tracking</p>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonials Section */}
          <div className="py-16 bg-white rounded-3xl mb-12 shadow-lg border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent animate-gradient-x">
                  What Families Are Saying
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Thousands of families trust DriveAllow to keep their teen drivers safe and accountable.
                </p>
              </div>

              {/* Testimonials Slider */}
              <div className="relative">
                {/* Navigation Buttons */}
                <button
                  onClick={scrollLeft}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg border hover:shadow-xl transition-shadow"
                  data-testid="testimonials-scroll-left"
                >
                  <ChevronLeft className="h-6 w-6 text-gray-600" />
                </button>
                <button
                  onClick={scrollRight}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg border hover:shadow-xl transition-shadow"
                  data-testid="testimonials-scroll-right"
                >
                  <ChevronRight className="h-6 w-6 text-gray-600" />
                </button>

                {/* Testimonials Container */}
                <div
                  ref={scrollRef}
                  className="flex gap-6 overflow-x-auto scrollbar-hide px-12"
                  style={{ 
                    scrollbarWidth: 'none', 
                    msOverflowStyle: 'none',
                    WebkitOverflowScrolling: 'touch'
                  }}
                >
                  {/* Render testimonials twice for infinite scroll effect */}
                  {[...testimonials, ...testimonials].map((testimonial, index) => (
                    <div
                      key={index}
                      className="flex-none w-80 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border shadow-md hover:shadow-lg transition-shadow"
                    >
                      {/* Star Rating */}
                      <div className="flex items-center mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                        ))}
                      </div>

                      {/* Testimonial Text */}
                      <p className="text-gray-700 mb-6 leading-relaxed">
                        "{testimonial.text}"
                      </p>

                      {/* Author Info */}
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center mr-4">
                          <span className="text-white font-bold text-lg">
                            {testimonial.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{testimonial.name}</p>
                          <p className="text-sm text-gray-600">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
            <Button 
              size="lg" 
              onClick={() => setLocation('/auth/parent')}
              className="text-lg px-8 py-4 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary shadow-lg"
              data-testid="cta-parent-button"
            >
              Parent or Guardian
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => setLocation('/auth/teen')}
              className="text-lg px-8 py-4 border-2 hover:bg-green-50"
              data-testid="cta-teen-button"
            >
              Teen
              <Car className="ml-2 h-5 w-5" />
            </Button>
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
            <p className="text-xl md:text-2xl text-blue-100 mb-6 max-w-3xl mx-auto">
              Join thousands of families who've improved their teen's driving safety with DriveAllow's smart allowance system.
            </p>
            
            {/* Pricing Display */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-4">
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-white mb-1">$99<span className="text-lg text-blue-200">/month</span></div>
                    <div className="text-sm text-blue-200">Monthly billing</div>
                  </div>
                  <div className="text-blue-200 text-lg font-medium">or</div>
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-white mb-1">$999<span className="text-lg text-blue-200">/year</span></div>
                    <div className="text-sm text-green-200 font-medium">(Save $189)</div>
                  </div>
                </div>
                <div className="text-lg text-blue-100 mb-3">DriveAllow Pro - Unlimited Teen Drivers</div>
                <div className="inline-flex items-center bg-green-500/20 text-green-200 px-4 py-2 rounded-full text-sm font-medium">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  7-day free trial included
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button 
                size="lg"
                variant="secondary"
                onClick={() => setLocation('/auth/parent')}
                className="bg-white text-primary hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg transition-all hover:shadow-xl hover:scale-105"
                data-testid="cta-parent-signup"
              >
                <Users className="h-5 w-5 mr-2" />
                Parent or Guardian
              </Button>
              
              <Button 
                size="lg"
                onClick={() => setLocation('/auth/teen')}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg transition-all hover:shadow-xl hover:scale-105"
                data-testid="cta-teen-signin"
              >
                <Car className="h-5 w-5 mr-2" />
                Teen
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
