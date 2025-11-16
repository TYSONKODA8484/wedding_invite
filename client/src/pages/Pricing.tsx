import { SEOHead } from "@/components/SEOHead";
import { PricingCard } from "@/components/PricingCard";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Pricing() {
  const pricingTiers = [
    {
      name: "Free",
      price: 0,
      description: "Perfect for trying out our platform",
      features: [
        "1 video invitation per month",
        "720p HD quality",
        "Basic templates (50+)",
        "WeddingInvite.ai watermark",
        "WhatsApp sharing",
        "Community support",
      ],
      ctaText: "Get Started Free",
      ctaUrl: "/templates",
    },
    {
      name: "Personal",
      price: 29,
      period: "video",
      description: "Best for individual events",
      features: [
        "Unlimited customization",
        "4K Ultra HD quality",
        "All templates (500+)",
        "No watermark",
        "All sharing platforms",
        "AI voiceover (10+ languages)",
        "Custom music upload",
        "Priority support",
        "Commercial use rights",
      ],
      isPopular: true,
      ctaText: "Create Video",
      ctaUrl: "/templates",
    },
    {
      name: "Pro Creator",
      price: 99,
      period: "month",
      description: "For event planners and professionals",
      features: [
        "Everything in Personal",
        "10 videos per month",
        "Advanced AI editing",
        "Brand customization",
        "Team collaboration (3 members)",
        "Analytics dashboard",
        "Client management",
        "Bulk export options",
        "Priority rendering",
        "Dedicated account manager",
      ],
      ctaText: "Start Pro Trial",
      ctaUrl: "/templates",
    },
    {
      name: "Premium Studio",
      price: 299,
      description: "Custom cinematic video creation",
      features: [
        "Fully custom video production",
        "Professional videographer",
        "Script writing service",
        "Professional voiceover artist",
        "Original music composition",
        "Unlimited revisions",
        "7-10 day delivery",
        "Full commercial rights",
        "Dedicated project manager",
      ],
      ctaText: "Request Custom Video",
      ctaUrl: "/contact",
    },
  ];

  const faqs = [
    {
      question: "What file formats are supported?",
      answer: "All videos are exported in MP4 format (H.264 codec) optimized for social media platforms. You can download in 1080p HD or 4K UHD quality depending on your plan.",
    },
    {
      question: "How long does it take to create a video?",
      answer: "With our AI-powered editor, you can create and customize a video invitation in just 10-15 minutes. Rendering typically takes 2-5 minutes depending on video length and quality.",
    },
    {
      question: "Can I get a refund?",
      answer: "We offer a 14-day money-back guarantee on all paid plans. If you're not satisfied with your video, contact our support team for a full refund - no questions asked.",
    },
    {
      question: "How many revisions are included?",
      answer: "Personal and Pro Creator plans include unlimited self-service revisions. Premium Studio package includes unlimited revisions with our team until you're 100% satisfied.",
    },
    {
      question: "Which languages are supported for AI voiceover?",
      answer: "We support 20+ languages including English, Hindi, Tamil, Telugu, Punjabi, Arabic, Spanish, French, Mandarin, and more. Multiple accent options available for each language.",
    },
    {
      question: "Can I use my own music?",
      answer: "Yes! Personal, Pro Creator, and Premium Studio plans allow you to upload your own music. Please ensure you have proper rights to use the music in your video.",
    },
    {
      question: "What's included in Premium Studio?",
      answer: "Our Premium Studio service includes a dedicated videographer, script writer, professional voiceover artist, original music composition, and unlimited revisions until perfect. Delivery in 7-10 days.",
    },
    {
      question: "Can I share videos on WhatsApp?",
      answer: "Absolutely! All plans include optimized export for WhatsApp, Instagram Reels, Instagram Stories, TikTok, Facebook, and general download for any platform.",
    },
  ];

  return (
    <>
      <SEOHead
        title="Pricing Plans - Video Invitation Creator"
        description="Choose the perfect plan for creating cinematic video invitations. From free trial to premium custom video production. 14-day money-back guarantee."
        keywords="video invitation pricing, wedding video cost, invitation creator plans, premium video production"
      />

      <section className="py-16 md:py-24 lg:py-32 bg-gradient-to-b from-background to-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h1 className="font-playfair text-5xl lg:text-6xl font-bold text-foreground mb-4">
              Choose Your Plan
            </h1>
            <p className="text-muted-foreground text-lg lg:text-xl max-w-2xl mx-auto">
              Create stunning video invitations at any budget. Start free or unlock premium features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16">
            {pricingTiers.map((tier) => (
              <PricingCard key={tier.name} {...tier} />
            ))}
          </div>

          <div className="max-w-4xl mx-auto">
            <h2 className="font-playfair text-3xl lg:text-4xl font-bold text-foreground mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-semibold text-foreground">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </>
  );
}
