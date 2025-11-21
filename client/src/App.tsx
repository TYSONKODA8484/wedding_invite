import { Switch, Route, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Templates from "@/pages/Templates";
import TemplateDetail from "@/pages/TemplateDetail";
import Editor from "@/pages/Editor";
import CategoryPage from "@/pages/CategoryPage";
import Cultures from "@/pages/Cultures";
import CulturePage from "@/pages/CulturePage";
import CountryPage from "@/pages/CountryPage";
// TODO: Re-enable after MVP - Monthly subscription pricing
// import Pricing from "@/pages/Pricing";
import HowItWorks from "@/pages/HowItWorks";
import Examples from "@/pages/Examples";
import Blog from "@/pages/Blog";
import Enterprise from "@/pages/Enterprise";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import FAQ from "@/pages/FAQ";
import Signup from "@/pages/Signup";
import Login from "@/pages/Login";
import MyTemplates from "@/pages/MyTemplates";
import { getRedirectResult } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/signup" component={Signup} />
      <Route path="/login" component={Login} />
      <Route path="/my-templates" component={MyTemplates} />
      <Route path="/templates" component={Templates} />
      <Route path="/template/:slug" component={TemplateDetail} />
      <Route path="/editor/:slug" component={Editor} />
      
      <Route path="/categories/wedding-video-invitations" component={CategoryPage} />
      <Route path="/categories/premium-luxury" component={CategoryPage} />
      <Route path="/categories/engagement-invites" component={CategoryPage} />
      <Route path="/categories/save-the-date" component={CategoryPage} />
      <Route path="/categories/baby-announcements" component={CategoryPage} />
      <Route path="/categories/birthday-anniversary" component={CategoryPage} />
      <Route path="/categories/corporate-invites" component={CategoryPage} />
      
      <Route path="/culture" component={Cultures} />
      {/* Indian Wedding Cultures */}
      <Route path="/culture/indian-wedding-video-invitation" component={CulturePage} />
      <Route path="/culture/indian-wedding-video-invitation/punjabi" component={CulturePage} />
      <Route path="/culture/indian-wedding-video-invitation/tamil" component={CulturePage} />
      <Route path="/culture/indian-wedding-video-invitation/telugu" component={CulturePage} />
      <Route path="/culture/indian-wedding-video-invitation/gujarati" component={CulturePage} />
      <Route path="/culture/indian-wedding-video-invitation/bengali" component={CulturePage} />
      <Route path="/culture/indian-wedding-video-invitation/muslim-nikah" component={CulturePage} />
      {/* Arabic Wedding Cultures */}
      <Route path="/culture/arabic-wedding-video-uae-saudi" component={CulturePage} />
      
      {/* Focus Markets: India + UAE/Arabic Countries */}
      <Route path="/countries/india" component={CountryPage} />
      <Route path="/countries/uae" component={CountryPage} />
      <Route path="/countries/saudi-arabia" component={CountryPage} />
      
      {/* TODO: Re-enable after MVP - Monthly subscription pricing */}
      {/* <Route path="/pricing" component={Pricing} /> */}
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/examples" component={Examples} />
      <Route path="/blog" component={Blog} />
      <Route path="/enterprise" component={Enterprise} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/faq" component={FAQ} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  const isEditorMode = location.startsWith('/editor');
  const isAuthPage = location.startsWith('/signup') || location.startsWith('/login');
  const { toast } = useToast();
  const [isProcessingAuth, setIsProcessingAuth] = useState(true);

  // Handle Google redirect result at app level
  // This runs on every app mount to check if user just returned from Google auth
  useEffect(() => {
    const handleGoogleRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          const user = result.user;
          
          // Get Firebase ID token
          const idToken = await user.getIdToken();
          
          // Send ID token to backend for verification
          const response = await fetch("/api/auth/google", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken }),
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.error || "Google sign-in failed");
          }
          
          // Store JWT token and user data
          localStorage.setItem("auth_token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          
          // Dispatch custom event to immediately update UI
          window.dispatchEvent(new Event('authStateChanged'));
          
          toast({
            title: "Signed in with Google!",
            description: `Welcome, ${data.user.name}`,
          });
        }
      } catch (error: any) {
        // Show error for Firebase auth errors (except no-auth-event which is normal)
        if (error.code && error.code !== 'auth/no-auth-event') {
          toast({
            title: "Google sign-in failed",
            description: error.message || "Please try again",
            variant: "destructive",
          });
        } 
        // Show error for network/backend failures
        else if (!error.code && error.message) {
          toast({
            title: "Authentication failed",
            description: error.message,
            variant: "destructive",
          });
        }
      } finally {
        setIsProcessingAuth(false);
      }
    };

    handleGoogleRedirect();
  }, [toast]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen flex flex-col bg-background">
          {/* Hide Navigation and Footer in Editor mode and Auth pages */}
          {!isEditorMode && !isAuthPage && <Navigation />}
          <main className="flex-1">
            <Router />
          </main>
          {!isEditorMode && !isAuthPage && <Footer />}
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
