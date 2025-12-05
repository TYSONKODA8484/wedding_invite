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
import SEOLandingPage from "@/pages/SEOLandingPage";
// TODO: Re-enable after MVP - Monthly subscription pricing
// import Pricing from "@/pages/Pricing";
import HowItWorks from "@/pages/HowItWorks";
import Examples from "@/pages/Examples";
import Blog from "@/pages/Blog";
import ArticlePage from "@/pages/ArticlePage";
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
      <Route path="/templates/:category" component={Templates} />
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
      <Route path="/culture/indian-wedding-video-invitation/christian" component={CulturePage} />
      {/* Direct culture routes (for cleaner URLs) */}
      <Route path="/culture/punjabi" component={CulturePage} />
      <Route path="/culture/tamil" component={CulturePage} />
      <Route path="/culture/telugu" component={CulturePage} />
      <Route path="/culture/gujarati" component={CulturePage} />
      <Route path="/culture/bengali" component={CulturePage} />
      <Route path="/culture/muslim-nikah" component={CulturePage} />
      <Route path="/culture/christian" component={CulturePage} />
      {/* Arabic Wedding Cultures */}
      <Route path="/culture/arabic-wedding-video-uae-saudi" component={CulturePage} />
      {/* Global Cultures */}
      <Route path="/culture/nigerian-traditional-wedding-video" component={CulturePage} />
      <Route path="/culture/quinceanera-video-invitation" component={CulturePage} />
      <Route path="/culture/chinese-tea-ceremony-video" component={CulturePage} />
      <Route path="/culture/korean-pyebaek-video" component={CulturePage} />
      <Route path="/culture/filipino-debut-video" component={CulturePage} />
      <Route path="/culture/jewish-bar-bat-mitzvah-video-invitation" component={CulturePage} />
      
      {/* Focus Markets: India + UAE/Arabic Countries */}
      <Route path="/countries/india" component={CountryPage} />
      <Route path="/countries/uae" component={CountryPage} />
      <Route path="/countries/saudi-arabia" component={CountryPage} />
      
      {/* SEO Landing Pages - Clean Top-Level URLs */}
      {/* Regional Pages */}
      <Route path="/india" component={SEOLandingPage} />
      <Route path="/uae" component={SEOLandingPage} />
      <Route path="/saudi-arabia" component={SEOLandingPage} />
      
      {/* Category Pages - Video */}
      <Route path="/wedding-invitation-video" component={SEOLandingPage} />
      <Route path="/birthday-invitation-video" component={SEOLandingPage} />
      
      {/* Category Pages - Card */}
      <Route path="/wedding-invitation-card" component={SEOLandingPage} />
      <Route path="/birthday-invitation-card" component={SEOLandingPage} />
      
      {/* Combined Regional + Category Pages (India) */}
      <Route path="/india/wedding-invitation-video" component={SEOLandingPage} />
      <Route path="/india/wedding-invitation-card" component={SEOLandingPage} />
      <Route path="/india/birthday-invitation-video" component={SEOLandingPage} />
      <Route path="/india/birthday-invitation-card" component={SEOLandingPage} />
      
      {/* Combined Regional + Category Pages (UAE) */}
      <Route path="/uae/wedding-invitation-video" component={SEOLandingPage} />
      <Route path="/uae/wedding-invitation-card" component={SEOLandingPage} />
      <Route path="/uae/birthday-invitation-video" component={SEOLandingPage} />
      <Route path="/uae/birthday-invitation-card" component={SEOLandingPage} />
      
      {/* Combined Regional + Category Pages (Saudi Arabia) */}
      <Route path="/saudi-arabia/wedding-invitation-video" component={SEOLandingPage} />
      <Route path="/saudi-arabia/wedding-invitation-card" component={SEOLandingPage} />
      <Route path="/saudi-arabia/birthday-invitation-video" component={SEOLandingPage} />
      <Route path="/saudi-arabia/birthday-invitation-card" component={SEOLandingPage} />
      
      {/* TODO: Re-enable after MVP - Monthly subscription pricing */}
      {/* <Route path="/pricing" component={Pricing} /> */}
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/examples" component={Examples} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={ArticlePage} />
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

  // Handle Google redirect result at app level
  // This runs on every app mount to check if user just returned from Google auth
  useEffect(() => {
    const handleGoogleRedirect = async () => {
      console.log("[Google Auth] Checking for redirect result...");
      try {
        const result = await getRedirectResult(auth);
        console.log("[Google Auth] getRedirectResult returned:", result ? "User found" : "No result");
        
        if (result) {
          const user = result.user;
          console.log("[Google Auth] User details:", {
            email: user.email,
            displayName: user.displayName,
            uid: user.uid
          });
          
          // Get Firebase ID token
          const idToken = await user.getIdToken();
          console.log("[Google Auth] Got Firebase ID token, sending to backend...");
          
          // Send ID token to backend for verification
          const response = await fetch("/api/auth/google", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken }),
          });
          
          const data = await response.json();
          console.log("[Google Auth] Backend response:", { ok: response.ok, data });
          
          if (!response.ok) {
            throw new Error(data.error || "Google sign-in failed");
          }
          
          // Store JWT token and user data
          localStorage.setItem("auth_token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          console.log("[Google Auth] Saved to localStorage:", {
            token: data.token.substring(0, 20) + "...",
            user: data.user
          });
          
          // Dispatch custom event to immediately update UI
          window.dispatchEvent(new Event('authStateChanged'));
          console.log("[Google Auth] Dispatched authStateChanged event");
          
          toast({
            title: "Signed in with Google!",
            description: `Welcome, ${data.user.name}`,
          });
        }
      } catch (error: any) {
        console.error("[Google Auth] Error:", error);
        // Show error for Firebase auth errors (except no-auth-event which is normal)
        if (error.code && error.code !== 'auth/no-auth-event') {
          console.error("[Google Auth] Firebase error:", error.code, error.message);
          toast({
            title: "Google sign-in failed",
            description: error.message || "Please try again",
            variant: "destructive",
          });
        } 
        // Show error for network/backend failures
        else if (!error.code && error.message) {
          console.error("[Google Auth] Network/Backend error:", error.message);
          toast({
            title: "Authentication failed",
            description: error.message,
            variant: "destructive",
          });
        }
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
