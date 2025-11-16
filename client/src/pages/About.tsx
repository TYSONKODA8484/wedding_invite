import { SEOHead } from "@/components/SEOHead";
import { Card } from "@/components/ui/card";
import { Heart, Globe, Sparkles, Users } from "lucide-react";
import homepageHero from "@assets/generated_images/Homepage_cinematic_wedding_hero_efb94fa0.png";

export default function About() {
  const values = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Celebrate Love",
      description: "We believe every love story deserves to be told beautifully, regardless of culture or budget.",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Cultural Respect",
      description: "Authentic representation of diverse wedding traditions with accuracy and sensitivity.",
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Innovation",
      description: "Combining AI technology with human creativity to make professional videos accessible to everyone.",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community",
      description: "Building a global community that celebrates diversity and connects people through shared joy.",
    },
  ];

  return (
    <>
      <SEOHead
        title="About Us - Our Mission & Story"
        description="Learn about WeddingInvite.ai's mission to make cinematic video invitations accessible to everyone while honoring diverse cultural traditions worldwide."
        keywords="about WeddingInvite.ai, our mission, our story, company values, wedding video platform"
      />

      <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden" data-testid="hero-about">
        <div className="absolute inset-0 z-0">
          <img
            src={homepageHero}
            alt="About Us"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 text-center">
          <h1 className="font-playfair text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            About WeddingInvite.ai
          </h1>
          <p className="text-white/90 text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
            Making cinematic video invitations accessible to everyone, everywhere
          </p>
        </div>
      </div>

      <section className="py-16 md:py-24 lg:py-32 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-foreground mb-6 text-center">
              Our Mission
            </h2>
            <p className="text-muted-foreground text-lg lg:text-xl leading-relaxed mb-6">
              At WeddingInvite.ai, we believe every celebration deserves to be shared beautifully. Our mission is to democratize professional video creation, making it accessible to couples and event planners worldwide—regardless of technical skills or budget.
            </p>
            <p className="text-muted-foreground text-lg lg:text-xl leading-relaxed">
              We're passionate about honoring cultural diversity. With templates designed for 50+ cultures and traditions, we ensure authenticity and respect in every video invitation we help create.
            </p>
          </div>

          <div className="mb-16">
            <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-foreground mb-6 text-center">
              Our Story
            </h2>
            <p className="text-muted-foreground text-lg lg:text-xl leading-relaxed mb-6">
              WeddingInvite.ai was born from a simple observation: couples spend thousands on professional videographers for their wedding videos, but often settle for static images or basic text for their invitations.
            </p>
            <p className="text-muted-foreground text-lg lg:text-xl leading-relaxed mb-6">
              Our founders, a multicultural team of engineers, designers, and wedding industry veterans, came together with a vision: combine AI technology with cultural expertise to create a platform that makes cinematic video invitations accessible to everyone.
            </p>
            <p className="text-muted-foreground text-lg lg:text-xl leading-relaxed">
              Today, we're proud to serve couples and event planners in over 100 countries, helping them share their special moments with stunning, culturally authentic video invitations.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Our Values
            </h2>
            <p className="text-muted-foreground text-lg lg:text-xl max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="p-8 text-center hover-elevate transition-all" data-testid={`value-${index}`}>
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
                  {value.icon}
                </div>
                <h3 className="font-playfair text-2xl font-bold text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground">
                  {value.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 lg:py-32 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Join Our Journey
          </h2>
          <p className="text-muted-foreground text-lg lg:text-xl mb-8">
            We're just getting started. Join thousands of couples and event planners who trust WeddingInvite.ai to create their perfect invitations.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="font-playfair text-5xl font-bold text-primary mb-2">100+</div>
              <p className="text-muted-foreground">Countries Served</p>
            </div>
            <div>
              <div className="font-playfair text-5xl font-bold text-primary mb-2">50+</div>
              <p className="text-muted-foreground">Cultural Templates</p>
            </div>
            <div>
              <div className="font-playfair text-5xl font-bold text-primary mb-2">100K+</div>
              <p className="text-muted-foreground">Videos Created</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
