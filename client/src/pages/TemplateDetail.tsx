import { useRoute, useLocation } from "wouter";
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
  Phone
} from "lucide-react";
import type { Template } from "@shared/schema";

// Helper function to extract YouTube video ID from various URL formats
function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  
  // Handle different YouTube URL formats:
  // - https://www.youtube.com/watch?v=VIDEO_ID
  // - https://youtu.be/VIDEO_ID
  // - https://www.youtube.com/embed/VIDEO_ID
  // - https://youtube.com/shorts/VIDEO_ID
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
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
  
  // Extract YouTube video ID from previewVideoUrl if it's a YouTube link
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
    },
    {
      question: "Can I get a copy of the Video File?",
      answer: "Yes, once you complete the payment, you'll receive a high-quality MP4 video file that you can download and share via WhatsApp, email, or any other platform."
    },
    {
      question: "Is WeddingInvite.ai secure?",
      answer: "Yes, we use industry-standard encryption and secure payment gateways (Razorpay) to protect your data. Your personal information and payment details are always safe with us."
    }
  ];

  return (
    <>
      <SEOHead
        title={`${template.templateName} | ${templateType} Video Invitation`}
        description={`${template.templateName} - Beautiful ${templateType} video invitation template. Perfect for WhatsApp sharing. Download in HD. ${displayPrice}.`}
        keywords={tags.join(", ")}
        schema={[videoSchema, productSchema]}
        ogImage={template.thumbnailUrl}
      />

      <section className="py-4 lg:py-6 bg-background border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <div 
              className="w-full lg:flex-[2] lg:max-w-[550px]"
              data-testid="template-preview"
            >
              <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-lg bg-black">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/WvfNvhFcjK8?rel=0"
                  title={template.templateName}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  data-testid="youtube-video"
                />
              </div>
              
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">
                  This {template.templateName} video will best fit & visible on every screen. Easy to share, Try this new, elegant, and unique style of invitation.
                </p>
                <button 
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-primary text-sm font-medium mt-2 hover:underline"
                  data-testid="button-show-more"
                >
                  {showFullDescription ? 'Show Less' : 'Show More'}
                </button>
                {showFullDescription && (
                  <p className="text-sm text-muted-foreground mt-2">{description}</p>
                )}
              </div>
            </div>

            <div className="lg:flex-1">
              <h1 className="text-xl lg:text-2xl font-bold text-foreground mb-2" data-testid="text-template-title">
                {template.templateName}
              </h1>
              
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm text-muted-foreground capitalize">{templateType}</span>
                <span className="text-xl font-bold text-primary" data-testid="text-template-price">
                  {displayPrice}
                </span>
              </div>

              <Button
                size="lg"
                className="w-full mb-5 h-11 text-sm font-semibold rounded-full"
                onClick={() => navigate(`/editor/${template.slug}?from=template`)}
                data-testid="button-customize-template"
              >
                <Heart className="w-4 h-4 mr-2 fill-current" />
                Start Free Customization
              </Button>

              <div className="space-y-3 mb-5">
                <div className="flex items-start gap-3">
                  <Globe className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">
                    Create In : <span className="text-muted-foreground">English , हिन्दी , मराठी , ગુજરાતી , தமிழ் , తెలుగు</span>
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Palette className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">Change your card's text, style, envelope, backdrop and more</span>
                </div>
                <div className="flex items-start gap-3">
                  <Download className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">Download high quality video.</span>
                </div>
              </div>

              <Card className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-foreground text-sm italic">Prefer to let the experts handle it?</span>
                  <span className="text-primary font-bold">{expertPrice}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  Our expert graphic design team is ready to help! Contact us, and we'll craft it perfectly for you.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  data-testid="button-expert-create"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Expert Create
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-6 lg:py-8 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">What to do next ?</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-white" />
              </div>
              <p className="text-sm text-foreground">Click on "Customize by myself video" to edit video yourself.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-white" />
              </div>
              <p className="text-sm text-foreground">Upload your event details, photos and music and click on "Preview video" to create video.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-white" />
              </div>
              <p className="text-sm text-foreground">System will create the video in minutes and provide an instant preview.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-white" />
              </div>
              <p className="text-sm text-foreground">Click on "Expert create" to request 247Invites team to create video for you with additional customization.</p>
            </div>
          </div>
        </div>
      </section>

      {relatedTemplates && relatedTemplates.length > 0 && (
        <section className="py-8 lg:py-12 bg-background border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-foreground text-center mb-8 uppercase tracking-wide">
              You Might Also Like
            </h2>
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
                    <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-muted mb-3">
                      <img
                        src={t.thumbnailUrl}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-primary" />
                        <span className="text-xs text-primary font-medium">Premium invite</span>
                      </div>
                      <span className="text-sm font-semibold text-foreground">{relatedPrice}</span>
                    </div>
                    <p className="text-sm text-foreground line-clamp-2">{title}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="py-8 lg:py-12 bg-background border-t">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-foreground text-center mb-2 uppercase tracking-wide">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-center text-sm mb-8">
            Everything you need to know about creating digital invitations
          </p>
          
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} data-testid={`faq-item-${index}`}>
                <AccordionTrigger className="text-left text-foreground hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="text-center mt-8">
            <p className="text-muted-foreground mb-3">Didn't find your answer?</p>
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

      <section className="py-6 lg:py-8 bg-background border-t">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-sm font-medium text-foreground mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2" data-testid="seo-tags">
            {tags.map((tag) => (
              <span 
                key={tag} 
                className="text-sm text-muted-foreground px-3 py-1 bg-muted rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
