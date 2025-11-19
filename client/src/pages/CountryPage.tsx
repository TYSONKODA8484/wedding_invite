import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { SEOHead } from "@/components/SEOHead";
import { HeroSection } from "@/components/HeroSection";
import { TemplateCard } from "@/components/TemplateCard";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import type { Template } from "@shared/schema";
import indianPunjabiHero from "@assets/generated_images/Indian_Punjabi_wedding_culture_b8245c44.png";
import arabicHero from "@assets/generated_images/Arabic_UAE_wedding_culture_5fdde5ea.png";
import saudiHero from "@assets/stock_images/saudi_arabian_weddin_519f891c.jpg";

const countryData: Record<string, any> = {
  india: {
    name: "India",
    slug: "india",
    description: "Diverse wedding traditions across India featuring Punjabi, Tamil, Telugu, Bengali, Gujarati, and more regional styles with vibrant colors and rich cultural heritage.",
    popularStyles: ["Traditional Indian", "Punjabi Bhangra", "South Indian Temple", "Rajasthani Royal", "Bollywood Glam"],
    heroImage: indianPunjabiHero,
  },
  uae: {
    name: "United Arab Emirates",
    slug: "uae",
    description: "Luxurious Emirati and Arabic wedding celebrations featuring opulent venues, gold decor, and traditional Middle Eastern elegance.",
    popularStyles: ["Luxury Arabic", "Modern Emirati", "Traditional Khaleeji", "Gold & Crystal", "Desert Romance"],
    heroImage: arabicHero,
  },
  "saudi-arabia": {
    name: "Saudi Arabia",
    slug: "saudi-arabia",
    description: "Opulent Saudi Arabian wedding celebrations with royal gold details, traditional Islamic patterns, and majestic cultural heritage.",
    popularStyles: ["Saudi Royal", "Traditional Islamic", "Luxury Gold", "Cultural Heritage", "Modern Saudi"],
    heroImage: saudiHero,
  },
};

export default function CountryPage() {
  const [, params] = useRoute("/countries/:slug");
  const slug = params?.slug || "india";
  const country = countryData[slug] || countryData.india;

  // Fetch templates from the database by country
  const { data: templates = [], isLoading } = useQuery<Template[]>({
    queryKey: ["/api/templates", { country: country.slug }],
    queryFn: async () => {
      const response = await fetch(`/api/templates?country=${country.slug}`);
      if (!response.ok) throw new Error("Failed to fetch templates");
      return response.json();
    },
  });

  return (
    <>
      <SEOHead
        title={`${country.name} Wedding Video Invitations`}
        description={`${country.description} Browse our collection of video invitation templates designed for ${country.name} weddings.`}
        keywords={`${country.name} wedding video, ${slug} wedding invitation, ${country.name} celebration videos`}
      />

      <HeroSection
        title={`${country.name} Wedding Videos`}
        description={country.description}
        backgroundImage={country.heroImage}
        height="large"
        primaryCTA={{
          text: "Browse Templates",
          href: "#templates",
        }}
      />

      <section className="py-12 lg:py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 lg:p-12 mb-16">
            <h2 className="font-playfair text-3xl lg:text-4xl font-bold text-foreground mb-8 text-center">
              Popular {country.name} Wedding Styles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {country.popularStyles.map((style: string, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 rounded-md bg-accent/5 hover-elevate transition-all"
                  data-testid={`style-${index}`}
                >
                  <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-foreground font-medium">{style}</span>
                </div>
              ))}
            </div>
          </Card>

          <div className="mb-8" id="templates">
            <h3 className="font-playfair text-3xl lg:text-4xl font-bold text-foreground mb-2 text-center">
              {country.name} Templates
            </h3>
            <p className="text-muted-foreground text-center text-lg">
              {isLoading ? "Loading..." : `${templates.length} template${templates.length !== 1 ? 's' : ''} available`}
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
          ) : templates.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground text-lg">
                No templates available for {country.name} yet. Check back soon!
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {templates.map((template) => (
                <TemplateCard key={template.id} {...template} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
