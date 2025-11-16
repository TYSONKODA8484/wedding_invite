import { useRoute } from "wouter";
import { SEOHead } from "@/components/SEOHead";
import { HeroSection } from "@/components/HeroSection";
import { TemplateCard } from "@/components/TemplateCard";
import { Card } from "@/components/ui/card";
import indianPunjabiHero from "@assets/generated_images/Indian_Punjabi_wedding_culture_b8245c44.png";
import arabicHero from "@assets/generated_images/Arabic_UAE_wedding_culture_5fdde5ea.png";
import nigerianHero from "@assets/generated_images/Nigerian_traditional_wedding_culture_733beed6.png";
import homepageHero from "@assets/generated_images/Homepage_cinematic_wedding_hero_efb94fa0.png";
import luxuryHero from "@assets/generated_images/Premium_luxury_category_hero_5c811c21.png";

const countryData: Record<string, any> = {
  india: {
    name: "India",
    description: "Diverse wedding traditions across India featuring Punjabi, Tamil, Telugu, Bengali, Gujarati, and more regional styles with vibrant colors and rich cultural heritage.",
    popularStyles: ["Traditional Indian", "Punjabi Bhangra", "South Indian Temple", "Rajasthani Royal", "Bollywood Glam"],
    heroImage: indianPunjabiHero,
    templateCount: 150,
  },
  usa: {
    name: "United States",
    description: "American wedding styles from classic church ceremonies to modern destination weddings, rustic barn celebrations, and multicultural fusion events.",
    popularStyles: ["Classic American", "Rustic Barn", "Beach Wedding", "Garden Party", "Modern Minimalist"],
    heroImage: homepageHero,
    templateCount: 95,
  },
  uae: {
    name: "United Arab Emirates",
    description: "Luxurious Emirati and Arabic wedding celebrations featuring opulent venues, gold decor, and traditional Middle Eastern elegance.",
    popularStyles: ["Luxury Arabic", "Modern Emirati", "Traditional Khaleeji", "Gold & Crystal", "Desert Romance"],
    heroImage: arabicHero,
    templateCount: 68,
  },
  uk: {
    name: "United Kingdom",
    description: "British wedding traditions featuring classic church ceremonies, elegant manor house celebrations, and countryside garden parties.",
    popularStyles: ["Classic British", "Country Garden", "Manor House", "Modern London", "Scottish Highlands"],
    heroImage: luxuryHero,
    templateCount: 72,
  },
  nigeria: {
    name: "Nigeria",
    description: "Vibrant Nigerian wedding traditions with colorful Ankara fabrics, traditional dances, and diverse cultural ceremonies across ethnic groups.",
    popularStyles: ["Traditional Nigerian", "Yoruba Wedding", "Igbo Ceremony", "Modern Fusion", "Afrobeat Celebration"],
    heroImage: nigerianHero,
    templateCount: 58,
  },
  mexico: {
    name: "Mexico",
    description: "Festive Mexican wedding celebrations with mariachi music, vibrant colors, and beautiful Catholic and cultural traditions.",
    popularStyles: ["Traditional Mexican", "Hacienda Style", "Beach Riviera", "Folkloric Theme", "Modern Mexico City"],
    heroImage: homepageHero,
    templateCount: 52,
  },
  canada: {
    name: "Canada",
    description: "Multicultural Canadian wedding styles blending diverse traditions with stunning natural backdrops from mountains to lakeshores.",
    popularStyles: ["Canadian Rustic", "Mountain Lodge", "Lakeside Elegance", "Urban Toronto", "French Canadian"],
    heroImage: luxuryHero,
    templateCount: 64,
  },
  china: {
    name: "China",
    description: "Traditional Chinese wedding customs featuring tea ceremonies, red and gold colors, and ancient cultural rituals.",
    popularStyles: ["Traditional Chinese", "Modern Shanghai", "Tea Ceremony", "Imperial Palace", "Contemporary Fusion"],
    heroImage: homepageHero,
    templateCount: 46,
  },
};

export default function CountryPage() {
  const [, params] = useRoute("/countries/:slug");
  const slug = params?.slug || "india";
  const country = countryData[slug] || countryData.india;

  const templates = [
    { id: "1", title: "Traditional Celebration", slug: "traditional-celebration", category: "wedding", duration: 60, thumbnailUrl: country.heroImage, isPremium: true },
    { id: "2", title: "Modern Style", slug: "modern-style", category: "wedding", duration: 45, thumbnailUrl: country.heroImage, isPremium: false },
    { id: "3", title: "Classic Elegance", slug: "classic-elegance", category: "wedding", duration: 50, thumbnailUrl: country.heroImage, isPremium: true },
    { id: "4", title: "Contemporary Fusion", slug: "contemporary-fusion", category: "wedding", duration: 48, thumbnailUrl: country.heroImage, isPremium: false },
  ];

  return (
    <>
      <SEOHead
        title={`${country.name} Wedding Video Invitations`}
        description={`${country.description} Browse ${country.templateCount}+ video invitation templates designed for ${country.name} weddings.`}
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
            <p className="text-muted-foreground text-center text-lg">{country.templateCount} templates available</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {templates.map((template) => (
              <TemplateCard key={template.id} {...template} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
