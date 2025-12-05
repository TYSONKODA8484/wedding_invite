import { useRoute, useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Loader2, 
  X, 
  Check,
  Heart,
  Sparkles,
  Download,
  Globe,
  Palette,
  Phone,
  ChevronLeft,
  ChevronRight,
  Layers,
  ChevronDown,
  Play,
  Share2,
  Clock,
  ArrowRight
} from "lucide-react";
import type { Template } from "@shared/schema";

function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
}

export default function TemplateDetail() {
  const [, params] = useRoute("/template/:slug");
  const [, navigate] = useLocation();
  const slug = params?.slug;
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [selectedPageIndex, setSelectedPageIndex] = useState(0);

  const { data: template, isLoading, error } = useQuery<any>({
    queryKey: ["/api/templates", slug],
    queryFn: async () => {
      const response = await fetch(`/api/templates/${slug}`);
      if (!response.ok) throw new Error("Failed to fetch template");
      return response.json();
    },
    enabled: !!slug,
  });

  const { data: relatedTemplates } = useQuery<any[]>({
    queryKey: ["/api/templates", "related", template?.category, slug],
    queryFn: async () => {
      const category = template?.category || "wedding";
      const response = await fetch(`/api/templates?category=${category}`);
      if (!response.ok) throw new Error("Failed to fetch related templates");
      const all = await response.json();
      return all.filter((t: any) => t.slug !== slug).slice(0, 4);
    },
    enabled: !!template,
  });

  const pages = template?.pages || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" data-testid="loading-template">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">Loading template...</p>
        </div>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4" data-testid="error-template">
        <Card className="p-12 text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-destructive" />
          </div>
          <h3 className="font-playfair text-2xl font-bold text-foreground mb-2">
            Template Not Found
          </h3>
          <p className="text-muted-foreground mb-6">
            The template you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/templates")} data-testid="button-back-to-templates">
            Browse All Templates
          </Button>
        </Card>
      </div>
    );
  }

  const formatPrice = (paise: number) => {
    const rupees = Math.floor(paise / 100);
    return `₹${rupees.toLocaleString('en-IN')}`;
  };

  const templateType = template.templateType || template.category || "wedding";
  const youtubeVideoId = getYouTubeVideoId(template.previewVideoUrl || "");
  const priceInRupees = parseFloat(template.price || "0");
  const displayPrice = formatPrice(Math.round(priceInRupees * 100));
  const expertPrice = "₹1,999";

  const description = template.description || `This ${template.templateName} video will best fit & visible on every screen. Easy to share, Try this new, elegant, and unique style of invitation.`;

  const videoSchema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: template.templateName,
    description: `${template.templateName} - ${templateType} video invitation`,
    thumbnailUrl: template.thumbnailUrl,
    uploadDate: "2024-11-19",
    duration: `PT${template.durationSec}S`,
    contentUrl: template.previewVideoUrl,
    embedUrl: `https://weddinginvite.ai/template/${template.slug}`,
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: template.templateName,
    description: `${template.templateName} - ${templateType} video invitation`,
    image: template.thumbnailUrl,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: priceInRupees.toFixed(2),
      availability: "https://schema.org/InStock",
    },
  };

  const tags = ["wedding", "hindu", "celebration", "elegant", "traditional", "video", "invitation"];

  const faqs = [
    {
      question: "How do I create my Video Invitation?",
      answer: "Once you customize the Video and enter all your details we will instantly generate a preview video (with a watermark) for you to check and verify the details before you make a final payment for it. Once you made a payment, the Video will be available to download. Also, you can download it from \"My Templates\" at any preferred time."
    },
    {
      question: "Can I get a Preview Video?",
      answer: "Yes! After customizing your invitation, you'll get an instant preview video with a watermark. This allows you to verify all details before making the final payment."
    },
    {
      question: "Can I customize the video further?",
      answer: "Absolutely! You can customize text, photos, music, colors, and more. Our editor allows you to personalize every aspect of your invitation to match your event perfectly."
    },
    {
      question: "How to download my video invitation?",
      answer: "After making the payment, your video will be instantly available for download. You can also access it anytime from the \"My Templates\" section in your account."
    }
  ];

  return (
    <>
      <SEOHead
        title={`${template.templateName} | ${template.templateType === "video" ? "Video" : "Digital Card"} Invitation`}
        description={`${template.templateName} - Beautiful ${template.templateType === "video" ? "video" : "digital card"} invitation template. Perfect for WhatsApp sharing. ${template.templateType === "video" ? "Download in HD" : `${pages.length} beautifully designed pages`}. ${displayPrice}.`}
        keywords={tags.join(", ")}
        schema={[videoSchema, productSchema]}
        ogImage={template.thumbnailUrl}
      />

      {/* Breadcrumb */}
      <nav className="bg-muted/30 border-b" aria-label="Breadcrumb">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <ol className="flex items-center gap-2 text-sm" data-testid="breadcrumb">
            <li>
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
            </li>
            <li className="text-muted-foreground">/</li>
            <li>
              <Link href="/templates" className="text-muted-foreground hover:text-foreground transition-colors">
                Templates
              </Link>
            </li>
            <li className="text-muted-foreground">/</li>
            <li className="text-foreground font-medium truncate max-w-[200px]">
              {template.templateName}
            </li>
          </ol>
        </div>
      </nav>

      {/* Main Content */}
      <section className="py-6 lg:py-10 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Preview Section - Takes 3/5 of the width on desktop */}
            <div className="lg:col-span-3" data-testid="template-preview">
              {template.templateType === "video" ? (
                <div className="space-y-4">
                  <div className="aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl bg-black border border-border/30">
                    <iframe
                      className="w-full h-full"
                      src={youtubeVideoId 
                        ? `https://www.youtube.com/embed/${youtubeVideoId}?rel=0`
                        : "https://www.youtube.com/embed/WvfNvhFcjK8?rel=0"
                      }
                      title={template.templateName}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      data-testid="youtube-video"
                    />
                  </div>
                  
                  {/* Video info bar */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {template.durationSec && (
                        <Badge variant="secondary" className="gap-1.5">
                          <Clock className="w-3 h-3" />
                          {Math.floor(template.durationSec / 60)}:{String(template.durationSec % 60).padStart(2, '0')}
                        </Badge>
                      )}
                      <Badge variant="secondary">HD Quality</Badge>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                      <Share2 className="w-4 h-4" />
                      Share
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
                  {/* Main Card Preview */}
                  <div className="relative w-full max-w-[340px] lg:max-w-[380px]">
                    <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 p-4">
                      <div className="relative w-full h-full">
                        {pages.length > 1 && (
                          <>
                            <div className="absolute inset-0 rounded-xl shadow-lg transform rotate-2 translate-x-2 -translate-y-1 opacity-40 bg-card border border-border" />
                            <div className="absolute inset-0 rounded-xl shadow-lg transform -rotate-1 -translate-x-1 translate-y-1 opacity-60 bg-card border border-border" />
                          </>
                        )}
                        <div className="relative w-full h-full rounded-xl overflow-hidden shadow-xl border border-border/50 bg-white dark:bg-card">
                          <img
                            src={pages[selectedPageIndex]?.thumbnailUrl || template.thumbnailUrl}
                            alt={`${template.templateName} - Page ${selectedPageIndex + 1}`}
                            className="w-full h-full object-cover"
                            data-testid="card-preview-image"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                        </div>
                      </div>
                    </div>
                    
                    {pages.length > 1 && (
                      <div className="absolute top-6 left-6 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 text-white backdrop-blur-sm">
                        <Layers className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">{pages.length} pages</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Page Thumbnails */}
                  {pages.length > 1 && (
                    <div className="flex flex-col items-center gap-4">
                      <div className="flex lg:flex-col gap-2">
                        {pages.map((page: any, index: number) => (
                          <button
                            key={index}
                            onClick={() => setSelectedPageIndex(index)}
                            className={`flex-shrink-0 w-14 h-20 lg:w-16 lg:h-24 rounded-xl overflow-hidden border-2 transition-all duration-200 shadow-sm ${
                              selectedPageIndex === index 
                                ? 'border-primary ring-2 ring-primary/20 scale-105' 
                                : 'border-border hover:border-primary/50'
                            }`}
                            data-testid={`thumbnail-page-${index}`}
                          >
                            <img
                              src={page.thumbnailUrl || template.thumbnailUrl}
                              alt={`Page ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 rounded-full"
                          onClick={() => setSelectedPageIndex(prev => prev > 0 ? prev - 1 : pages.length - 1)}
                          data-testid="button-prev-page"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm text-muted-foreground font-medium min-w-[50px] text-center">
                          {selectedPageIndex + 1} / {pages.length}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 rounded-full"
                          onClick={() => setSelectedPageIndex(prev => prev < pages.length - 1 ? prev + 1 : 0)}
                          data-testid="button-next-page"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Info Section - Takes 2/5 of the width on desktop */}
            <div className="lg:col-span-2">
              <div className="lg:sticky lg:top-24 space-y-6">
                {/* Title and Price */}
                <div>
                  <Badge variant="secondary" className="mb-3">
                    {template.templateType === "video" ? "Video Invitation" : "Card Invitation"}
                  </Badge>
                  <h1 className="font-playfair text-2xl lg:text-3xl font-bold text-foreground mb-3" data-testid="text-template-title">
                    {template.templateName}
                  </h1>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-primary" data-testid="text-template-price">
                      {displayPrice}
                    </span>
                    <span className="text-sm text-muted-foreground line-through">₹2,499</span>
                  </div>
                </div>

                {/* Main CTA */}
                <Button
                  size="lg"
                  className="w-full h-14 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
                  onClick={() => navigate(`/editor/${template.slug}?from=template`)}
                  data-testid="button-customize-template"
                >
                  <Heart className="w-5 h-5 mr-2 fill-current" />
                  Start Free Customization
                </Button>

                {/* Features */}
                <div className="space-y-4 py-4 border-y">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Globe className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Multiple Languages</p>
                      <p className="text-xs text-muted-foreground">English, Hindi, Marathi, Gujarati, Tamil, Telugu</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Palette className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Fully Customizable</p>
                      <p className="text-xs text-muted-foreground">Edit text, photos, colors, music & more</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Download className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Instant Download</p>
                      <p className="text-xs text-muted-foreground">
                        {template.templateType === "video" 
                          ? "HD quality video file"
                          : "High resolution images"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Expert Create Card */}
                <Card className="p-5 bg-muted/30 border-dashed">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-foreground">Need help customizing?</span>
                    <span className="text-primary font-bold">{expertPrice}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">
                    Our design team will create a personalized invitation just for you.
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    data-testid="button-expert-create"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Expert Create
                  </Button>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What to do next */}
      <section className="py-10 lg:py-14 bg-muted/30 border-y">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-playfair text-xl lg:text-2xl font-bold text-foreground text-center mb-8">
            How to Create Your Invitation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto text-lg font-bold">
                1
              </div>
              <h3 className="font-semibold text-foreground">Customize</h3>
              <p className="text-sm text-muted-foreground">
                Click "Start Free Customization" and add your details, photos & music
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto text-lg font-bold">
                2
              </div>
              <h3 className="font-semibold text-foreground">Preview</h3>
              <p className="text-sm text-muted-foreground">
                Generate a free preview to check everything looks perfect
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto text-lg font-bold">
                3
              </div>
              <h3 className="font-semibold text-foreground">Download</h3>
              <p className="text-sm text-muted-foreground">
                Pay once and download your HD invitation to share anywhere
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Templates */}
      {relatedTemplates && relatedTemplates.length > 0 && (
        <section className="py-12 lg:py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-playfair text-xl lg:text-2xl font-bold text-foreground">
                You Might Also Like
              </h2>
              <Button variant="ghost" className="gap-2" asChild>
                <Link href="/templates">
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
              {relatedTemplates.map((t: any) => {
                const relatedPrice = formatPrice(t.priceInr || 0);
                const title = t.title || t.templateName || "Template";
                return (
                  <div 
                    key={t.id} 
                    className="group cursor-pointer"
                    onClick={() => navigate(`/template/${t.slug}`)}
                    data-testid={`related-template-${t.id}`}
                  >
                    <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-muted mb-3 shadow-md group-hover:shadow-xl transition-shadow">
                      <img
                        src={t.thumbnailUrl}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                        <Badge className="text-xs bg-black/60 text-white border-0">
                          {relatedPrice}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                      {title}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="py-12 lg:py-16 bg-muted/30 border-t">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-playfair text-xl lg:text-2xl font-bold text-foreground mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground text-sm">
              Everything you need to know about creating digital invitations
            </p>
          </div>
          
          <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b" data-testid={`faq-item-${index}`}>
                <AccordionTrigger className="text-left text-foreground hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="text-center mt-10">
            <p className="text-muted-foreground mb-4 text-sm">Still have questions?</p>
            <Button 
              variant="outline" 
              onClick={() => navigate('/contact')}
              data-testid="button-contact-us"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* Tags */}
      <section className="py-8 bg-background border-t">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-sm font-medium text-foreground mb-3">Related Tags</h3>
          <div className="flex flex-wrap gap-2" data-testid="seo-tags">
            {tags.map((tag) => (
              <span 
                key={tag} 
                className="text-sm text-muted-foreground px-3 py-1.5 bg-muted rounded-full hover:bg-muted/80 transition-colors cursor-pointer"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t shadow-lg lg:hidden z-50">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Starting at</p>
            <p className="text-lg font-bold text-primary">{displayPrice}</p>
          </div>
          <Button
            size="lg"
            className="flex-1 h-12 font-semibold"
            onClick={() => navigate(`/editor/${template.slug}?from=template`)}
            data-testid="button-mobile-customize"
          >
            Customize Now
          </Button>
        </div>
      </div>
      
      {/* Spacer for mobile sticky CTA */}
      <div className="h-24 lg:hidden" />
    </>
  );
}
