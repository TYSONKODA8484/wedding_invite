import { SEOHead } from "@/components/SEOHead";
import { ProcessStep } from "@/components/ProcessStep";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FAQSection, howItWorksFAQs } from "@/components/FAQSection";
import { Sparkles, Wand2, Zap, Image as ImageIcon, Music, Type, Download, Share2 } from "lucide-react";
import { Link } from "wouter";
import homepageHero from "@assets/generated_images/Homepage_cinematic_wedding_hero_efb94fa0.png";

export default function HowItWorks() {
  const detailedSteps = [
    {
      title: "Browse Templates",
      description: "Explore 500+ professionally designed templates across cultures and event types",
      icon: <Sparkles className="w-8 h-8" />,
      features: ["Wedding ceremonies", "Engagement announcements", "Baby celebrations", "Corporate events", "Cultural traditions"],
    },
    {
      title: "AI-Powered Customization",
      description: "Our intelligent editor makes personalization effortless",
      icon: <Wand2 className="w-8 h-8" />,
      features: ["Add your event details", "Upload personal photos", "Choose or upload music", "Select AI voiceover language", "Adjust colors and themes"],
    },
    {
      title: "Export & Share",
      description: "Download in 4K or share directly to your favorite platforms",
      icon: <Zap className="w-8 h-8" />,
      features: ["4K Ultra HD quality", "WhatsApp optimized", "Instagram Reels ready", "TikTok format", "Universal MP4 download"],
    },
  ];

  const features = [
    { icon: <Type className="w-6 h-6" />, title: "Custom Text", description: "Names, dates, venues, messages" },
    { icon: <ImageIcon className="w-6 h-6" />, title: "Photo Upload", description: "Your favorite moments" },
    { icon: <Music className="w-6 h-6" />, title: "Music Library", description: "Or upload your own" },
    { icon: <Wand2 className="w-6 h-6" />, title: "AI Voiceover", description: "20+ languages & accents" },
    { icon: <Download className="w-6 h-6" />, title: "4K Export", description: "Cinema-quality output" },
    { icon: <Share2 className="w-6 h-6" />, title: "Instant Sharing", description: "All platforms supported" },
  ];

  return (
    <>
      <SEOHead
        title="How It Works - Create Video Invitations in 3 Steps"
        description="Learn how to create stunning video invitations in minutes. Choose a template, customize with AI, and share instantly to WhatsApp, Instagram, and more."
        keywords="how to create video invitation, video invitation tutorial, AI video editor, wedding invitation maker"
      />

      <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden" data-testid="hero-how-it-works">
        <div className="absolute inset-0 z-0">
          <img
            src={homepageHero}
            alt="How It Works"
            className="w-full h-full object-cover"
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 text-center">
          <h1 className="font-playfair text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            How It Works
          </h1>
          <p className="text-white/90 text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
            Create professional video invitations in three simple steps. No design or video editing experience required.
          </p>
        </div>
      </div>

      <section className="py-16 md:py-24 lg:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 relative mb-16">
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-border" />
            <ProcessStep
              number={1}
              title="Choose a Template"
              description="Browse our collection of 500+ cinematic templates across cultures and categories. Filter by event type, culture, or style to find your perfect match."
              icon={<Sparkles className="w-10 h-10 lg:w-12 lg:h-12" />}
            />
            <ProcessStep
              number={2}
              title="Customize with AI"
              description="Add your details, photos, and music. Our AI automatically generates voiceovers, perfect timing, and smooth transitions - all in minutes."
              icon={<Wand2 className="w-10 h-10 lg:w-12 lg:h-12" />}
            />
            <ProcessStep
              number={3}
              title="Export & Share"
              description="Download in stunning 4K quality or share directly to WhatsApp, Instagram Reels, TikTok, and more. Your guests will be amazed!"
              icon={<Zap className="w-10 h-10 lg:w-12 lg:h-12" />}
            />
          </div>

          {detailedSteps.map((step, index) => (
            <Card key={index} className="p-8 lg:p-12 mb-8 hover-elevate transition-all">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    {step.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-playfair text-2xl lg:text-3xl font-bold text-foreground mb-3">
                    Step {index + 1}: {step.title}
                  </h3>
                  <p className="text-muted-foreground text-lg mb-4">
                    {step.description}
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {step.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-16 md:py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Powerful Features at Your Fingertips
            </h2>
            <p className="text-muted-foreground text-lg lg:text-xl max-w-2xl mx-auto">
              Everything you need to create professional video invitations
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center" data-testid={`feature-${index}`}>
                <div className="inline-flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-primary/10 text-primary mb-4 hover-elevate transition-all">
                  {feature.icon}
                </div>
                <h3 className="font-playfair text-xl lg:text-2xl font-bold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="default" size="lg" asChild data-testid="button-start-now">
              <Link href="/templates">
                <a className="font-semibold">Start Creating Now</a>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <FAQSection 
        faqs={howItWorksFAQs}
        title="Common Questions"
        subtitle="Get answers to frequently asked questions about creating video invitations"
      />
    </>
  );
}
