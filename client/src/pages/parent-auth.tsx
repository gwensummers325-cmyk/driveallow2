import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Users, Shield, Heart, Car, ArrowLeft, ArrowRight } from "lucide-react";
import { Layout } from "@/components/layout";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { PlanSelection } from "@/components/plan-selection";
import { PaymentSetup } from "@/components/payment-setup";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);

type RegistrationStep = 'account' | 'payment';

export default function ParentAuth() {
  const { user, loginMutation } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState({
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
  });

  const [registrationStep, setRegistrationStep] = useState<RegistrationStep>('account');
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginForm);
  };

  const handleAccountInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!registerForm.firstName || !registerForm.lastName || !registerForm.email || 
        !registerForm.username || !registerForm.password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setRegistrationStep('payment');
  };

  const registerWithPaymentMutation = useMutation({
    mutationFn: async ({ paymentMethodId }: { paymentMethodId: string }) => {
      const response = await apiRequest("POST", "/api/register-with-payment", {
        ...registerForm,
        role: "parent",
        selectedPlan: "driveallow_pro",
        paymentMethodId,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Account Created!",
        description: "Your 7-day free trial has started. Welcome to DriveAllow!",
      });
      setLocation("/");
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    },
  });

  const handlePaymentSetup = async (paymentMethodId: string) => {
    registerWithPaymentMutation.mutate({ paymentMethodId });
  };

  return (
    <Layout backPath="/">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left side - Hero content */}
        <div className="text-center lg:text-left space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent animate-gradient-x">
              Parent or Guardian
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Keep your teen safe on the road while teaching responsible driving habits through smart allowance management.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-gray-700">Monitor your teen's driving incidents</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <span className="text-gray-700">Manage allowances and bonuses</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Heart className="h-5 w-5 text-purple-600" />
              </div>
              <span className="text-gray-700">Peace of mind while they drive</span>
            </div>
          </div>
        </div>

        {/* Right side - Auth forms */}
        <div className="w-full max-w-md mx-auto">
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold">Parent or Guardian Access</CardTitle>
              <CardDescription>
                Sign in or create your parent or guardian account<br/>
                <span className="text-xs text-gray-500 mt-2 inline-block">Test login: <strong>testparent</strong> / <strong>parent123</strong></span>
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {registrationStep === 'account' ? (
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="login">Sign In</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        type="text"
                        value={loginForm.username}
                        onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        required
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? "Signing In..." : "Sign In"}
                    </Button>
                  </form>
                </TabsContent>
                
                  <TabsContent value="register">
                    <form onSubmit={handleAccountInfoSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          type="text"
                          value={registerForm.firstName}
                          onChange={(e) => setRegisterForm({ ...registerForm, firstName: e.target.value })}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          type="text"
                          value={registerForm.lastName}
                          onChange={(e) => setRegisterForm({ ...registerForm, lastName: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="registerUsername">Username</Label>
                      <Input
                        id="registerUsername"
                        type="text"
                        value={registerForm.username}
                        onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="registerPassword">Password</Label>
                      <Input
                        id="registerPassword"
                        type="password"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                        required
                      />
                    </div>
                    
                      <Button 
                        type="submit" 
                        className="w-full" 
                        data-testid="button-continue-account"
                      >
                        Continue to Payment
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Button 
                      variant="ghost" 
                      onClick={() => setRegistrationStep('account')}
                      className="flex items-center gap-2"
                      data-testid="button-back-to-account"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </Button>
                    <div className="text-sm text-gray-500">
                      Step 2 of 2
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <PlanSelection onContinue={() => {}} />
                    
                    <Elements stripe={stripePromise}>
                      <PaymentSetup
                        selectedPlan="driveallow_pro"
                        onPaymentSetup={handlePaymentSetup}
                        isLoading={registerWithPaymentMutation.isPending}
                      />
                    </Elements>
                  </div>
                </div>
              )}

              {registrationStep === 'account' && (
                <div className="mt-6 text-center text-sm text-gray-600">
                  <span>Need teen access? </span>
                  <button 
                    onClick={() => setLocation("/auth/teen")}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Teen Sign In
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </Layout>
  );
}