import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { SEOHead } from "@/components/SEOHead";
import { HeroSection } from "@/components/HeroSection";
import { TemplateCard } from "@/components/TemplateCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Loader2, Play, FileImage, MapPin, Star, Users, CheckCircle2, ArrowRight } from "lucide-react";
import type { Template } from "@shared/schema";
import indianPunjabiHero from "@assets/generated_images/Indian_Punjabi_wedding_culture_b8245c44.png";
import arabicHero from "@assets/generated_images/Arabic_UAE_wedding_culture_5fdde5ea.png";
import saudiHero from "@assets/stock_images/saudi_arabian_weddin_519f891c.jpg";
import homepageHero from "@assets/generated_images/Homepage_cinematic_wedding_hero_efb94fa0.png";
import engagementHero from "@assets/generated_images/Engagement_category_hero_image_e98e3800.png";

interface RegionData {
  name: string;
  slug: string;
  code: string;
  currency: string;
  currencySymbol: string;
  locale: string;
  heroImage: string;
  weddingsPerYear: string;
  digitalAdoption: string;
  avgSpend: string;
  popularStyles: string[];
  ceremonies: string[];
  arabicTitle?: string;
  arabicDescription?: string;
  hindiTitle?: string;
  hindiDescription?: string;
}

interface CategoryData {
  name: string;
  slug: string;
  type: "video" | "card";
  eventType: "wedding" | "birthday";
  heroImage: string;
  description: string;
  features: string[];
}

const regionData: Record<string, RegionData> = {
  india: {
    name: "India",
    slug: "india",
    code: "IN",
    currency: "INR",
    currencySymbol: "₹",
    locale: "en_IN",
    heroImage: indianPunjabiHero,
    weddingsPerYear: "10 Million+",
    digitalAdoption: "70%",
    avgSpend: "₹1,500",
    popularStyles: ["Traditional Hindu", "Punjabi Bhangra", "South Indian Temple", "Rajasthani Royal", "Marathi", "Bengali", "Gujarati", "Muslim Nikah"],
    ceremonies: ["Mehendi", "Sangeet", "Haldi", "Wedding", "Reception", "Engagement", "Roka"],
    hindiTitle: "भारतीय शादी वीडियो निमंत्रण",
    hindiDescription: "व्हाट्सएप के लिए सुंदर भारतीय शादी वीडियो निमंत्रण बनाएं। पंजाबी, दक्षिण भारतीय, हिंदी, मराठी शादियों के लिए 100+ टेम्पलेट।",
  },
  uae: {
    name: "United Arab Emirates",
    slug: "uae",
    code: "AE",
    currency: "AED",
    currencySymbol: "د.إ",
    locale: "ar_AE",
    heroImage: arabicHero,
    weddingsPerYear: "50,000+",
    digitalAdoption: "85%",
    avgSpend: "AED 500",
    popularStyles: ["Luxury Arabic", "Modern Emirati", "Traditional Khaleeji", "Gold & Crystal", "Desert Romance", "Dubai Glamour"],
    ceremonies: ["Kateb Katb", "Henna Night", "Wedding Ceremony", "Walima Reception", "Zaffa"],
    arabicTitle: "دعوة زفاف فيديو الإمارات",
    arabicDescription: "إنشاء دعوات زفاف فيديو عربية فاخرة للإمارات. قوالب إماراتية وإسلامية راقية لحفلات الزفاف في دبي وأبو ظبي",
  },
  "saudi-arabia": {
    name: "Saudi Arabia",
    slug: "saudi-arabia",
    code: "SA",
    currency: "SAR",
    currencySymbol: "ر.س",
    locale: "ar_SA",
    heroImage: saudiHero,
    weddingsPerYear: "150,000+",
    digitalAdoption: "80%",
    avgSpend: "SAR 400",
    popularStyles: ["Saudi Royal", "Traditional Islamic", "Luxury Gold", "Cultural Heritage", "Modern Saudi", "Najdi Traditional"],
    ceremonies: ["Nikah", "Milka", "Walima", "Shabka", "Reception"],
    arabicTitle: "كروت زفاف فيديو السعودية",
    arabicDescription: "إنشاء دعوات زفاف فيديو سعودية ملكية. قوالب إسلامية فاخرة للأفراح في الرياض وجدة ومكة",
  },
};

const categoryData: Record<string, CategoryData> = {
  "wedding-invitation-video": {
    name: "Wedding Invitation Videos",
    slug: "wedding-invitation-video",
    type: "video",
    eventType: "wedding",
    heroImage: homepageHero,
    description: "Create stunning cinematic wedding video invitations with beautiful animations, romantic music, and professional 4K quality. Perfect for sharing on WhatsApp, Instagram, and social media.",
    features: ["4K Ultra HD Quality", "Custom Music & Voiceover", "30-60 Second Duration", "WhatsApp Optimized", "Instant Download"],
  },
  "wedding-invitation-card": {
    name: "Digital Wedding Cards",
    slug: "wedding-invitation-card",
    type: "card",
    eventType: "wedding",
    heroImage: engagementHero,
    description: "Beautiful digital wedding invitation cards with elegant designs. Easy to customize and share instantly with your guests via WhatsApp, email, or social media.",
    features: ["High Resolution PNG/JPG", "Elegant Designs", "Easy Customization", "Instant Sharing", "Print Ready"],
  },
  "birthday-invitation-video": {
    name: "Birthday Invitation Videos",
    slug: "birthday-invitation-video",
    type: "video",
    eventType: "birthday",
    heroImage: engagementHero,
    description: "Fun and colorful birthday video invitations for all ages. From kids' parties to milestone celebrations, create memorable video invites your guests will love.",
    features: ["Animated Graphics", "Fun Music Options", "Age-Appropriate Themes", "Social Media Ready", "Quick Customization"],
  },
  "birthday-invitation-card": {
    name: "Digital Birthday Cards",
    slug: "birthday-invitation-card",
    type: "card",
    eventType: "birthday",
    heroImage: homepageHero,
    description: "Colorful and creative digital birthday invitation cards. Choose from themes for kids, teens, adults, and milestone birthdays.",
    features: ["Vibrant Designs", "Multiple Age Groups", "Theme Options", "Easy Personalization", "Instant Download"],
  },
};

const getSEOContent = (region?: RegionData, category?: CategoryData) => {
  if (region && category) {
    const isArabic = region.slug === "uae" || region.slug === "saudi-arabia";
    const isWedding = category.eventType === "wedding";
    const isVideo = category.type === "video";
    
    return {
      title: `${region.name} ${category.name} | ${isWedding ? "शादी" : "जन्मदिन"} ${isVideo ? "Video" : "Card"} Maker`,
      description: `Create ${isArabic ? "luxury Arabic" : "beautiful Indian"} ${category.eventType} ${category.type} invitations for ${region.name}. ${isWedding ? `Perfect for ${region.ceremonies.slice(0, 3).join(", ")} ceremonies.` : "For all ages and milestone celebrations."} ${region.currencySymbol}800-${region.currencySymbol}2,900.`,
      keywords: `${region.name.toLowerCase()} ${category.eventType} ${category.type} invitation, ${region.slug} ${category.eventType} invite, ${isArabic ? "arabic" : "indian"} ${category.eventType} ${category.type}, whatsapp ${category.eventType} invitation ${region.name.toLowerCase()}, digital ${category.eventType} invite ${region.slug}`,
      h1: `${region.name} ${category.name}`,
      h2: `Create Beautiful ${category.eventType.charAt(0).toUpperCase() + category.eventType.slice(1)} ${category.type === "video" ? "Videos" : "Cards"} for ${region.name}`,
    };
  }
  
  if (region) {
    const isArabic = region.slug === "uae" || region.slug === "saudi-arabia";
    return {
      title: `${region.name} Wedding Invitation Video | ${isArabic ? region.arabicTitle : region.hindiTitle}`,
      description: `Create stunning wedding video invitations for ${region.name}. ${region.weddingsPerYear} weddings annually. Templates for ${region.popularStyles.slice(0, 4).join(", ")}. Prices from ${region.currencySymbol}800.`,
      keywords: `${region.name.toLowerCase()} wedding invitation video, ${region.slug} wedding video, whatsapp wedding invitation ${region.name.toLowerCase()}, digital wedding invite ${region.slug}, ${isArabic ? "arabic wedding video, دعوة زفاف فيديو" : "indian wedding video, शादी वीडियो निमंत्रण"}`,
      h1: `${region.name} Wedding Video Invitations`,
      h2: `Premium Wedding Templates for ${region.name}`,
    };
  }
  
  if (category) {
    return {
      title: `${category.name} | Online ${category.eventType.charAt(0).toUpperCase() + category.eventType.slice(1)} Invitation Maker`,
      description: category.description,
      keywords: `${category.eventType} invitation ${category.type}, ${category.eventType} ${category.type} maker online, digital ${category.eventType} invite, whatsapp ${category.eventType} invitation, ${category.eventType} ${category.type} template`,
      h1: category.name,
      h2: `Create Stunning ${category.eventType.charAt(0).toUpperCase() + category.eventType.slice(1)} ${category.type === "video" ? "Videos" : "Cards"}`,
    };
  }
  
  return {
    title: "Wedding Invitation Video Maker",
    description: "Create stunning wedding and birthday video invitations online. Templates for India, UAE, Saudi Arabia. Share on WhatsApp instantly.",
    keywords: "wedding invitation video, birthday invitation video, digital invitation maker, whatsapp wedding invite",
    h1: "Video Invitation Maker",
    h2: "Create Beautiful Invitations",
  };
};

const getPopularSearches = (region?: RegionData, category?: CategoryData) => {
  const baseSearches = [
    { text: "Wedding Invitation Video Maker", href: "/wedding-invitation-video" },
    { text: "Birthday Invitation Video", href: "/birthday-invitation-video" },
    { text: "Digital Wedding Card", href: "/wedding-invitation-card" },
    { text: "Digital Birthday Card", href: "/birthday-invitation-card" },
  ];
  
  // Create style-specific search links with subcategory filters
  const styleToSubcategory = (style: string) => {
    return style.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };
  
  const regionSearches = region ? [
    { text: `${region.name} Wedding Video`, href: `/${region.slug}/wedding-invitation-video` },
    { text: `${region.name} Birthday Video`, href: `/${region.slug}/birthday-invitation-video` },
    { text: `${region.name} Wedding Card`, href: `/${region.slug}/wedding-invitation-card` },
    // Popular styles with subcategory filter for unique URLs
    ...region.popularStyles.slice(0, 4).map(style => ({
      text: `${style} Wedding Video`,
      href: `/templates/wedding?region=${region.slug}&subcategory=${styleToSubcategory(style)}`,
    })),
  ] : [];
  
  const categorySearches = category ? [
    { text: `India ${category.name}`, href: `/india/${category.slug}` },
    { text: `UAE ${category.name}`, href: `/uae/${category.slug}` },
    { text: `Saudi Arabia ${category.name}`, href: `/saudi-arabia/${category.slug}` },
  ] : [];
  
  // Cross-link to other regions for better SEO
  const crossRegionSearches = !region ? [
    { text: "India Wedding Invitations", href: "/india" },
    { text: "UAE Wedding Invitations", href: "/uae" },
    { text: "Saudi Arabia Invitations", href: "/saudi-arabia" },
  ] : [];
  
  const allSearches = [...regionSearches, ...categorySearches, ...crossRegionSearches, ...baseSearches];
  
  // Ensure unique URLs by deduplicating
  const seenHrefs = new Set<string>();
  return allSearches.filter(search => {
    if (seenHrefs.has(search.href)) return false;
    seenHrefs.add(search.href);
    return true;
  }).slice(0, 12);
};

const getFAQs = (region?: RegionData, category?: CategoryData) => {
  const regionName = region?.name || "your region";
  const categoryType = category?.type || "video";
  const eventType = category?.eventType || "wedding";
  
  return [
    {
      question: `How do I create a ${eventType} invitation ${categoryType} for ${regionName}?`,
      answer: `Creating a ${eventType} ${categoryType} invitation is simple: 1) Choose a template from our collection designed for ${regionName}. 2) Customize with your details, photos, and preferences. 3) Preview and download instantly. Share via WhatsApp or any platform!`,
    },
    {
      question: `What is the price of ${eventType} invitation ${categoryType}s?`,
      answer: `Our ${eventType} ${categoryType} invitations range from ${region?.currencySymbol || "₹"}800 to ${region?.currencySymbol || "₹"}2,900 depending on the template complexity and features. Premium templates include additional animations and customization options.`,
    },
    {
      question: `Can I customize the ${eventType} invitation with my photos?`,
      answer: `Yes! All our templates support photo customization. You can add your photos, change text, select music, and personalize every aspect of your ${categoryType} invitation.`,
    },
    {
      question: `How long does it take to receive my ${categoryType}?`,
      answer: `${categoryType === "video" ? "Video invitations are generated within 5-10 minutes after payment. You can preview instantly before purchase." : "Digital cards are ready for download immediately after customization and payment."}`,
    },
    {
      question: `Can I share the invitation on WhatsApp?`,
      answer: `Absolutely! All our ${categoryType}s are optimized for WhatsApp sharing. ${categoryType === "video" ? "Videos are compressed for quick sending while maintaining HD quality." : "Cards are sized perfectly for mobile viewing."} You also get a shareable link.`,
    },
    {
      question: `Do you offer ${region?.ceremonies?.[0] || "ceremony"} specific invitations?`,
      answer: `Yes, we have specialized templates for ${region?.ceremonies?.slice(0, 4).join(", ") || "various ceremonies"}. Each template is designed with cultural authenticity and traditional elements.`,
    },
  ];
};

export default function SEOLandingPage() {
  const [location] = useLocation();
  
  // Parse the URL path to extract region and category
  const pathSegments = location.split('/').filter(Boolean);
  
  let regionSlug: string | undefined;
  let categorySlug: string | undefined;
  let isValidRoute = false;
  
  if (pathSegments.length === 2) {
    // Combined route like /india/wedding-invitation-video
    const potentialRegion = pathSegments[0];
    const potentialCategory = pathSegments[1];
    
    if (regionData[potentialRegion] && categoryData[potentialCategory]) {
      regionSlug = potentialRegion;
      categorySlug = potentialCategory;
      isValidRoute = true;
    }
    // If 2 segments but not a valid combined route, this is invalid - don't fallback
  } else if (pathSegments.length === 1) {
    // Single segment - check if it's a region or category
    const segment = pathSegments[0];
    
    if (regionData[segment]) {
      regionSlug = segment;
      isValidRoute = true;
    } else if (categoryData[segment]) {
      categorySlug = segment;
      isValidRoute = true;
    }
  }
  
  const isRegionPage = Boolean(regionSlug && regionData[regionSlug] && !categorySlug);
  const isCategoryPage = Boolean(categorySlug && categoryData[categorySlug] && !regionSlug);
  const isCombinedPage = Boolean(regionSlug && categorySlug && regionData[regionSlug] && categoryData[categorySlug]);
  
  // If route is not valid, return null (let wouter handle 404)
  if (!isValidRoute) {
    return null;
  }
  
  const region = regionSlug ? regionData[regionSlug] : undefined;
  const category = categorySlug ? categoryData[categorySlug] : undefined;
  
  const seoContent = getSEOContent(region, category);
  const popularSearches = getPopularSearches(region, category);
  const faqs = getFAQs(region, category);
  
  const queryParams = new URLSearchParams();
  if (region) queryParams.set("region", region.slug);
  if (category) {
    queryParams.set("type", category.type);
    queryParams.set("category", category.eventType);
  }
  queryParams.set("limit", "25");
  
  interface TemplateResponse {
    templates: Template[];
    pagination: { total: number; offset: number; limit: number; hasMore: boolean };
  }
  
  const { data, isLoading } = useQuery<TemplateResponse>({
    queryKey: ["/api/templates", queryParams.toString()],
    queryFn: async () => {
      const response = await fetch(`/api/templates?${queryParams.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch templates");
      return response.json();
    },
  });
  
  const templates = data?.templates || [];

  const baseUrl = "https://weddinginvite.ai";
  const currentPath = isCombinedPage 
    ? `/${regionSlug}/${categorySlug}`
    : isRegionPage 
      ? `/${regionSlug}`
      : `/${categorySlug}`;

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: seoContent.h1,
    description: seoContent.description,
    url: `${baseUrl}${currentPath}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: templates.length,
      itemListElement: templates.slice(0, 10).map((template, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": category?.type === "video" ? "VideoObject" : "ImageObject",
          name: template.templateName,
          description: `${template.templateName} - ${template.category} invitation template`,
          url: `${baseUrl}/template/${template.slug}`,
          thumbnailUrl: template.thumbnailUrl,
        },
      })),
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      ...(region ? [{ "@type": "ListItem", position: 2, name: region.name, item: `${baseUrl}/${region.slug}` }] : []),
      ...(category ? [{ "@type": "ListItem", position: region ? 3 : 2, name: category.name, item: `${baseUrl}${currentPath}` }] : []),
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "WeddingInvite.ai",
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    sameAs: [
      "https://www.instagram.com/weddinginvite.ai",
      "https://www.facebook.com/weddinginvite.ai",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-9876543210",
      contactType: "customer service",
      areaServed: region ? [region.code] : ["IN", "AE", "SA"],
      availableLanguage: region?.locale.startsWith("ar") ? ["English", "Arabic"] : ["English", "Hindi"],
    },
  };

  const alternateLang = region?.slug === "uae" || region?.slug === "saudi-arabia"
    ? [
        { lang: "en", url: `${baseUrl}${currentPath}` },
        { lang: "ar", url: `${baseUrl}/ar${currentPath}` },
        { lang: "x-default", url: `${baseUrl}${currentPath}` },
      ]
    : region?.slug === "india"
    ? [
        { lang: "en-IN", url: `${baseUrl}${currentPath}` },
        { lang: "hi", url: `${baseUrl}/hi${currentPath}` },
        { lang: "x-default", url: `${baseUrl}${currentPath}` },
      ]
    : [
        { lang: "en", url: `${baseUrl}${currentPath}` },
        { lang: "x-default", url: `${baseUrl}${currentPath}` },
      ];

  const heroImage = region?.heroImage || category?.heroImage || homepageHero;

  return (
    <>
      <SEOHead
        title={seoContent.title}
        description={seoContent.description}
        keywords={seoContent.keywords}
        schema={[collectionSchema, breadcrumbSchema, faqSchema, organizationSchema]}
        locale={region?.locale || "en_US"}
        ogImage={heroImage}
        canonical={`${baseUrl}${currentPath}`}
        alternateLang={alternateLang}
      />

      <HeroSection
        title={seoContent.h1}
        description={seoContent.description}
        backgroundImage={heroImage}
        height="large"
        primaryCTA={{
          text: "Browse Templates",
          href: "#templates",
        }}
        secondaryCTA={{
          text: "How It Works",
          href: "/how-it-works",
        }}
      />

      {region && (
        <section className="py-12 lg:py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-playfair text-2xl lg:text-3xl font-bold text-foreground mb-8 text-center">
              {region.name} Wedding Market
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="p-6 text-center">
                <Users className="w-10 h-10 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-foreground mb-1">{region.weddingsPerYear}</div>
                <div className="text-muted-foreground">Weddings Per Year</div>
              </Card>
              <Card className="p-6 text-center">
                <Star className="w-10 h-10 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-foreground mb-1">{region.digitalAdoption}</div>
                <div className="text-muted-foreground">Digital Adoption</div>
              </Card>
              <Card className="p-6 text-center">
                <MapPin className="w-10 h-10 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-foreground mb-1">{region.avgSpend}</div>
                <div className="text-muted-foreground">Average Spend</div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4 text-foreground">Popular Wedding Styles</h3>
                <div className="flex flex-wrap gap-2">
                  {region.popularStyles.map((style, index) => (
                    <Badge key={index} variant="secondary" className="text-sm" data-testid={`badge-style-${index}`}>
                      {style}
                    </Badge>
                  ))}
                </div>
              </Card>
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4 text-foreground">Wedding Ceremonies</h3>
                <div className="flex flex-wrap gap-2">
                  {region.ceremonies.map((ceremony, index) => (
                    <Badge key={index} variant="outline" className="text-sm" data-testid={`badge-ceremony-${index}`}>
                      {ceremony}
                    </Badge>
                  ))}
                </div>
              </Card>
            </div>

            {(region.arabicTitle || region.hindiTitle) && (
              <Card className="p-6 mt-8 bg-primary/5 border-primary/20">
                <p className="text-xl text-center font-medium text-foreground" dir={region.arabicTitle ? "rtl" : "ltr"}>
                  {region.arabicTitle || region.hindiTitle}
                </p>
                <p className="text-center text-muted-foreground mt-2" dir={region.arabicTitle ? "rtl" : "ltr"}>
                  {region.arabicDescription || region.hindiDescription}
                </p>
              </Card>
            )}
          </div>
        </section>
      )}

      {category && (
        <section className="py-12 lg:py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  {category.type === "video" ? (
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                      <Play className="w-3 h-3 mr-1" /> Video
                    </Badge>
                  ) : (
                    <Badge className="bg-accent/10 text-accent-foreground border-accent/20">
                      <FileImage className="w-3 h-3 mr-1" /> Card
                    </Badge>
                  )}
                  <Badge variant="outline">{category.eventType}</Badge>
                </div>
                <h2 className="font-playfair text-2xl lg:text-3xl font-bold text-foreground mb-4">
                  {seoContent.h2}
                </h2>
                <p className="text-muted-foreground text-lg mb-6">
                  {category.description}
                </p>
                <ul className="space-y-3">
                  {category.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3 text-foreground">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <Card className="p-8 text-center bg-gradient-to-br from-primary/5 to-accent/5">
                <div className="text-4xl font-bold text-primary mb-2">
                  {region?.currencySymbol || "₹"}800 - {region?.currencySymbol || "₹"}2,900
                </div>
                <p className="text-muted-foreground mb-6">Per template, one-time payment</p>
                <Button size="lg" asChild>
                  <Link href="#templates">
                    Browse {category.eventType.charAt(0).toUpperCase() + category.eventType.slice(1)} Templates
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </Card>
            </div>
          </div>
        </section>
      )}

      <section className="py-12 lg:py-16 bg-background" id="templates">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="font-playfair text-2xl lg:text-3xl font-bold text-foreground mb-2">
              {region ? `${region.name} ` : ""}{category ? category.name : "Templates"}
            </h2>
            <p className="text-muted-foreground">
              {isLoading ? "Loading..." : `${templates.length} template${templates.length !== 1 ? "s" : ""} available`}
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
          ) : templates.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground text-lg mb-6">
                No templates match your criteria. Explore our full collection instead.
              </p>
              <Button asChild>
                <Link href="/templates">Browse All Templates</Link>
              </Button>
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

      <section className="py-12 lg:py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-playfair text-2xl lg:text-3xl font-bold text-foreground mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <Card className="p-6">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`faq-${index}`}>
                  <AccordionTrigger className="text-left text-foreground" data-testid={`accordion-faq-${index}`}>
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-background border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-semibold text-lg text-foreground mb-6">Popular Searches</h2>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map((search, index) => (
              <Link key={index} href={search.href}>
                <Badge 
                  variant="outline" 
                  className="hover-elevate cursor-pointer py-2 px-3"
                  data-testid={`link-search-${index}`}
                >
                  {search.text}
                </Badge>
              </Link>
            ))}
          </div>
          
          <div className="mt-8 pt-8 border-t">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-3">Wedding Invitations</h3>
                <ul className="space-y-2">
                  <li><Link href="/india/wedding-invitation-video" className="hover:text-primary transition-colors">Indian Wedding Video</Link></li>
                  <li><Link href="/uae/wedding-invitation-video" className="hover:text-primary transition-colors">UAE Arabic Wedding Video</Link></li>
                  <li><Link href="/saudi-arabia/wedding-invitation-video" className="hover:text-primary transition-colors">Saudi Wedding Video</Link></li>
                  <li><Link href="/wedding-invitation-card" className="hover:text-primary transition-colors">Digital Wedding Cards</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-3">Birthday Invitations</h3>
                <ul className="space-y-2">
                  <li><Link href="/india/birthday-invitation-video" className="hover:text-primary transition-colors">Indian Birthday Video</Link></li>
                  <li><Link href="/uae/birthday-invitation-video" className="hover:text-primary transition-colors">UAE Birthday Video</Link></li>
                  <li><Link href="/birthday-invitation-video" className="hover:text-primary transition-colors">Birthday Video Maker</Link></li>
                  <li><Link href="/birthday-invitation-card" className="hover:text-primary transition-colors">Digital Birthday Cards</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-3">By Region</h3>
                <ul className="space-y-2">
                  <li><Link href="/india" className="hover:text-primary transition-colors">India Templates</Link></li>
                  <li><Link href="/uae" className="hover:text-primary transition-colors">UAE Templates</Link></li>
                  <li><Link href="/saudi-arabia" className="hover:text-primary transition-colors">Saudi Arabia Templates</Link></li>
                  <li><Link href="/templates" className="hover:text-primary transition-colors">All Templates</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
