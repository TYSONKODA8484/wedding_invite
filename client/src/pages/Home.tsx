import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play, Check, Heart, Calendar, Users, Star, Sparkles, Globe2, Flower2, ChevronDown, Zap, Shield, Clock } from "lucide-react";
import { CustomerReviews } from "@/components/CustomerReviews";
import homepageHero from "@assets/generated_images/Homepage_cinematic_wedding_hero_efb94fa0.png";

export default function Home() {
  const [location] = useLocation();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, [location]);

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "WeddingInvite.ai",
    url: "https://weddinginvite.ai",
    logo: "https://weddinginvite.ai/logo.png",
    description: "Premium AI-powered wedding video invitation maker for Indian, UAE, and Saudi Arabian weddings",
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN"
    },
    sameAs: [
      "https://instagram.com/weddinginvite.ai",
      "https://facebook.com/weddinginvite.ai"
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "WeddingInvite.ai",
    url: "https://weddinginvite.ai",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://weddinginvite.ai/templates?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Can I share wedding invitations on WhatsApp?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! All our wedding video invitations are optimized for WhatsApp sharing. You can easily download and share them with your guests via WhatsApp, Instagram, or any messaging platform."
        }
      },
      {
        "@type": "Question",
        name: "Do you have templates for Indian weddings?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, we offer beautiful templates for Indian weddings including Punjabi, South Indian, Marathi, and North Indian styles. We also have ceremony-specific templates for Mehendi, Sangeet, Haldi, and Reception."
        }
      },
      {
        "@type": "Question",
        name: "Are templates available for Arabic weddings?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, we have elegant templates for UAE and Saudi Arabian weddings with traditional Arabic designs, Islamic motifs, and bilingual English-Arabic support."
        }
      }
    ]
  };

  const scrollToContent = () => {
    const element = document.getElementById("categories");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Indian Wedding Video Invitation Maker | WhatsApp Wedding Invites"
        description="Create stunning Indian wedding video invitations for WhatsApp in minutes. 500+ templates for Mehendi, Sangeet, Hindu, Muslim weddings. Free preview, instant download. ₹1,200-₹2,900."
        keywords="indian wedding invitation video, whatsapp wedding video, wedding invitation video maker, digital wedding invitation india, hindi wedding video, punjabi wedding invitation, south indian wedding video, mehendi invitation video, sangeet video invitation, muslim wedding invitation, arabic wedding video, uae wedding invitation, dubai wedding video, saudi wedding invitation"
        schema={[organizationSchema, websiteSchema, faqSchema]}
        locale="en_IN"
      />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-b from-primary/5 via-background to-background overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 py-12 md:py-20">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary animate-fade-in">
              <Star className="w-4 h-4 fill-primary" />
              Trusted by 10,000+ couples worldwide
            </div>
            
            {/* Main heading */}
            <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] tracking-tight">
              Create Beautiful
              <br />
              <span className="text-primary">Video Invitations</span>
            </h1>
            
            {/* Subheading */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Design stunning video and card invitations for weddings, engagements, and celebrations. 
              Perfect for Indian and Middle Eastern traditions.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button 
                size="lg" 
                className="group text-base md:text-lg px-8 py-6 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
                asChild
                data-testid="button-get-started"
              >
                <Link href="/templates">
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="text-base md:text-lg px-8 py-6 bg-background/80 backdrop-blur-sm"
                data-testid="button-watch-demo"
              >
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </div>

            {/* Hero Image with premium frame */}
            <div className="mt-12 md:mt-16 relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/50 bg-card">
                <img 
                  src={homepageHero} 
                  alt="Wedding Invitation Templates" 
                  className="w-full h-auto"
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>

            {/* Scroll indicator */}
            <button 
              onClick={scrollToContent}
              className="mt-8 mx-auto flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer group"
              aria-label="Scroll to content"
            >
              <span className="text-sm font-medium">Explore Templates</span>
              <ChevronDown className="w-5 h-5 animate-bounce" />
            </button>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section id="categories" className="py-20 md:py-28 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Popular Categories</Badge>
            <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Find Your Perfect Invitation
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Choose from our curated collection of professionally designed templates
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {/* Wedding */}
            <Link href="/templates?category=wedding" data-testid="link-category-wedding">
              <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-card h-full" data-testid="card-category-wedding">
                <div className="aspect-[4/3] bg-gradient-to-br from-rose-100 to-pink-50 dark:from-rose-950/50 dark:to-pink-950/30 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-rose-200/50 to-transparent dark:from-rose-900/30" />
                  <Heart className="w-20 h-20 text-rose-500 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="p-6 lg:p-8">
                  <h3 className="font-playfair text-xl lg:text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    Wedding Invites
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm lg:text-base">
                    Elegant video & card invites for your special day
                  </p>
                  <div className="flex items-center text-primary font-medium text-sm group-hover:gap-3 gap-2 transition-all">
                    Browse Templates
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Card>
            </Link>

            {/* Engagement */}
            <Link href="/templates?category=engagement" data-testid="link-category-engagement">
              <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-card h-full" data-testid="card-category-engagement">
                <div className="aspect-[4/3] bg-gradient-to-br from-purple-100 to-indigo-50 dark:from-purple-950/50 dark:to-indigo-950/30 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-200/50 to-transparent dark:from-purple-900/30" />
                  <Users className="w-20 h-20 text-purple-500 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="p-6 lg:p-8">
                  <h3 className="font-playfair text-xl lg:text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    Engagement Ceremony
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm lg:text-base">
                    Celebrate your engagement with charm
                  </p>
                  <div className="flex items-center text-primary font-medium text-sm group-hover:gap-3 gap-2 transition-all">
                    Browse Templates
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Card>
            </Link>

            {/* Save the Date */}
            <Link href="/templates?category=save-the-date" data-testid="link-category-save-the-date">
              <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-card h-full" data-testid="card-category-save-the-date">
                <div className="aspect-[4/3] bg-gradient-to-br from-amber-100 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/30 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-200/50 to-transparent dark:from-amber-900/30" />
                  <Calendar className="w-20 h-20 text-amber-500 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="p-6 lg:p-8">
                  <h3 className="font-playfair text-xl lg:text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    Save the Date
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm lg:text-base">
                    Beautiful announcements for your celebration
                  </p>
                  <div className="flex items-center text-primary font-medium text-sm group-hover:gap-3 gap-2 transition-all">
                    Browse Templates
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Card>
            </Link>
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="group" asChild data-testid="button-browse-all">
              <Link href="/templates">
                View All Templates
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 md:py-28" data-testid="section-how-it-works">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Simple Process</Badge>
            <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Create your perfect invitation in just 3 simple steps
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 relative">
              {/* Connecting line (desktop only) */}
              <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />
              
              {/* Step 1 */}
              <div className="text-center space-y-4 relative">
                <div className="relative inline-flex">
                  <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground font-bold text-2xl shadow-lg shadow-primary/30 rotate-3 group-hover:rotate-0 transition-transform">
                    1
                  </div>
                </div>
                <h3 className="font-playfair text-xl lg:text-2xl font-bold text-foreground">
                  Choose a Template
                </h3>
                <p className="text-muted-foreground text-sm lg:text-base max-w-xs mx-auto">
                  Browse hundreds of beautiful video & card templates designed for Indian and Middle Eastern celebrations
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center space-y-4 relative">
                <div className="relative inline-flex">
                  <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground font-bold text-2xl shadow-lg shadow-primary/30 -rotate-3 group-hover:rotate-0 transition-transform">
                    2
                  </div>
                </div>
                <h3 className="font-playfair text-xl lg:text-2xl font-bold text-foreground">
                  Customize Details
                </h3>
                <p className="text-muted-foreground text-sm lg:text-base max-w-xs mx-auto">
                  Add your names, photos, venue details, and personalize every element to match your style
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center space-y-4 relative">
                <div className="relative inline-flex">
                  <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground font-bold text-2xl shadow-lg shadow-primary/30 rotate-3 group-hover:rotate-0 transition-transform">
                    3
                  </div>
                </div>
                <h3 className="font-playfair text-xl lg:text-2xl font-bold text-foreground">
                  Download & Share
                </h3>
                <p className="text-muted-foreground text-sm lg:text-base max-w-xs mx-auto">
                  Get your invitation instantly and share via WhatsApp, email, or social media
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-16">
            <Button size="lg" className="group shadow-lg shadow-primary/20" asChild data-testid="button-start-creating">
              <Link href="/templates">
                Start Creating Now
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Cultural Focus */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Cultural Heritage</Badge>
            <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Celebrate Your Traditions
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Invitations designed with respect for Indian and Middle Eastern wedding customs
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 max-w-4xl mx-auto">
            <Link href="/culture/punjabi">
              <Card className="p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group h-full" data-testid="card-culture-punjabi">
                <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900/30 dark:to-orange-950/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Flower2 className="w-7 h-7 text-orange-600" />
                </div>
                <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">Punjabi</h3>
                <p className="text-xs text-muted-foreground">Traditional & Modern</p>
              </Card>
            </Link>

            <Link href="/culture/tamil">
              <Card className="p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group h-full" data-testid="card-culture-south-indian">
                <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-red-100 to-red-50 dark:from-red-900/30 dark:to-red-950/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Heart className="w-7 h-7 text-red-600" />
                </div>
                <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">South Indian</h3>
                <p className="text-xs text-muted-foreground">Temple & Cultural</p>
              </Card>
            </Link>

            <Link href="/culture/arabic-wedding-video-uae-saudi">
              <Card className="p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group h-full" data-testid="card-culture-arabic">
                <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-950/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Star className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">Arabic Gulf</h3>
                <p className="text-xs text-muted-foreground">Elegant & Luxurious</p>
              </Card>
            </Link>

            <Link href="/culture">
              <Card className="p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group h-full" data-testid="card-culture-modern">
                <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-950/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Globe2 className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">All Cultures</h3>
                <p className="text-xs text-muted-foreground">View All Styles</p>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Why Choose Us</Badge>
            <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Everything You Need
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Professional features to create stunning invitations with ease
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            <Card className="p-8 text-center hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-b from-card to-muted/30">
              <div className="w-14 h-14 mx-auto mb-6 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Zap className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-xl text-foreground mb-3">Instant Preview</h3>
              <p className="text-muted-foreground">See your customized invitation in real-time before you download</p>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-b from-card to-muted/30">
              <div className="w-14 h-14 mx-auto mb-6 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Shield className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-xl text-foreground mb-3">Cultural Authenticity</h3>
              <p className="text-muted-foreground">Templates designed specifically for Indian and Arabic traditions</p>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-b from-card to-muted/30">
              <div className="w-14 h-14 mx-auto mb-6 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Clock className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-xl text-foreground mb-3">Ready in Minutes</h3>
              <p className="text-muted-foreground">Create and download your invitation in less than 10 minutes</p>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-b from-card to-muted/30">
              <div className="w-14 h-14 mx-auto mb-6 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Check className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-xl text-foreground mb-3">WhatsApp Ready</h3>
              <p className="text-muted-foreground">Download and share directly via WhatsApp with your guests</p>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-b from-card to-muted/30">
              <div className="w-14 h-14 mx-auto mb-6 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-xl text-foreground mb-3">Premium Quality</h3>
              <p className="text-muted-foreground">HD video and high-resolution card exports for the best quality</p>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-b from-card to-muted/30">
              <div className="w-14 h-14 mx-auto mb-6 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Heart className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-xl text-foreground mb-3">Made with Love</h3>
              <p className="text-muted-foreground">Every template crafted with care for your special moments</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <CustomerReviews />

      {/* CTA Section */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(var(--primary),0.1),transparent_50%)]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <Badge variant="secondary" className="mb-2">Get Started Today</Badge>
            <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              Ready to Create Your
              <br />
              <span className="text-primary">Perfect Invitation?</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Join thousands of couples who have created beautiful invitations for their special day
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button size="lg" className="text-lg px-10 py-6 shadow-lg shadow-primary/20 group" asChild data-testid="button-cta-browse">
                <Link href="/templates">
                  Browse Templates
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-10 py-6" asChild>
                <Link href="/how-it-works">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
