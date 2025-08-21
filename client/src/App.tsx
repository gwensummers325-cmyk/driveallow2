import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import Landing from "@/pages/landing";
import ParentDashboard from "@/pages/parent-dashboard";
import TeenDashboard from "@/pages/teen-dashboard";
import MobileDataSender from "@/pages/mobile-data-sender";
import ParentAuth from "@/pages/parent-auth";
import TeenAuth from "@/pages/teen-auth";
import NotFound from "@/pages/not-found";

function Router() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/auth/parent" component={ParentAuth} />
      <Route path="/auth/teen" component={TeenAuth} />
      <Route path="/mobile-data" component={MobileDataSender} />
      <Route path="/">
        {!user ? (
          <Landing />
        ) : user.role === 'parent' ? (
          <ParentDashboard />
        ) : (
          <TeenDashboard />
        )}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
