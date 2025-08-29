import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Car, DollarSign, Star, Users } from "lucide-react";
import { Layout } from "@/components/layout";

export default function TeenAuth() {
  const { user, loginMutation, registerMutation, logoutMutation } = useAuth();
  const [, setLocation] = useLocation();

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
    parentId: "",
  });

  if (user) {
    setLocation("/");
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Teen login form submitted:', {
      username: loginForm.username,
      hasPassword: !!loginForm.password,
      userAgent: navigator.userAgent
    });
    performLogin();
  };

  const performLogin = () => {
    if (!loginForm.username || !loginForm.password) {
      console.error('Missing username or password');
      return;
    }
    console.log('Performing login mutation...');
    loginMutation.mutate(loginForm);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate({
      ...registerForm,
      role: "teen",
    });
  };

  return (
    <Layout backPath="/">
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left side - Hero content */}
        <div className="text-center lg:text-left space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
              Teen Dashboard
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Drive safely, earn rewards, and build good habits that will last a lifetime.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Car className="h-5 w-5 text-green-600" />
              </div>
              <span className="text-gray-700">Track your driving progress</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-gray-700">Earn money for safe driving</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              <span className="text-gray-700">Get bonuses for great weeks</span>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <p className="text-green-800 font-medium text-center">
              Safe driving = More money in your pocket! 💰
            </p>
          </div>
        </div>

        {/* Right side - Auth forms */}
        <div className="w-full max-w-md mx-auto">
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold">Teen Access</CardTitle>
              <CardDescription>
                Sign in to access your allowance dashboard
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                    placeholder="Enter your username"
                    required
                    data-testid="input-username"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    placeholder="Enter your password"
                    required
                    data-testid="input-password"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700 touch-manipulation" 
                  disabled={loginMutation.isPending}
                  data-testid="button-signin"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  {loginMutation.isPending ? "Signing In..." : "Sign In"}
                </Button>
                
                {/* Temporary debug button */}
                <Button 
                  type="button"
                  onClick={() => {
                    setLoginForm({ username: 'thaddeus', password: 'test123' });
                    setTimeout(() => performLogin(), 100);
                  }}
                  className="w-full bg-red-600 hover:bg-red-700 mt-2" 
                  disabled={loginMutation.isPending}
                >
                  Quick Test: thaddeus/test123
                </Button>
                
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Need an account? Ask your parent to create one for you.
                </p>
              </div>
              
              <div className="mt-6 text-center text-sm text-gray-600">
                <span>Are you a parent? </span>
                <button 
                  onClick={() => setLocation("/auth/parent")}
                  className="text-green-600 hover:underline font-medium"
                >
                  Parent Sign In
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </Layout>
  );
}