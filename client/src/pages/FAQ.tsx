import { SEOHead } from "@/components/SEOHead";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";

export default function FAQ() {
  const categories = [
    {
      title: "Getting Started",
      faqs: [
        {
          question: "How do I create my first video invitation?",
          answer: "Simply browse our template library, select a template you love, click 'Use Template', and follow the customization wizard. Add your event details, upload photos, select music, and preview your video. The entire process takes about 10-15 minutes!",
        },
        {
          question: "Do I need video editing experience?",
          answer: "Not at all! WeddingInvite.ai is designed for everyone. Our AI-powered editor handles all the technical aspects automatically. Just add your content and let our platform create a professional video for you.",
        },
        {
          question: "Can I try before I buy?",
          answer: "Yes! We offer a free plan that lets you create 1 video per month in 720p HD quality. It's perfect for testing our platform before committing to a paid plan.",
        },
      ],
    },
    {
      title: "Features & Customization",
      faqs: [
        {
          question: "What can I customize in the templates?",
          answer: "You can customize text (names, dates, venues, messages), upload your own photos, choose or upload music, select AI voiceover language and accent, adjust colors to match your theme, and control scene timing and transitions.",
        },
        {
          question: "How many photos can I add?",
          answer: "The number of photos depends on the template, typically ranging from 5-15 photos. Each template is designed to showcase your photos beautifully without overwhelming viewers.",
        },
        {
          question: "Can I use my own music?",
          answer: "Yes! Personal, Pro Creator, and Premium Studio plans allow you to upload your own music. Please ensure you have the rights to use the music. We also offer a curated library of licensed music.",
        },
        {
          question: "Which languages are supported for AI voiceover?",
          answer: "We support 20+ languages including English, Hindi, Tamil, Telugu, Punjabi, Bengali, Gujarati, Marathi, Arabic, Spanish, French, Mandarin, Portuguese, and more. Multiple accent options are available for each language.",
        },
      ],
    },
    {
      title: "Pricing & Plans",
      faqs: [
        {
          question: "What's included in the Free plan?",
          answer: "The Free plan includes 1 video per month in 720p HD quality, access to 50+ basic templates, WhatsApp sharing, and community support. Videos include a small WeddingInvite.ai watermark.",
        },
        {
          question: "What's the difference between Personal and Pro Creator?",
          answer: "Personal ($29/video) is perfect for individual events with unlimited customization and 4K quality. Pro Creator ($99/month) is designed for professionals, offering 10 videos/month, advanced AI editing, team collaboration, client management, and analytics.",
        },
        {
          question: "Do you offer refunds?",
          answer: "Yes! We offer a 14-day money-back guarantee on all paid plans. If you're not satisfied with your video, contact our support team for a full refund - no questions asked.",
        },
        {
          question: "Can I upgrade or downgrade my plan?",
          answer: "Yes, you can change your plan at any time. Upgrades take effect immediately, and downgrades will apply at the start of your next billing cycle.",
        },
      ],
    },
    {
      title: "Technical & Delivery",
      faqs: [
        {
          question: "What file formats do you support?",
          answer: "All videos are exported in MP4 format (H.264 codec) optimized for social media platforms. You can download in 1080p HD or 4K UHD quality depending on your plan.",
        },
        {
          question: "How long does rendering take?",
          answer: "Most videos render in 2-5 minutes depending on length and quality. 4K videos may take up to 10 minutes. Pro Creator members get priority rendering for faster turnaround.",
        },
        {
          question: "Can I share on WhatsApp?",
          answer: "Absolutely! All videos are optimized for WhatsApp sharing. We provide the right file size and format for seamless sharing. Videos are also optimized for Instagram Reels, Instagram Stories, TikTok, and Facebook.",
        },
        {
          question: "What video quality do you offer?",
          answer: "Free plan offers 720p HD. Paid plans include 1080p Full HD and 4K Ultra HD options. All videos are rendered at 30fps for smooth playback across devices.",
        },
      ],
    },
    {
      title: "Support & Revisions",
      faqs: [
        {
          question: "How many revisions can I make?",
          answer: "Personal and Pro Creator plans include unlimited self-service revisions. You can edit and re-render your video as many times as needed. Premium Studio package includes unlimited revisions with our team.",
        },
        {
          question: "What if I need help?",
          answer: "We offer email support for all users (response within 24 hours), priority support for paid plans (response within 4 hours), and dedicated account managers for Enterprise clients. We also have detailed video tutorials and help articles.",
        },
        {
          question: "Can you create a custom template for me?",
          answer: "Yes! Our Premium Studio service ($299) includes custom video production with a professional videographer, script writing, original music composition, and unlimited revisions. Delivery in 7-10 days.",
        },
      ],
    },
  ];

  return (
    <>
      <SEOHead
        title="FAQ - Frequently Asked Questions"
        description="Find answers to common questions about WeddingInvite.ai. Learn about pricing, features, file formats, customization options, and more."
        keywords="WeddingInvite.ai FAQ, video invitation questions, help, support, frequently asked questions"
      />

      <section className="py-16 md:py-24 lg:py-32 bg-gradient-to-b from-background to-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h1 className="font-playfair text-5xl lg:text-6xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-muted-foreground text-lg lg:text-xl">
              Everything you need to know about WeddingInvite.ai
            </p>
          </div>

          <div className="space-y-12">
            {categories.map((category, categoryIndex) => (
              <Card key={categoryIndex} className="p-8">
                <h2 className="font-playfair text-2xl lg:text-3xl font-bold text-foreground mb-6">
                  {category.title}
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  {category.faqs.map((faq, faqIndex) => (
                    <AccordionItem key={faqIndex} value={`item-${categoryIndex}-${faqIndex}`}>
                      <AccordionTrigger className="text-left font-semibold text-foreground">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Card>
            ))}
          </div>

          <Card className="mt-12 p-8 lg:p-12 text-center bg-primary/5">
            <h2 className="font-playfair text-2xl lg:text-3xl font-bold text-foreground mb-4">
              Still Have Questions?
            </h2>
            <p className="text-muted-foreground text-lg mb-6">
              Can't find the answer you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-6 py-3 font-semibold hover-elevate active-elevate-2 transition-all"
                data-testid="link-contact-support"
              >
                Contact Support
              </a>
              <a
                href="mailto:support@weddinginvite.ai"
                className="inline-flex items-center justify-center rounded-md border border-border bg-background text-foreground px-6 py-3 font-semibold hover-elevate active-elevate-2 transition-all"
                data-testid="link-email-support"
              >
                Email Us
              </a>
            </div>
          </Card>
        </div>
      </section>
    </>
  );
}
