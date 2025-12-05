import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Play, Check, Heart, Calendar, Users, Star, Sparkles, Globe2, Flower2 } from "lucide-react";
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
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50 pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary mb-4">
              <Star className="w-4 h-4" />
              Trusted by 10,000+ couples worldwide
            </div>
            
            <h1 className="font-playfair text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
              Online <span className="text-primary">Invitation</span> Maker
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Create online invitations in minutes by choosing from hundreds of customizable templates for Indian and Middle Eastern weddings, engagements, and special celebrations.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                className="group text-lg px-8 py-6"
                asChild
                data-testid="button-get-started"
              >
                <Link href="/templates">
                  Get Started for Free
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-6"
                data-testid="button-watch-demo"
              >
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </div>

            {/* Hero Image */}
            <div className="mt-12 rounded-2xl overflow-hidden shadow-2xl border border-border">
              <img 
                src={homepageHero} 
                alt="Wedding Invitation Templates" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-4">
              Popular Invitation Categories
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Find the perfect invitation for your special occasion
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Wedding */}
            <Link href="/templates?category=wedding" data-testid="link-category-wedding">
              <Card className="group overflow-hidden hover-elevate active-elevate-2 cursor-pointer border-2 transition-all" data-testid="card-category-wedding">
                <div className="aspect-[4/3] bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/20 dark:to-pink-900/20 flex items-center justify-center">
                  <Heart className="w-16 h-16 text-rose-500" />
                </div>
                <div className="p-6">
                  <h3 className="font-playfair text-2xl font-bold text-foreground mb-2">
                    Wedding Invites
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Elegant video & card invites for your big day
                  </p>
                  <div className="flex items-center text-primary font-medium group-hover:translate-x-1 transition-transform">
                    Browse Templates
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </div>
              </Card>
            </Link>

            {/* Engagement */}
            <Link href="/templates?category=engagement" data-testid="link-category-engagement">
              <Card className="group overflow-hidden hover-elevate active-elevate-2 cursor-pointer border-2 transition-all" data-testid="card-category-engagement">
                <div className="aspect-[4/3] bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 flex items-center justify-center">
                  <Users className="w-16 h-16 text-purple-500" />
                </div>
                <div className="p-6">
                  <h3 className="font-playfair text-2xl font-bold text-foreground mb-2">
                    Engagement Ceremony
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Celebrate your engagement with charm
                  </p>
                  <div className="flex items-center text-primary font-medium group-hover:translate-x-1 transition-transform">
                    Browse Templates
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </div>
              </Card>
            </Link>

            {/* Save the Date */}
            <Link href="/templates?category=save-the-date" data-testid="link-category-save-the-date">
              <Card className="group overflow-hidden hover-elevate active-elevate-2 cursor-pointer border-2 transition-all" data-testid="card-category-save-the-date">
                <div className="aspect-[4/3] bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center">
                  <Calendar className="w-16 h-16 text-amber-500" />
                </div>
                <div className="p-6">
                  <h3 className="font-playfair text-2xl font-bold text-foreground mb-2">
                    Save the Date
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Beautiful announcements for your upcoming celebration
                  </p>
                  <div className="flex items-center text-primary font-medium group-hover:translate-x-1 transition-transform">
                    Browse Templates
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </div>
              </Card>
            </Link>
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild data-testid="button-browse-all">
              <Link href="/templates">
                Browse All Templates
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 md:py-24" data-testid="section-how-it-works">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Create your perfect invitation in just 3 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-2xl">
                  1
                </div>
              </div>
              <h3 className="font-playfair text-2xl font-bold text-foreground">
                Choose an Invite
              </h3>
              <p className="text-muted-foreground">
                Select from hundreds of beautiful video & card templates designed for Indian and Middle Eastern celebrations
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-2xl">
                  2
                </div>
              </div>
              <h3 className="font-playfair text-2xl font-bold text-foreground">
                Customize Your Invite
              </h3>
              <p className="text-muted-foreground">
                Add your details, upload photos, choose colors, and personalize every element to match your style
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-2xl">
                  3
                </div>
              </div>
              <h3 className="font-playfair text-2xl font-bold text-foreground">
                Download & Share
              </h3>
              <p className="text-muted-foreground">
                Get your invitation instantly and share via WhatsApp, email, or social media with all your guests
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button size="lg" asChild data-testid="button-start-creating">
              <Link href="/templates">
                Start Creating Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Cultural Focus */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-4">
              Celebrate Your Heritage
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Invitations designed specifically for Indian and Middle Eastern wedding traditions
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <Card className="p-6 text-center hover-elevate" data-testid="card-culture-punjabi">
              <div className="w-12 h-12 mx-auto mb-3 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                <Flower2 className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Indian Punjabi</h3>
              <p className="text-sm text-muted-foreground">Traditional & Modern</p>
            </Card>

            <Card className="p-6 text-center hover-elevate" data-testid="card-culture-south-indian">
              <div className="w-12 h-12 mx-auto mb-3 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">South Indian</h3>
              <p className="text-sm text-muted-foreground">Temple & Cultural</p>
            </Card>

            <Card className="p-6 text-center hover-elevate" data-testid="card-culture-arabic">
              <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Arabic Gulf</h3>
              <p className="text-sm text-muted-foreground">Elegant & Luxurious</p>
            </Card>

            <Card className="p-6 text-center hover-elevate" data-testid="card-culture-modern">
              <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Modern Fusion</h3>
              <p className="text-sm text-muted-foreground">Contemporary Style</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose WeddingInvite.ai
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Check className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg text-foreground">Instant Preview</h3>
              <p className="text-muted-foreground">See your customized invitation in real-time before you download</p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Check className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg text-foreground">Cultural Authenticity</h3>
              <p className="text-muted-foreground">Templates designed specifically for Indian and Arabic traditions</p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Check className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg text-foreground">WhatsApp Ready</h3>
              <p className="text-muted-foreground">Download and share directly via WhatsApp with your guests</p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <CustomerReviews />

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="font-playfair text-3xl md:text-5xl font-bold text-foreground">
              Ready to Create Your Perfect Invitation?
            </h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of couples who have created beautiful invitations for their special day
            </p>
            <Button size="lg" className="text-lg px-8 py-6" asChild data-testid="button-cta-browse">
              <Link href="/templates">
                Browse Templates
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
