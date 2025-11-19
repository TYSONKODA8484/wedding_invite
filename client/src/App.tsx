import { Switch, Route, useLocation } from "wouter";
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

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
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
      <Route path="/culture/indian-wedding-video-invitation" component={CulturePage} />
      <Route path="/culture/indian-wedding-video-invitation/punjabi" component={CulturePage} />
      <Route path="/culture/indian-wedding-video-invitation/tamil" component={CulturePage} />
      <Route path="/culture/indian-wedding-video-invitation/telugu" component={CulturePage} />
      <Route path="/culture/indian-wedding-video-invitation/gujarati" component={CulturePage} />
      <Route path="/culture/indian-wedding-video-invitation/bengali" component={CulturePage} />
      <Route path="/culture/indian-wedding-video-invitation/muslim-nikah" component={CulturePage} />
      <Route path="/culture/indian-wedding-video-invitation/christian" component={CulturePage} />
      <Route path="/culture/arabic-wedding-video-uae-saudi" component={CulturePage} />
      <Route path="/culture/nigerian-traditional-wedding-video" component={CulturePage} />
      <Route path="/culture/quinceanera-video-invitation" component={CulturePage} />
      <Route path="/culture/chinese-tea-ceremony-video" component={CulturePage} />
      <Route path="/culture/korean-pyebaek-video" component={CulturePage} />
      <Route path="/culture/filipino-debut-video" component={CulturePage} />
      <Route path="/culture/jewish-bar-bat-mitzvah-video-invitation" component={CulturePage} />
      
      <Route path="/countries/india" component={CountryPage} />
      <Route path="/countries/usa" component={CountryPage} />
      <Route path="/countries/uae" component={CountryPage} />
      <Route path="/countries/uk" component={CountryPage} />
      <Route path="/countries/nigeria" component={CountryPage} />
      <Route path="/countries/mexico" component={CountryPage} />
      <Route path="/countries/canada" component={CountryPage} />
      <Route path="/countries/china" component={CountryPage} />
      
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

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen flex flex-col bg-background">
          {/* Hide Navigation and Footer in Editor mode for full-screen customization */}
          {!isEditorMode && <Navigation />}
          <main className="flex-1">
            <Router />
          </main>
          {!isEditorMode && <Footer />}
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
