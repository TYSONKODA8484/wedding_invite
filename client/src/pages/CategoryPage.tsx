import { useRoute } from "wouter";
import { SEOHead } from "@/components/SEOHead";
import { HeroSection } from "@/components/HeroSection";
import { TemplateCard } from "@/components/TemplateCard";
import homepageHero from "@assets/generated_images/Homepage_cinematic_wedding_hero_efb94fa0.png";
import engagementHero from "@assets/generated_images/Engagement_category_hero_image_e98e3800.png";
import luxuryHero from "@assets/generated_images/Premium_luxury_category_hero_5c811c21.png";
import indianPunjabiHero from "@assets/generated_images/Indian_Punjabi_wedding_culture_b8245c44.png";

const categoryData: Record<string, any> = {
  "wedding-video-invitations": {
    name: "Wedding Video Invitations",
    description: "Create stunning cinematic wedding video invitations that capture the magic of your special day. Share your love story with beautiful animations, romantic music, and professional quality.",
    seoDescription: "Browse premium wedding video invitation templates. Create cinematic 4K wedding invites with AI customization. Perfect for Indian, Arabic, Western, and cultural weddings.",
    heroImage: homepageHero,
    templateCount: 150,
  },
  "premium-luxury": {
    name: "Premium Luxury Invitations",
    description: "Sophisticated and elegant templates for high-end celebrations. Perfect for couples seeking refined, luxurious video invitations with exceptional production quality.",
    seoDescription: "Luxury wedding video invitation templates featuring elegant designs, premium animations, and sophisticated styling for upscale weddings and events.",
    heroImage: luxuryHero,
    templateCount: 45,
  },
  "engagement-invites": {
    name: "Engagement Video Invitations",
    description: "Announce your engagement with romantic and joyful video invitations. Beautiful templates designed to celebrate your love and upcoming wedding journey.",
    seoDescription: "Engagement video invitation templates for couples. Create romantic engagement announcements with personalized photos, music, and AI voiceover.",
    heroImage: engagementHero,
    templateCount: 80,
  },
  "save-the-date": {
    name: "Save the Date Videos",
    description: "Get your guests excited with creative save the date video announcements. Perfect for giving your loved ones advance notice of your special day.",
    seoDescription: "Save the date video templates for weddings and events. Create memorable announcements with custom dates, locations, and personal touches.",
    heroImage: homepageHero,
    templateCount: 55,
  },
  "baby-announcements": {
    name: "Baby Announcement Videos",
    description: "Share your joy with adorable baby announcement video templates. Perfect for pregnancy reveals, gender announcements, and welcoming your bundle of joy.",
    seoDescription: "Baby announcement video templates featuring cute designs, soft colors, and heartwarming animations for pregnancy and birth announcements.",
    heroImage: engagementHero,
    templateCount: 60,
  },
  "birthday-anniversary": {
    name: "Birthday & Anniversary Videos",
    description: "Celebrate life's milestones with personalized video invitations for birthdays, anniversaries, and special celebrations.",
    seoDescription: "Birthday and anniversary video invitation templates. Create personalized celebration invites for milestone birthdays and wedding anniversaries.",
    heroImage: luxuryHero,
    templateCount: 70,
  },
  "corporate-invites": {
    name: "Corporate Event Invitations",
    description: "Professional video invitations for business events, conferences, networking sessions, and corporate celebrations.",
    seoDescription: "Professional corporate event video invitation templates. Perfect for business conferences, networking events, product launches, and company celebrations.",
    heroImage: indianPunjabiHero,
    templateCount: 40,
  },
};

export default function CategoryPage() {
  const [, params] = useRoute("/categories/:slug");
  const slug = params?.slug || "wedding-video-invitations";
  const category = categoryData[slug] || categoryData["wedding-video-invitations"];

  const templates = [
    { id: "1", title: "Cinematic Love Story", slug: "cinematic-love-story", category: "wedding", duration: 45, thumbnailUrl: homepageHero, isPremium: true },
    { id: "2", title: "Golden Elegance", slug: "golden-elegance", category: "engagement", duration: 30, thumbnailUrl: luxuryHero, isPremium: false },
    { id: "3", title: "Traditional Celebration", slug: "traditional-celebration", category: "wedding", duration: 60, thumbnailUrl: indianPunjabiHero, isPremium: true },
    { id: "4", title: "Modern Romance", slug: "modern-romance", category: "engagement", duration: 40, thumbnailUrl: engagementHero, isPremium: false },
    { id: "5", title: "Royal Wedding", slug: "royal-wedding", category: "wedding", duration: 55, thumbnailUrl: luxuryHero, isPremium: true },
    { id: "6", title: "Simple Elegance", slug: "simple-elegance", category: "wedding", duration: 35, thumbnailUrl: homepageHero, isPremium: false },
  ];

  return (
    <>
      <SEOHead
        title={category.name}
        description={category.seoDescription}
        keywords={`${slug}, video invitation, ${category.name.toLowerCase()}, wedding video, digital invitation`}
        schema={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": category.name,
          "description": category.seoDescription,
        }}
      />

      <HeroSection
        title={category.name}
        description={category.description}
        backgroundImage={category.heroImage}
        height="large"
        primaryCTA={{
          text: "Browse Templates",
          href: "#templates",
        }}
      />

      <section className="py-12 lg:py-16 bg-background" id="templates">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto mb-12">
            <h2 className="font-playfair text-3xl lg:text-4xl font-bold text-foreground mb-6">
              About {category.name}
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="mb-4">
                {category.description}
              </p>
              <p className="mb-4">
                Our {category.name.toLowerCase()} are designed with attention to every detail, featuring 4K quality, smooth transitions, and culturally authentic elements. Each template is fully customizable with AI-powered tools that let you add your personal touch effortlessly.
              </p>
              <p>
                With over {category.templateCount} templates to choose from, you'll find the perfect style to match your vision and share it instantly with your loved ones on WhatsApp, Instagram, or any platform.
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-playfair text-2xl lg:text-3xl font-bold text-foreground mb-2">
              Featured Templates
            </h3>
            <p className="text-muted-foreground">{category.templateCount} templates available</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {templates.map((template) => (
              <TemplateCard key={template.id} {...template} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
