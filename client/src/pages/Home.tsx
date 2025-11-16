import { Link } from "wouter";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { CategoryCard } from "@/components/CategoryCard";
import { TemplateCard } from "@/components/TemplateCard";
import { CultureCard } from "@/components/CultureCard";
import { TestimonialCard } from "@/components/TestimonialCard";
import { ProcessStep } from "@/components/ProcessStep";
import { Sparkles, Wand2, Palette, Share2, Heart, Briefcase, Baby, Calendar, Video, Globe, Zap, ArrowRight } from "lucide-react";
import homepageHero from "@assets/generated_images/Homepage_cinematic_wedding_hero_efb94fa0.png";
import engagementHero from "@assets/generated_images/Engagement_category_hero_image_e98e3800.png";
import luxuryHero from "@assets/generated_images/Premium_luxury_category_hero_5c811c21.png";
import indianPunjabiHero from "@assets/generated_images/Indian_Punjabi_wedding_culture_b8245c44.png";
import arabicHero from "@assets/generated_images/Arabic_UAE_wedding_culture_5fdde5ea.png";
import nigerianHero from "@assets/generated_images/Nigerian_traditional_wedding_culture_733beed6.png";

export default function Home() {
  const categories = [
    {
      id: "1",
      name: "Wedding Video Invitations",
      slug: "wedding-video-invitations",
      description: "Cinematic wedding invitations that capture your love story",
      heroImageUrl: homepageHero,
      templateCount: 150,
      icon: <Heart className="w-8 h-8" />,
    },
    {
      id: "2",
      name: "Premium Luxury",
      slug: "premium-luxury",
      description: "Sophisticated, high-end templates for elegant celebrations",
      heroImageUrl: luxuryHero,
      templateCount: 45,
      icon: <Sparkles className="w-8 h-8" />,
    },
    {
      id: "3",
      name: "Engagement Invites",
      slug: "engagement-invites",
      description: "Announce your engagement with romantic video invitations",
      heroImageUrl: engagementHero,
      templateCount: 80,
      icon: <Heart className="w-8 h-8" />,
    },
    {
      id: "4",
      name: "Baby Announcements",
      slug: "baby-announcements",
      description: "Adorable video announcements for your bundle of joy",
      heroImageUrl: homepageHero,
      templateCount: 60,
      icon: <Baby className="w-8 h-8" />,
    },
    {
      id: "5",
      name: "Birthday & Anniversary",
      slug: "birthday-anniversary",
      description: "Celebrate milestones with personalized video invites",
      heroImageUrl: engagementHero,
      templateCount: 70,
      icon: <Calendar className="w-8 h-8" />,
    },
    {
      id: "6",
      name: "Corporate Invites",
      slug: "corporate-invites",
      description: "Professional event invitations for business occasions",
      heroImageUrl: luxuryHero,
      templateCount: 40,
      icon: <Briefcase className="w-8 h-8" />,
    },
  ];

  const featuredTemplates = [
    {
      id: "1",
      title: "Cinematic Love Story",
      slug: "cinematic-love-story",
      category: "wedding",
      duration: 45,
      thumbnailUrl: homepageHero,
      isPremium: true,
    },
    {
      id: "2",
      title: "Golden Elegance",
      slug: "golden-elegance",
      category: "engagement",
      duration: 30,
      thumbnailUrl: luxuryHero,
      isPremium: false,
    },
    {
      id: "3",
      title: "Traditional Celebration",
      slug: "traditional-celebration",
      category: "wedding",
      duration: 60,
      thumbnailUrl: indianPunjabiHero,
      isPremium: true,
    },
    {
      id: "4",
      title: "Modern Romance",
      slug: "modern-romance",
      category: "engagement",
      duration: 40,
      thumbnailUrl: engagementHero,
      isPremium: false,
    },
  ];

  const cultures = [
    {
      id: "1",
      name: "Indian Weddings",
      localName: "भारतीय विवाह",
      slug: "indian-wedding-video-invitation",
      description: "Rich traditions and vibrant celebrations",
      heroImageUrl: indianPunjabiHero,
      templateCount: 120,
    },
    {
      id: "2",
      name: "Arabic Weddings",
      localName: "الزفاف العربي",
      slug: "arabic-wedding-video-uae-saudi",
      description: "Luxurious Middle Eastern wedding traditions",
      heroImageUrl: arabicHero,
      templateCount: 85,
    },
    {
      id: "3",
      name: "Nigerian Weddings",
      localName: "Ìgbéyàwó Nàìjíríà",
      slug: "nigerian-traditional-wedding-video",
      description: "Colorful African cultural celebrations",
      heroImageUrl: nigerianHero,
      templateCount: 70,
    },
  ];

  const testimonials = [
    {
      id: "1",
      name: "Priya & Raj Sharma",
      event: "Wedding",
      date: "Dec 2024",
      rating: 5,
      quote: "WeddingInvite.ai transformed our wedding invitations into a cinematic masterpiece. Our guests were absolutely blown away!",
      avatarUrl: undefined,
    },
    {
      id: "2",
      name: "Sarah & Michael Chen",
      event: "Engagement",
      date: "Nov 2024",
      rating: 5,
      quote: "The AI customization made it so easy to create professional-looking video invitations. Saved us thousands compared to hiring a videographer.",
    },
    {
      id: "3",
      name: "Fatima Al-Hassan",
      event: "Wedding",
      date: "Oct 2024",
      rating: 5,
      quote: "Perfect cultural accuracy for our traditional Arabic wedding. The templates captured our heritage beautifully.",
    },
  ];

  const whyChooseUs = [
    {
      icon: <Wand2 className="w-12 h-12" />,
      title: "AI-Powered Customization",
      description: "Intelligent editor automatically generates scripts, voiceovers, and themes tailored to your event.",
    },
    {
      icon: <Palette className="w-12 h-12" />,
      title: "Culturally Accurate",
      description: "Hundreds of templates designed for specific cultures and traditions around the world.",
    },
    {
      icon: <Video className="w-12 h-12" />,
      title: "4K Cinematic Quality",
      description: "Professional-grade video invitations in stunning 4K resolution for premium presentation.",
    },
    {
      icon: <Share2 className="w-12 h-12" />,
      title: "Instant Export",
      description: "Share directly to WhatsApp, Instagram Reels, TikTok, or download for any platform.",
    },
  ];

  return (
    <>
      <SEOHead
        title="Cinematic Video Invitations. Instantly. Culturally Accurate"
        description="Create AI-powered, fully customizable video invitations for weddings, engagements, and special events. 4K cinematic quality with cultural templates for global celebrations."
        keywords="wedding video invitation, AI video creator, digital invitation, cinematic invitation, cultural wedding templates"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "WeddingInvite.ai",
          "url": "https://weddinginvite.ai",
          "description": "Cinematic Video Invitations. Instantly. Culturally Accurate.",
        }}
      />

      <div className="relative min-h-screen flex items-center justify-center overflow-hidden" data-testid="section-hero">
        <div className="absolute inset-0 z-0">
          <img
            src={homepageHero}
            alt="Cinematic Wedding Video"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 text-center">
          <h1 className="font-playfair text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight" data-testid="text-hero-title">
            Cinematic Video Invitations.
            <br />
            <span className="text-accent">Instantly.</span>
          </h1>
          <p className="text-white/90 text-xl lg:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed font-light" data-testid="text-hero-subtitle">
            AI-powered video invitations for global weddings and events.
            <br className="hidden sm:block" />
            Culturally accurate. Instantly shareable.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Button
              variant="default"
              size="lg"
              className="min-w-[220px] text-lg font-semibold shadow-2xl hover:shadow-accent/50 transition-all h-14"
              asChild
              data-testid="button-create-invitation"
            >
              <Link href="/templates">
                <a className="flex items-center gap-2">
                  Create Invitation
                  <ArrowRight className="w-5 h-5" />
                </a>
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="min-w-[220px] text-lg font-semibold bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 h-14"
              asChild
              data-testid="button-explore-templates"
            >
              <Link href="/templates">
                <a>Explore Templates</a>
              </Link>
            </Button>
          </div>

          <p className="text-white/70 text-sm">4K Quality • 500+ Templates • 50+ Cultures</p>
        </div>
      </div>

      <section className="py-16 md:py-24 lg:py-32 bg-background" data-testid="section-why-choose-us">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Why Choose WeddingInvite.ai?
            </h2>
            <p className="text-muted-foreground text-lg lg:text-xl max-w-2xl mx-auto">
              Create professional video invitations in minutes with our AI-powered platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((feature, index) => (
              <div key={index} className="text-center" data-testid={`feature-${index}`}>
                <div className="inline-flex items-center justify-center w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-primary/10 text-primary mb-6 hover-elevate transition-all">
                  {feature.icon}
                </div>
                <h3 className="font-playfair text-xl lg:text-2xl font-bold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 lg:py-32 bg-card" data-testid="section-popular-categories">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Popular Categories
            </h2>
            <p className="text-muted-foreground text-lg lg:text-xl max-w-2xl mx-auto">
              Explore our curated collection of video invitation templates
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {categories.map((category) => (
              <CategoryCard key={category.id} {...category} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild data-testid="button-view-all-categories">
              <Link href="/templates">
                <a>View All Categories</a>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 lg:py-32 bg-background" data-testid="section-featured-templates">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Featured Templates
            </h2>
            <p className="text-muted-foreground text-lg lg:text-xl max-w-2xl mx-auto">
              Hand-picked cinematic templates for your special moments
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {featuredTemplates.map((template) => (
              <TemplateCard key={template.id} {...template} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="default" size="lg" asChild data-testid="button-browse-templates">
              <Link href="/templates">
                <a className="flex items-center gap-2">
                  Browse All Templates
                  <ArrowRight className="w-5 h-5" />
                </a>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 lg:py-32 bg-card" data-testid="section-global-cultures">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Celebrate Every Culture
            </h2>
            <p className="text-muted-foreground text-lg lg:text-xl max-w-2xl mx-auto">
              Authentic templates designed for weddings and celebrations worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {cultures.map((culture) => (
              <CultureCard key={culture.id} {...culture} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild data-testid="button-explore-cultures">
              <Link href="/culture">
                <a className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Explore All Cultures
                </a>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 lg:py-32 bg-background" data-testid="section-how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg lg:text-xl max-w-2xl mx-auto">
              Create stunning video invitations in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 relative">
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-border" />
            <ProcessStep
              number={1}
              title="Choose a Template"
              description="Browse our collection of 500+ cinematic templates across cultures and categories"
              icon={<Sparkles className="w-10 h-10 lg:w-12 lg:h-12" />}
            />
            <ProcessStep
              number={2}
              title="Customize with AI"
              description="Add your text, photos, music, and let AI generate voiceovers and perfect timing"
              icon={<Wand2 className="w-10 h-10 lg:w-12 lg:h-12" />}
            />
            <ProcessStep
              number={3}
              title="Export & Share"
              description="Download in 4K or share directly to WhatsApp, Instagram Reels, and TikTok"
              icon={<Zap className="w-10 h-10 lg:w-12 lg:h-12" />}
            />
          </div>

          <div className="text-center mt-12">
            <Button variant="default" size="lg" asChild data-testid="button-get-started">
              <Link href="/how-it-works">
                <a>Learn More</a>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 lg:py-32 bg-card" data-testid="section-testimonials">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Loved by Couples Worldwide
            </h2>
            <p className="text-muted-foreground text-lg lg:text-xl max-w-2xl mx-auto">
              See what our happy customers have to say
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 lg:py-32 overflow-hidden" data-testid="section-final-cta">
        <div className="absolute inset-0 z-0">
          <img
            src={homepageHero}
            alt="Create Your Invitation"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/80" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-playfair text-4xl lg:text-6xl font-bold text-white mb-6">
            Ready to Create Your Perfect Invitation?
          </h2>
          <p className="text-white/90 text-lg lg:text-xl mb-8 lg:mb-12 leading-relaxed">
            Join thousands of couples who've created stunning video invitations with WeddingInvite.ai
          </p>
          <Button
            variant="default"
            size="lg"
            className="min-w-[240px] text-lg font-semibold shadow-2xl h-14"
            asChild
            data-testid="button-start-creating"
          >
            <Link href="/templates">
              <a className="flex items-center gap-2">
                Start Creating Now
                <ArrowRight className="w-5 h-5" />
              </a>
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
