import { SEOHead } from "@/components/SEOHead";
import { TestimonialCard } from "@/components/TestimonialCard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import homepageHero from "@assets/generated_images/Homepage_cinematic_wedding_hero_efb94fa0.png";
import indianPunjabiHero from "@assets/generated_images/Indian_Punjabi_wedding_culture_b8245c44.png";
import arabicHero from "@assets/generated_images/Arabic_UAE_wedding_culture_5fdde5ea.png";
import nigerianHero from "@assets/generated_images/Nigerian_traditional_wedding_culture_733beed6.png";
import engagementHero from "@assets/generated_images/Engagement_category_hero_image_e98e3800.png";
import luxuryHero from "@assets/generated_images/Premium_luxury_category_hero_5c811c21.png";

export default function Examples() {
  const examples = [
    {
      id: "1",
      title: "Sarah & Michael's Wedding",
      category: "Classic American Wedding",
      videoUrl: homepageHero,
      description: "Elegant church ceremony with romantic garden reception",
    },
    {
      id: "2",
      title: "Priya & Raj's Punjabi Wedding",
      category: "Indian Punjabi Wedding",
      videoUrl: indianPunjabiHero,
      description: "Vibrant celebration with traditional Bhangra and colorful ceremonies",
    },
    {
      id: "3",
      title: "Fatima & Ahmed's Nikah",
      category: "Arabic Wedding",
      videoUrl: arabicHero,
      description: "Luxurious UAE wedding with gold decor and elegant traditions",
    },
    {
      id: "4",
      title: "Chioma & Emeka's Traditional Wedding",
      category: "Nigerian Wedding",
      videoUrl: nigerianHero,
      description: "Colorful Nigerian celebration with Ankara fabrics and traditional dances",
    },
    {
      id: "5",
      title: "Emma & James' Engagement",
      category: "Engagement Announcement",
      videoUrl: engagementHero,
      description: "Romantic sunset proposal announcement with personal photos",
    },
    {
      id: "6",
      title: "Sofia's Quinceañera",
      category: "Quinceañera",
      videoUrl: luxuryHero,
      description: "Beautiful 15th birthday celebration with pink and gold theme",
    },
  ];

  const testimonials = [
    {
      id: "1",
      name: "Priya & Raj Sharma",
      event: "Wedding",
      date: "Dec 2024",
      rating: 5,
      quote: "WeddingInvite.ai transformed our wedding invitations into a cinematic masterpiece. Our guests were absolutely blown away by the quality and cultural authenticity!",
    },
    {
      id: "2",
      name: "Sarah & Michael Chen",
      event: "Engagement",
      date: "Nov 2024",
      rating: 5,
      quote: "The AI customization made it so easy to create professional-looking video invitations. Saved us thousands compared to hiring a videographer. Worth every penny!",
    },
    {
      id: "3",
      name: "Fatima Al-Hassan",
      event: "Wedding",
      date: "Oct 2024",
      rating: 5,
      quote: "Perfect cultural accuracy for our traditional Arabic wedding. The templates captured our heritage beautifully and the 4K quality was stunning.",
    },
  ];

  return (
    <>
      <SEOHead
        title="Customer Examples - Real Video Invitations"
        description="See real customer video invitation examples created with WeddingInvite.ai. Browse wedding, engagement, and event videos from happy customers worldwide."
        keywords="video invitation examples, customer videos, wedding invitation samples, real examples"
      />

      <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden" data-testid="hero-examples">
        <div className="absolute inset-0 z-0">
          <img
            src={homepageHero}
            alt="Customer Examples"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 text-center">
          <h1 className="font-playfair text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Customer Examples
          </h1>
          <p className="text-white/90 text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
            See real video invitations created by couples and event planners using WeddingInvite.ai
          </p>
        </div>
      </div>

      <section className="py-16 md:py-24 lg:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Real Videos from Real Events
            </h2>
            <p className="text-muted-foreground text-lg lg:text-xl max-w-2xl mx-auto">
              Browse video invitations created by our happy customers across different cultures and celebrations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
            {examples.map((example) => (
              <Card key={example.id} className="group overflow-hidden hover-elevate active-elevate-2 transition-all duration-300" data-testid={`example-${example.id}`}>
                <div className="relative aspect-[9/16] overflow-hidden bg-muted">
                  <img
                    src={example.videoUrl}
                    alt={example.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      size="lg"
                      className="w-16 h-16 rounded-full bg-primary/90 backdrop-blur-sm"
                      data-testid={`button-play-${example.id}`}
                    >
                      <Play className="w-8 h-8 text-primary-foreground fill-current ml-1" />
                    </Button>
                  </div>
                  <Badge className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white border-none">
                    {example.category}
                  </Badge>
                </div>
                <div className="p-6">
                  <h3 className="font-playfair text-lg lg:text-xl font-bold text-foreground mb-2">
                    {example.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {example.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mb-16">
            <h3 className="font-playfair text-3xl lg:text-4xl font-bold text-foreground mb-8">
              What Our Customers Say
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} {...testimonial} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
