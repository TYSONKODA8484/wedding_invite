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
    seoTitle: "Indian Wedding Invitation Video | WhatsApp Wedding Invites India",
    seoDescription: "Create stunning Indian wedding video invitations for WhatsApp. 100+ templates for Punjabi, South Indian, Hindi, Marathi weddings. Mehendi, Sangeet, Haldi invites. ₹1,200-₹2,900.",
    keywords: "indian wedding invitation video, whatsapp wedding video india, hindi wedding invitation, punjabi wedding video, south indian wedding invitation, marathi wedding video, mehendi invitation video, sangeet video invitation, haldi ceremony video, bengali wedding invitation, gujarati wedding video, indian wedding video maker",
    locale: "en_IN",
    ceremonies: ["Mehendi", "Sangeet", "Haldi", "Wedding", "Reception"],
  },
  uae: {
    name: "United Arab Emirates",
    slug: "uae",
    description: "Luxurious Emirati and Arabic wedding celebrations featuring opulent venues, gold decor, and traditional Middle Eastern elegance.",
    popularStyles: ["Luxury Arabic", "Modern Emirati", "Traditional Khaleeji", "Gold & Crystal", "Desert Romance"],
    heroImage: arabicHero,
    seoTitle: "UAE Arabic Wedding Invitation Video | دعوة زفاف فيديو الإمارات",
    seoDescription: "Create luxury Arabic wedding videos for UAE. Dubai, Abu Dhabi, Sharjah weddings. 4K Emirati & Islamic invitation templates. دعوة زفاف عربية فاخرة",
    keywords: "arabic wedding invitation video, uae wedding video, dubai wedding invitation, abu dhabi wedding video, emirati wedding invitation, islamic wedding video, khaleeji wedding, دعوة زفاف عربية, فيديو دعوة زفاف إماراتي, luxury arabic wedding, zaffa video invitation",
    locale: "ar_AE",
    ceremonies: ["Kateb Katb", "Henna Night", "Wedding Ceremony", "Walima Reception"],
    arabicTitle: "دعوة زفاف فيديو الإمارات",
    arabicDescription: "إنشاء دعوات زفاف فيديو عربية فاخرة. قوالب إماراتية وإسلامية راقية لحفلات الزفاف في دبي وأبو ظبي",
  },
  "saudi-arabia": {
    name: "Saudi Arabia",
    slug: "saudi-arabia",
    description: "Opulent Saudi Arabian wedding celebrations with royal gold details, traditional Islamic patterns, and majestic cultural heritage.",
    popularStyles: ["Saudi Royal", "Traditional Islamic", "Luxury Gold", "Cultural Heritage", "Modern Saudi"],
    heroImage: saudiHero,
    seoTitle: "Saudi Wedding Invitation Video Riyadh Jeddah | كروت زفاف السعودية",
    seoDescription: "Create Saudi Arabian wedding video invitations. Riyadh, Jeddah, Mecca templates. Islamic & royal designs. كروت زفاف سعودية فاخرة",
    keywords: "saudi wedding invitation video, riyadh wedding video, jeddah wedding invitation, mecca wedding video, saudi arabian wedding, islamic wedding invitation video, كروت زفاف الرياض, دعوات زفاف جدة, فيديو زفاف سعودي, saudi royal wedding",
    locale: "ar_SA",
    ceremonies: ["Nikah", "Walima", "Reception"],
    arabicTitle: "كروت زفاف فيديو السعودية",
    arabicDescription: "إنشاء دعوات زفاف فيديو سعودية ملكية. قوالب إسلامية فاخرة للأفراح في الرياض وجدة ومكة",
  },
};

interface TemplateResponse {
  templates: Template[];
  pagination: { total: number; offset: number; limit: number; hasMore: boolean };
}

export default function CountryPage() {
  const [, params] = useRoute("/countries/:slug");
  const slug = params?.slug || "india";
  const country = countryData[slug] || countryData.india;

  // Fetch templates from the database by country
  const { data, isLoading } = useQuery<TemplateResponse>({
    queryKey: ["/api/templates", { region: country.slug }],
    queryFn: async () => {
      const response = await fetch(`/api/templates?region=${country.slug}`);
      if (!response.ok) throw new Error("Failed to fetch templates");
      return response.json();
    },
  });
  
  const templates = data?.templates || [];

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${country.name} Wedding Video Invitations`,
    description: country.seoDescription,
    url: `https://weddinginvite.ai/countries/${country.slug}`,
    about: {
      "@type": "Thing",
      name: `${country.name} Weddings`,
      description: country.description
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://weddinginvite.ai"
      },
      {
        "@type": "ListItem",
        position: 2,
        name: `${country.name} Weddings`,
        item: `https://weddinginvite.ai/countries/${country.slug}`
      }
    ]
  };

  const alternateLang = country.slug === "uae" || country.slug === "saudi-arabia" 
    ? [
        { lang: "en", url: `https://weddinginvite.ai/countries/${country.slug}` },
        { lang: "ar", url: `https://weddinginvite.ai/ar/countries/${country.slug}` }
      ]
    : undefined;

  return (
    <>
      <SEOHead
        title={country.seoTitle}
        description={country.seoDescription}
        keywords={country.keywords}
        schema={[collectionSchema, breadcrumbSchema]}
        locale={country.locale}
        ogImage={country.heroImage}
        alternateLang={alternateLang}
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
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-5">
              {templates.map((template) => (
                <TemplateCard
                  key={template.id}
                  id={template.id}
                  title={template.templateName}
                  slug={template.slug}
                  category={template.category}
                  duration={template.durationSec}
                  thumbnailUrl={template.thumbnailUrl}
                  demoVideoUrl={template.previewVideoUrl}
                  templateType={template.templateType as "video" | "card"}
                  isPremium={Number(template.price) > 150000}
                  pageCount={(template.templateJson as any)?.pages?.length || 1}
                  price={Number(template.price)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
