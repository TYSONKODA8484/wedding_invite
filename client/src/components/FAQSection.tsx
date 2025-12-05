import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title?: string;
  subtitle?: string;
  faqs: FAQItem[];
  showSchema?: boolean;
}

export function FAQSection({ 
  title = "Frequently Asked Questions", 
  subtitle,
  faqs,
  showSchema = true 
}: FAQSectionProps) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <section className="py-16 md:py-24" id="faq">
      {showSchema && (
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border rounded-lg px-6 bg-card"
                data-testid={`faq-item-${index}`}
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

export const homeFAQs: FAQItem[] = [
  {
    question: "How do I create a wedding video invitation?",
    answer: "Simply browse our template collection, choose a design that matches your wedding style, customize it with your details, photos, and music, then download and share via WhatsApp or any messaging platform. The entire process takes just minutes!"
  },
  {
    question: "Can I share my invitation on WhatsApp?",
    answer: "Yes! All our wedding video invitations are optimized for WhatsApp sharing. The video files are compressed for quick sharing while maintaining excellent quality. You can also share via Instagram, Facebook, email, or any other platform."
  },
  {
    question: "Do you have templates for Indian weddings?",
    answer: "Yes, we offer a wide variety of templates specifically designed for Indian weddings including Punjabi, South Indian (Tamil, Telugu, Kannada), Marathi, Bengali, Gujarati, and North Indian styles. We also have ceremony-specific templates for Mehendi, Sangeet, Haldi, Engagement, and Reception."
  },
  {
    question: "Are templates available for Arabic and Gulf weddings?",
    answer: "Absolutely! We have elegant templates designed for UAE, Saudi Arabian, and Gulf region weddings with traditional Arabic calligraphy, Islamic patterns, and bilingual English-Arabic support. Our designs respect cultural traditions while offering modern aesthetics."
  },
  {
    question: "What is included in the template price?",
    answer: "Each template includes full customization rights, high-quality video download, WhatsApp-optimized format, background music options, and the ability to add your photos and text. You get unlimited edits before final download."
  },
  {
    question: "Can I add my own music to the invitation?",
    answer: "Yes! You can choose from our curated library of royalty-free wedding music or upload your own custom music track. This allows you to personalize your invitation with songs that are meaningful to you."
  },
  {
    question: "How long does it take to create an invitation?",
    answer: "Most couples complete their invitation in 10-15 minutes. Our easy-to-use editor lets you customize text, add photos, choose music, and preview your video in real-time. Once you're satisfied, you can download immediately."
  },
  {
    question: "Do you offer refunds?",
    answer: "We offer free previews so you can see exactly what your invitation will look like before purchasing. Due to the digital nature of our products, we process refunds on a case-by-case basis. Please contact our support team if you have any concerns."
  }
];

export const howItWorksFAQs: FAQItem[] = [
  {
    question: "How does the customization process work?",
    answer: "After selecting a template, you'll enter our easy-to-use editor where you can modify text fields, add your photos, choose background music, and adjust colors. Changes are shown in real-time so you can preview exactly how your invitation will look."
  },
  {
    question: "Can I edit my invitation after creating it?",
    answer: "Yes! Your project is saved automatically. You can return anytime to make changes before downloading the final version. This is perfect if you need to update dates, add more events, or make any corrections."
  },
  {
    question: "What file format will I receive?",
    answer: "You'll receive a high-quality MP4 video file optimized for sharing. The file is compressed for quick WhatsApp sharing while maintaining excellent video quality that looks great on all devices."
  },
  {
    question: "How do I share my invitation with guests?",
    answer: "After downloading, you can share your video invitation directly through WhatsApp, Instagram, Facebook, email, or any messaging platform. Simply attach the video file and send to your guests individually or in groups."
  },
  {
    question: "Can I create invitations for multiple events?",
    answer: "Yes! Many of our templates support multiple pages for different wedding events like Mehendi, Sangeet, Wedding Ceremony, and Reception. You can create one comprehensive invitation that covers all your celebrations."
  }
];

export const templatesFAQs: FAQItem[] = [
  {
    question: "What types of templates do you offer?",
    answer: "We offer video invitation templates and digital card templates for weddings, engagements, birthdays, and other celebrations. Our collection includes designs for Indian, Arabic, Western, and fusion weddings with various cultural and ceremonial themes."
  },
  {
    question: "How do I choose the right template?",
    answer: "Browse our collection by category (Wedding, Birthday), culture (Indian, Arabic), or style (Traditional, Modern). Use our filter options to narrow down by template type, photo options, and orientation. You can preview any template before customizing."
  },
  {
    question: "Are the templates customizable?",
    answer: "Every template is fully customizable. You can change text, add your photos, select different music, and adjust the design to match your preferences. Our editor makes it easy to personalize every element."
  },
  {
    question: "Can I preview a template before purchasing?",
    answer: "Yes! You can fully customize any template and preview your personalized video with a watermark before making a purchase. This ensures you're completely satisfied with your design before paying."
  },
  {
    question: "What makes your templates different?",
    answer: "Our templates are designed specifically for cultural weddings with authentic traditional elements. We focus on Indian and Middle Eastern markets with proper cultural details, bilingual support, and designs that respect traditions while embracing modern aesthetics."
  }
];
