import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { SEOHead } from "@/components/SEOHead";
import { HeroSection } from "@/components/HeroSection";
import { TemplateCard } from "@/components/TemplateCard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, SlidersHorizontal, X, Sparkles } from "lucide-react";
import type { Template } from "@shared/schema";
import indianPunjabiHero from "@assets/generated_images/Indian_Punjabi_wedding_culture_b8245c44.png";
import tamilHero from "@assets/generated_images/Tamil_wedding_culture_page_3a868c20.png";
import arabicHero from "@assets/generated_images/Arabic_UAE_wedding_culture_5fdde5ea.png";
import nigerianHero from "@assets/generated_images/Nigerian_traditional_wedding_culture_733beed6.png";
import quinceaneraHero from "@assets/generated_images/Quinceañera_culture_page_hero_f3e1cb71.png";
import koreanHero from "@assets/generated_images/korean_hanbok_wedding_ceremony.png";
import chineseHero from "@assets/generated_images/chinese_tea_ceremony_wedding.png";

interface CultureInfo {
  name: string;
  localName: string;
  description: string;
  traditions: string[];
  symbols: string[];
  heroImage: string;
  templateCount: number;
  region?: string;  // Maps to database region for fetching templates
  regions?: string[]; // Multiple regions for Arabic (uae, saudi)
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string;
}

const cultureData: Record<string, CultureInfo> = {
  "indian-wedding-video-invitation": {
    name: "Indian Wedding Video Invitations",
    localName: "भारतीय विवाह निमंत्रण",
    description: "Create authentic Indian wedding video invitations celebrating rich traditions, vibrant colors, and cultural heritage with cinematic quality.",
    traditions: ["Mehendi Ceremony", "Sangeet Night", "Baraat Procession", "Pheras & Rituals", "Reception Celebration"],
    symbols: ["Kalash & Coconut", "Marigold Flowers", "Sacred Fire", "Rangoli Designs", "Traditional Attire"],
    heroImage: indianPunjabiHero,
    templateCount: 120,
    region: "india",
    seoTitle: "Indian Wedding Video Invitation | WhatsApp Shaadi Invites",
    seoDescription: "Create beautiful Indian wedding video invitations for WhatsApp. 100+ templates for Hindu, Punjabi, South Indian, Bengali weddings. Mehendi, Sangeet, Haldi ceremony invites.",
    keywords: "indian wedding invitation video, shaadi video invitation, hindu wedding video, whatsapp wedding invitation india, mehendi invitation, sangeet video",
  },
  "punjabi": {
    name: "Punjabi Wedding Videos",
    localName: "ਪੰਜਾਬੀ ਵਿਆਹ",
    description: "Vibrant Punjabi wedding video invitations featuring Bhangra, colorful turbans, and joyful celebrations of love and family.",
    traditions: ["Roka Ceremony", "Chunni Ceremony", "Jaggo & Sangeet", "Anand Karaj", "Doli & Vidai"],
    symbols: ["Red & Gold Colors", "Phulkari Patterns", "Dhol Drums", "Sehra for Groom", "Chooda for Bride"],
    heroImage: indianPunjabiHero,
    templateCount: 45,
    region: "india",
    seoTitle: "Punjabi Wedding Video Invitation | Bhangra Style Invites",
    seoDescription: "Create vibrant Punjabi wedding video invitations with Bhangra beats and colorful traditions. Perfect for Anand Karaj and Sikh weddings.",
    keywords: "punjabi wedding invitation, sikh wedding video, anand karaj invitation, bhangra wedding video, punjabi shaadi invite",
  },
  "tamil": {
    name: "Tamil Wedding Videos",
    localName: "தமிழ் திருமண வீடியோ",
    description: "Traditional Tamil wedding video invitations honoring Dravidian heritage with temple aesthetics and sacred rituals.",
    traditions: ["Sumangali Prarthanai", "Kashi Yatra", "Oonjal Ceremony", "Saptapadi", "Grihapravesh"],
    symbols: ["Silk Sarees", "Jasmine Garlands", "Temple Architecture", "Thali Mangalsutra", "Banana Leaves"],
    heroImage: tamilHero,
    templateCount: 38,
    region: "india",
    seoTitle: "Tamil Wedding Video Invitation | South Indian Invites",
    seoDescription: "Create traditional Tamil wedding video invitations with temple aesthetics and authentic South Indian customs. Perfect for Brahmin and Hindu weddings.",
    keywords: "tamil wedding invitation, south indian wedding video, brahmin wedding invite, chennai wedding video, tamil kalyanam invitation",
  },
  "telugu": {
    name: "Telugu Wedding Videos",
    localName: "తెలుగు పెళ్ళి వీడియో",
    description: "Elegant Telugu wedding video invitations showcasing Andhra Pradesh and Telangana wedding customs.",
    traditions: ["Pellikuthuru", "Snatakam", "Kashi Yatra", "Madhuparkam", "Jeelakarra Bellam"],
    symbols: ["Gold Jewelry", "Kanchipuram Silk", "Turmeric Paste", "Mango Leaves", "Traditional Kolam"],
    heroImage: tamilHero,
    templateCount: 32,
    region: "india",
    seoTitle: "Telugu Wedding Video Invitation | Andhra & Telangana Invites",
    seoDescription: "Create elegant Telugu wedding video invitations for Andhra Pradesh and Telangana weddings. Traditional Pellikuthuru and ceremony invites.",
    keywords: "telugu wedding invitation, andhra wedding video, telangana wedding invite, hyderabad wedding video, telugu pelli invitation",
  },
  "gujarati": {
    name: "Gujarati Wedding Videos",
    localName: "ગુજરાતી લગ્ન વીડિયો",
    description: "Colorful Gujarati wedding video invitations featuring Garba, traditional rituals, and joyful celebrations.",
    traditions: ["Griha Shanti", "Mandap Mahurat", "Jaan", "Varmala", "Saptapadi"],
    symbols: ["Bandhani Prints", "Mirror Work", "Dandiya Sticks", "Swastik Symbol", "Coconut & Dates"],
    heroImage: indianPunjabiHero,
    templateCount: 28,
    region: "india",
    seoTitle: "Gujarati Wedding Video Invitation | Garba Night Invites",
    seoDescription: "Create colorful Gujarati wedding video invitations with Garba and Dandiya themes. Perfect for traditional Gujarat weddings.",
    keywords: "gujarati wedding invitation, garba wedding video, dandiya night invite, ahmedabad wedding video, gujarati lagna invitation",
  },
  "bengali": {
    name: "Bengali Wedding Videos",
    localName: "বাংলা বিয়ে ভিডিও",
    description: "Artistic Bengali wedding video invitations honoring Tagore's land with poetry, music, and rituals.",
    traditions: ["Aashirbad", "Dodhi Mangal", "Bor Jatri", "Subho Drishti", "Saptapadi"],
    symbols: ["Red & White Saree", "Shankha Pola Bangles", "Alpana Designs", "Topor Crown", "Betel Leaves"],
    heroImage: tamilHero,
    templateCount: 26,
    region: "india",
    seoTitle: "Bengali Wedding Video Invitation | Biye Invites",
    seoDescription: "Create artistic Bengali wedding video invitations with traditional Alpana designs and authentic customs. Perfect for Kolkata weddings.",
    keywords: "bengali wedding invitation, kolkata wedding video, biye invitation, bengali shaadi video, subho drishti invitation",
  },
  "muslim-nikah": {
    name: "Muslim Nikah Videos",
    localName: "نکاح کی ویڈیو",
    description: "Elegant Muslim nikah video invitations respecting Islamic traditions with modest and beautiful designs.",
    traditions: ["Mangni", "Mehendi", "Nikah Ceremony", "Rukhsati", "Walima Reception"],
    symbols: ["Crescent & Star", "Arabic Calligraphy", "Henna Designs", "Green & Gold", "Floral Patterns"],
    heroImage: arabicHero,
    templateCount: 42,
    region: "india",
    seoTitle: "Muslim Nikah Video Invitation | Islamic Wedding Invites",
    seoDescription: "Create elegant Muslim Nikah video invitations with Islamic patterns and traditional designs. Perfect for Walima and Mehendi ceremonies.",
    keywords: "nikah invitation video, muslim wedding video, islamic wedding invitation, walima invitation, mehendi ceremony video",
  },
  "christian": {
    name: "Christian Wedding Videos",
    localName: "క్రైస్తవ వివాహ వీడియో",
    description: "Sacred Christian wedding video invitations for church ceremonies and holy matrimony celebrations.",
    traditions: ["Church Ceremony", "Exchange of Vows", "Ring Exchange", "Unity Candle", "First Dance"],
    symbols: ["Cross & Bible", "White Dove", "Wedding Bells", "Church Architecture", "White & Ivory"],
    heroImage: indianPunjabiHero,
    templateCount: 35,
    region: "india",
    seoTitle: "Christian Wedding Video Invitation | Church Wedding Invites",
    seoDescription: "Create sacred Christian wedding video invitations for church ceremonies. Beautiful designs for holy matrimony celebrations.",
    keywords: "christian wedding invitation, church wedding video, holy matrimony invitation, christian marriage video",
  },
  "arabic-wedding-video-uae-saudi": {
    name: "Arabic Wedding Videos - UAE & Saudi",
    localName: "فيديو الزفاف العربي",
    description: "Luxurious Arabic wedding video invitations for UAE and Saudi celebrations with opulent designs and traditional elegance.",
    traditions: ["Henna Night", "Zaffa Procession", "Katb Al-Kitab", "Wedding Party", "Honeymoon Send-off"],
    symbols: ["Gold Decor", "Arabic Calligraphy", "Oud Perfume", "Luxurious Fabrics", "Intricate Patterns"],
    heroImage: arabicHero,
    templateCount: 55,
    regions: ["uae", "saudi"],
    seoTitle: "Arabic Wedding Video Invitation | UAE & Saudi Wedding Invites",
    seoDescription: "Create luxury Arabic wedding videos for UAE and Saudi Arabia. Dubai, Abu Dhabi, Riyadh templates with traditional Islamic designs.",
    keywords: "arabic wedding invitation video, uae wedding video, saudi wedding invitation, dubai wedding video, دعوة زفاف عربية",
  },
  "nigerian-traditional-wedding-video": {
    name: "Nigerian Traditional Wedding Videos",
    localName: "Ìgbéyàwó Nàìjíríà",
    description: "Vibrant Nigerian wedding video invitations celebrating African heritage with colorful traditional attire and customs.",
    traditions: ["Introduction Ceremony", "Wine Carrying", "Bride Price", "Traditional Dance", "Cultural Blessings"],
    symbols: ["Ankara Fabric", "Gele Headwrap", "Coral Beads", "Aso Ebi", "Traditional Drums"],
    heroImage: nigerianHero,
    templateCount: 48,
    seoTitle: "Nigerian Traditional Wedding Video Invitation | African Wedding Invites",
    seoDescription: "Create vibrant Nigerian traditional wedding video invitations with authentic African heritage designs. Aso Ebi and cultural customs.",
    keywords: "nigerian wedding invitation, african wedding video, traditional nigerian wedding, aso ebi invitation, yoruba wedding video",
  },
  "quinceanera-video-invitation": {
    name: "Quinceañera Video Invitations",
    localName: "Invitación de Quinceañera",
    description: "Beautiful quinceañera video invitations celebrating a young woman's 15th birthday with Latin American traditions.",
    traditions: ["Mass Ceremony", "Changing of Shoes", "Last Doll", "Father-Daughter Dance", "Waltz"],
    symbols: ["Tiara & Crown", "Pink & Gold", "Roses", "Butterfly Theme", "Ball Gown"],
    heroImage: quinceaneraHero,
    templateCount: 40,
    seoTitle: "Quinceañera Video Invitation | 15th Birthday Invites",
    seoDescription: "Create beautiful quinceañera video invitations for 15th birthday celebrations. Traditional Latin American designs with tiara and rose themes.",
    keywords: "quinceanera invitation video, 15 birthday invitation, quince años video, mis quince invitation, latin birthday video",
  },
  "chinese-tea-ceremony-video": {
    name: "Chinese Tea Ceremony Videos",
    localName: "中国茶道婚礼视频",
    description: "Traditional Chinese wedding video invitations honoring tea ceremony customs and ancient Chinese traditions.",
    traditions: ["Tea Ceremony", "Hair Combing Ritual", "Wedding Banquet", "Door Games", "Red Packet Exchange"],
    symbols: ["Red & Gold Colors", "Dragon & Phoenix", "Double Happiness", "Peonies", "Lanterns"],
    heroImage: chineseHero,
    templateCount: 36,
    seoTitle: "Chinese Wedding Video Invitation | Tea Ceremony Invites",
    seoDescription: "Create traditional Chinese wedding video invitations with tea ceremony and Double Happiness themes. Red and gold designs.",
    keywords: "chinese wedding invitation, tea ceremony video, double happiness invitation, chinese wedding video, 中国婚礼邀请",
  },
  "korean-pyebaek-video": {
    name: "Korean Pyebaek Ceremony Videos",
    localName: "한국 폐백 비디오",
    description: "Elegant Korean wedding video invitations featuring traditional Hanbok attire and Pyebaek ceremony.",
    traditions: ["Pyebaek Ceremony", "Modern Ceremony", "Paebaek Bows", "Date & Nut Toss", "Reception"],
    symbols: ["Hanbok Attire", "Red & Blue Colors", "Korean Knots", "Ducks Symbolism", "Traditional Table"],
    heroImage: koreanHero,
    templateCount: 30,
    seoTitle: "Korean Wedding Video Invitation | Pyebaek Ceremony Invites",
    seoDescription: "Create elegant Korean wedding video invitations with Hanbok and Pyebaek ceremony traditions. Traditional Korean designs.",
    keywords: "korean wedding invitation, pyebaek video, hanbok wedding invitation, korean ceremony video, 한국 결혼식 초대장",
  },
  "filipino-debut-video": {
    name: "Filipino Debut Videos",
    localName: "Debut ng Pilipino",
    description: "Festive Filipino debut video invitations for 18th birthday celebrations with traditional customs.",
    traditions: ["Grand Entrance", "18 Roses Dance", "18 Candles", "Father-Daughter Dance", "Debut Waltz"],
    symbols: ["Gown & Tiara", "Roses", "Pearls", "Butterfly Theme", "Gold Accents"],
    heroImage: quinceaneraHero,
    templateCount: 32,
    seoTitle: "Filipino Debut Video Invitation | 18th Birthday Invites",
    seoDescription: "Create festive Filipino debut video invitations for 18th birthday celebrations. 18 Roses and 18 Candles traditions.",
    keywords: "filipino debut invitation, 18th birthday video, debut party invitation, filipino birthday video, debutante invitation",
  },
  "jewish-bar-bat-mitzvah-video-invitation": {
    name: "Jewish Bar/Bat Mitzvah Videos",
    localName: "בר/בת מצווה",
    description: "Meaningful Jewish Bar and Bat Mitzvah video invitations celebrating coming of age with sacred traditions.",
    traditions: ["Torah Reading", "Aliyah Ceremony", "Candle Lighting", "Hora Dance", "Reception Celebration"],
    symbols: ["Star of David", "Torah Scroll", "Tallit & Kippah", "Blue & Silver", "Hamsa Hand"],
    heroImage: arabicHero,
    templateCount: 34,
    seoTitle: "Bar/Bat Mitzvah Video Invitation | Jewish Celebration Invites",
    seoDescription: "Create meaningful Bar and Bat Mitzvah video invitations with Star of David and Torah themes. Jewish coming of age celebrations.",
    keywords: "bar mitzvah invitation video, bat mitzvah video, jewish celebration invitation, torah reading invitation, בר מצווה הזמנה",
  },
};

interface TemplateResponse {
  templates: Template[];
  pagination: { total: number; offset: number; limit: number; hasMore: boolean };
}

const TEMPLATE_TYPES = [
  { value: "video", label: "Video" },
  { value: "card", label: "Card" },
];

const SORT_OPTIONS = [
  { value: "popular", label: "Popular" },
  { value: "newest", label: "Newest" },
  { value: "price_low", label: "Low to High" },
  { value: "price_high", label: "High to Low" },
];

function FilterChip({ label, isSelected, onClick }: { label: string; isSelected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
        isSelected
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}

function FilterOption({ label, isSelected, onClick }: { label: string; isSelected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
        isSelected
          ? "bg-primary/10 text-primary border-primary/30"
          : "bg-muted/50 text-muted-foreground border-transparent hover:bg-muted"
      }`}
    >
      {label}
    </button>
  );
}

export default function CulturePage() {
  const [location] = useLocation();
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [sortFilter, setSortFilter] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Parse the culture slug from the URL path
  const pathParts = location.replace("/culture/", "").split("/").filter(Boolean);
  
  const slug = pathParts.length > 1 ? pathParts[pathParts.length - 1] : pathParts[0] || "indian-wedding-video-invitation";
  const culture = cultureData[slug] || cultureData["indian-wedding-video-invitation"];

  // Build region query for API
  const regionQuery = culture.regions 
    ? culture.regions.join(',') 
    : culture.region || '';

  // Build query params for API
  const buildQueryParams = () => {
    const params = new URLSearchParams();
    if (regionQuery) params.set("region", regionQuery);
    if (typeFilter) params.set("type", typeFilter);
    if (sortFilter) params.set("sort", sortFilter);
    params.set("limit", "25");
    return params.toString();
  };

  // Fetch real templates from database based on culture's region
  const { data, isLoading } = useQuery<TemplateResponse>({
    queryKey: ["/api/templates", { region: regionQuery, type: typeFilter, sort: sortFilter }],
    queryFn: async () => {
      const queryString = buildQueryParams();
      const response = await fetch(`/api/templates?${queryString}`);
      if (!response.ok) throw new Error("Failed to fetch templates");
      return response.json();
    },
  });
  
  const templates = data?.templates || [];
  const totalCount = data?.pagination?.total || templates.length;
  const hasActiveFilters = typeFilter || sortFilter;

  const clearAllFilters = () => {
    setTypeFilter(null);
    setSortFilter(null);
  };

  // SEO Schema markup
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: culture.seoTitle || culture.name,
    description: culture.seoDescription || culture.description,
    url: `https://weddinginvite.ai/culture/${slug}`,
    about: {
      "@type": "Thing",
      name: culture.name,
      description: culture.description
    },
    numberOfItems: templates.length || culture.templateCount
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
        name: "Cultures",
        item: "https://weddinginvite.ai/culture"
      },
      {
        "@type": "ListItem",
        position: 3,
        name: culture.name,
        item: `https://weddinginvite.ai/culture/${slug}`
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `How do I create a ${culture.name.toLowerCase()}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Choose from our ${culture.templateCount}+ ${culture.name.toLowerCase()} templates, customize with your details, and share instantly via WhatsApp or download in HD quality.`
        }
      },
      {
        "@type": "Question",
        name: `What ceremonies are included in ${culture.name.toLowerCase()}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Our ${culture.name.toLowerCase()} include templates for: ${culture.traditions.join(', ')}.`
        }
      }
    ]
  };

  return (
    <>
      <SEOHead
        title={culture.seoTitle || culture.name}
        description={culture.seoDescription || `${culture.description} Browse ${culture.templateCount}+ authentic video invitation templates.`}
        keywords={culture.keywords || `${culture.name}, ${slug}, cultural wedding video, ${culture.localName}, traditional invitation`}
        schema={[collectionSchema, breadcrumbSchema, faqSchema]}
      />

      <HeroSection
        title={culture.name}
        subtitle={culture.localName}
        description={culture.description}
        backgroundImage={culture.heroImage}
        height="large"
        primaryCTA={{
          text: "Browse Templates",
          href: "#templates",
        }}
      />

      <section className="py-12 lg:py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
            <Card className="p-8">
              <h2 className="font-playfair text-2xl lg:text-3xl font-bold text-foreground mb-6">
                Traditional Ceremonies
              </h2>
              <ul className="space-y-3">
                {culture.traditions.map((tradition: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">{tradition}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-8">
              <h2 className="font-playfair text-2xl lg:text-3xl font-bold text-foreground mb-6">
                Cultural Symbols
              </h2>
              <ul className="space-y-3">
                {culture.symbols.map((symbol: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">{symbol}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <div className="mb-6" id="templates">
            <h3 className="font-playfair text-3xl lg:text-4xl font-bold text-foreground mb-2 text-center">
              {culture.name} Templates
            </h3>
            <p className="text-muted-foreground text-center text-lg mb-6">
              Culturally authentic templates for your special occasion
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-4 pb-4 border-b">
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 rounded-full"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                data-testid="button-filters"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-primary" />
                )}
              </Button>

              {isFilterOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsFilterOpen(false)}
                  />
                  <div className="absolute left-0 top-full mt-2 w-72 p-4 rounded-xl border bg-card shadow-lg z-50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <SlidersHorizontal className="w-4 h-4" />
                        Filters
                      </div>
                      <button 
                        onClick={() => setIsFilterOpen(false)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Type</label>
                        <div className="flex flex-wrap gap-2">
                          {TEMPLATE_TYPES.map((option) => (
                            <FilterOption
                              key={option.value}
                              label={option.label}
                              isSelected={typeFilter === option.value}
                              onClick={() => setTypeFilter(typeFilter === option.value ? null : option.value)}
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Sort by</label>
                        <div className="flex flex-wrap gap-2">
                          {SORT_OPTIONS.map((option) => (
                            <FilterOption
                              key={option.value}
                              label={option.label}
                              isSelected={sortFilter === option.value}
                              onClick={() => setSortFilter(sortFilter === option.value ? null : option.value)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-5 pt-4 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 rounded-full"
                        onClick={clearAllFilters}
                      >
                        Clear All
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 rounded-full"
                        onClick={() => setIsFilterOpen(false)}
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-wrap gap-2 flex-1">
              {TEMPLATE_TYPES.map((type) => (
                <FilterChip
                  key={type.value}
                  label={type.label}
                  isSelected={typeFilter === type.value}
                  onClick={() => setTypeFilter(typeFilter === type.value ? null : type.value)}
                />
              ))}
              <div className="w-px h-6 bg-border mx-1 self-center" />
              {SORT_OPTIONS.slice(0, 2).map((sort) => (
                <FilterChip
                  key={sort.value}
                  label={sort.label}
                  isSelected={sortFilter === sort.value}
                  onClick={() => setSortFilter(sortFilter === sort.value ? null : sort.value)}
                />
              ))}
            </div>

            <div className="flex items-center gap-2 text-muted-foreground flex-shrink-0">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">
                {isLoading ? "Loading..." : `${totalCount} designs`}
              </span>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="text-xs text-muted-foreground">Active:</span>
              {typeFilter && (
                <Badge variant="secondary" className="gap-1 text-xs">
                  {TEMPLATE_TYPES.find(t => t.value === typeFilter)?.label}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-destructive" 
                    onClick={() => setTypeFilter(null)}
                  />
                </Badge>
              )}
              {sortFilter && (
                <Badge variant="secondary" className="gap-1 text-xs">
                  {SORT_OPTIONS.find(s => s.value === sortFilter)?.label}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-destructive" 
                    onClick={() => setSortFilter(null)}
                  />
                </Badge>
              )}
              <button
                onClick={clearAllFilters}
                className="text-xs text-primary hover:text-primary/80 font-medium hover:underline"
              >
                Clear all
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-5">
              {[...Array(10)].map((_, i) => (
                <div key={`skeleton-${i}`} className="space-y-2">
                  <Skeleton className="aspect-[3/4] w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          ) : templates.length === 0 ? (
            <Card className="p-10 text-center">
              <div className="max-w-md mx-auto">
                <h3 className="font-playfair text-xl font-bold text-foreground mb-2">
                  No Templates Found
                </h3>
                <p className="text-muted-foreground text-sm mb-5">
                  {hasActiveFilters 
                    ? "Try adjusting your filters to see more results"
                    : `Templates for ${culture.name} are coming soon!`
                  }
                </p>
                {hasActiveFilters && (
                  <Button onClick={clearAllFilters} variant="outline">
                    Clear Filters
                  </Button>
                )}
              </div>
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
