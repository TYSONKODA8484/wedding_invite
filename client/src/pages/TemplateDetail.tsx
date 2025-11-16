import { useRoute } from "wouter";
import { SEOHead } from "@/components/SEOHead";
import { TemplateCard } from "@/components/TemplateCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Clock, Play, Type, Image as ImageIcon, Music, Mic, Palette, ArrowRight } from "lucide-react";
import homepageHero from "@assets/generated_images/Homepage_cinematic_wedding_hero_efb94fa0.png";
import engagementHero from "@assets/generated_images/Engagement_category_hero_image_e98e3800.png";
import luxuryHero from "@assets/generated_images/Premium_luxury_category_hero_5c811c21.png";

export default function TemplateDetail() {
  const [, params] = useRoute("/template/:slug");
  const slug = params?.slug || "cinematic-love-story";

  const template = {
    title: "Cinematic Love Story",
    slug: "cinematic-love-story",
    description: "A breathtaking cinematic wedding invitation template featuring elegant transitions, romantic music, and professional voiceover. Perfect for couples who want to share their love story in the most beautiful way possible.",
    category: "Wedding",
    culture: "Universal",
    style: "Cinematic",
    duration: 45,
    orientation: "Portrait (9:16)",
    videoUrl: homepageHero,
    thumbnailUrl: homepageHero,
    isPremium: true,
  };

  const customizationFeatures = [
    { icon: <Type className="w-6 h-6" />, title: "Custom Text", description: "Add your names, date, venue, and personal message" },
    { icon: <ImageIcon className="w-6 h-6" />, title: "Your Photos", description: "Upload your favorite couple photos or engagement pictures" },
    { icon: <Music className="w-6 h-6" />, title: "Music Selection", description: "Choose from our library or upload your own soundtrack" },
    { icon: <Mic className="w-6 h-6" />, title: "AI Voiceover", description: "Professional voiceover in multiple languages and accents" },
    { icon: <Palette className="w-6 h-6" />, title: "Color Themes", description: "Adjust colors to match your wedding palette" },
    { icon: <Clock className="w-6 h-6" />, title: "Timing Control", description: "Customize scene duration and transitions" },
  ];

  const relatedTemplates = [
    { id: "2", title: "Golden Elegance", slug: "golden-elegance", category: "engagement", duration: 30, thumbnailUrl: luxuryHero, isPremium: false },
    { id: "4", title: "Modern Romance", slug: "modern-romance", category: "engagement", duration: 40, thumbnailUrl: engagementHero, isPremium: false },
    { id: "6", title: "Simple Elegance", slug: "simple-elegance", category: "wedding", duration: 35, thumbnailUrl: luxuryHero, isPremium: false },
  ];

  return (
    <>
      <SEOHead
        title={`${template.title} - Video Invitation Template`}
        description={template.description}
        keywords={`${template.category} video invitation, ${template.style} template, wedding video creator`}
        schema={{
          "@context": "https://schema.org",
          "@type": "VideoObject",
          "name": template.title,
          "description": template.description,
          "thumbnailUrl": template.thumbnailUrl,
          "uploadDate": "2024-01-01",
          "duration": `PT${template.duration}S`,
        }}
      />

      <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-black" data-testid="template-preview">
        <div className="absolute inset-0 z-0">
          <img
            src={template.videoUrl}
            alt={template.title}
            className="w-full h-full object-contain"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <Button
            size="lg"
            className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-primary/90 backdrop-blur-sm hover:bg-primary shadow-2xl"
            data-testid="button-play-preview"
          >
            <Play className="w-10 h-10 lg:w-12 lg:h-12 text-primary-foreground fill-current ml-1" />
          </Button>
        </div>

        {template.isPremium && (
          <Badge className="absolute top-6 right-6 bg-accent text-accent-foreground font-semibold text-base px-4 py-2">
            Premium Template
          </Badge>
        )}
      </div>

      <section className="py-12 lg:py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-playfair text-4xl lg:text-5xl font-bold text-foreground mb-4" data-testid="text-template-title">
              {template.title}
            </h1>
            <div className="flex flex-wrap gap-3 mb-6">
              <Badge variant="secondary" className="text-sm">{template.category}</Badge>
              <Badge variant="secondary" className="text-sm">{template.culture}</Badge>
              <Badge variant="secondary" className="text-sm">{template.style}</Badge>
              <Badge variant="secondary" className="text-sm">
                <Clock className="w-4 h-4 mr-1" />
                {template.duration}s
              </Badge>
              <Badge variant="secondary" className="text-sm">{template.orientation}</Badge>
            </div>
            <p className="text-muted-foreground text-lg lg:text-xl mb-8 leading-relaxed">
              {template.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button
                variant="default"
                size="lg"
                className="flex-1 text-base font-semibold h-14"
                data-testid="button-use-template"
              >
                Use This Template
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="flex-1 text-base font-semibold h-14"
                data-testid="button-customize"
              >
                Customize Now
              </Button>
            </div>

            <Card className="p-8 lg:p-10 mb-12">
              <h2 className="font-playfair text-3xl lg:text-4xl font-bold text-foreground mb-8">
                What You Can Customize
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {customizationFeatures.map((feature, index) => (
                  <div key={index} className="flex gap-4" data-testid={`customization-${index}`}>
                    <div className="flex-shrink-0 w-12 h-12 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="mt-16">
            <h2 className="font-playfair text-3xl lg:text-4xl font-bold text-foreground mb-8 text-center">
              Related Templates
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
              {relatedTemplates.map((template) => (
                <TemplateCard key={template.id} {...template} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
