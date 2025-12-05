import { useRoute, Link } from "wouter";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Clock, 
  Share2, 
  Facebook, 
  Twitter, 
  Linkedin,
  ChevronRight
} from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

import homepageHero from "@assets/generated_images/Homepage_cinematic_wedding_hero_efb94fa0.png";
import indianPunjabiHero from "@assets/generated_images/Indian_Punjabi_wedding_culture_b8245c44.png";
import arabicHero from "@assets/generated_images/Arabic_UAE_wedding_culture_5fdde5ea.png";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  authorBio: string;
  category: string;
  publishedAt: string;
  readTime: string;
  thumbnailUrl: string;
  tags: string[];
}

const articles: Article[] = [
  {
    id: "1",
    title: "10 Wedding Video Invitation Trends for 2024",
    slug: "wedding-video-invitation-trends-2024",
    excerpt: "Discover the hottest trends in wedding video invitations, from AI-generated content to culturally authentic designs.",
    content: `
## The Evolution of Wedding Video Invitations

Wedding video invitations have transformed from simple digital cards to cinematic experiences that capture the essence of your love story. In 2024, couples are embracing innovative technologies and cultural authenticity like never before.

### 1. AI-Powered Personalization

Artificial intelligence is revolutionizing how couples create their wedding invitations. From automated photo enhancement to intelligent text suggestions, AI helps create professional-looking invitations in minutes.

### 2. Cinematic Quality on Mobile

With smartphone cameras improving dramatically, couples can now create cinema-quality invitation videos using just their phones. The trend is moving towards authentic, heartfelt content over overly produced videos.

### 3. Cultural Fusion Designs

Modern couples are blending traditional elements from multiple cultures. Indian-Western fusion, Arabic-Modern combinations, and multicultural celebrations are reflected in invitation designs.

### 4. Interactive Elements

QR codes, clickable RSVPs, and embedded maps are becoming standard features. Guests can respond to invitations, add events to their calendars, and get directions—all from the invitation itself.

### 5. Sustainable Digital Alternatives

Environmental consciousness is driving more couples to choose digital invitations over paper. Video invitations offer a zero-waste alternative that's both beautiful and eco-friendly.

### 6. Music Integration

Custom soundtracks and meaningful songs are being integrated into video invitations. Platforms like WeddingInvite.ai offer curated music libraries specifically designed for wedding celebrations.

### 7. WhatsApp-First Design

In regions like India and the Middle East, WhatsApp is the primary sharing platform. Video invitations are now optimized for WhatsApp sharing with perfect compression and preview thumbnails.

### 8. Multiple Event Coverage

Video invitations now cover entire wedding celebrations—from engagement to reception. Multi-page video invitations let couples showcase all their events in one beautiful package.

### 9. Real-Time Editing

Cloud-based editors allow couples to make last-minute changes easily. Whether it's updating venue details or adding a new event, modern platforms support real-time collaboration.

### 10. Premium Templates for Every Culture

From South Indian temple weddings to Arabic Zaffa celebrations, premium templates now cater to specific cultural traditions with authentic designs and appropriate color palettes.

## Conclusion

The wedding invitation industry is evolving rapidly. Whether you choose a traditional approach or embrace the latest technology, the goal remains the same: to share your joy with loved ones in a memorable way.

Ready to create your perfect wedding video invitation? [Browse our templates](/templates/wedding) to find the design that speaks to your love story.
    `,
    author: "Sophia Martinez",
    authorBio: "Wedding industry expert with 10+ years of experience in digital invitation design.",
    category: "Trends",
    publishedAt: "Dec 15, 2024",
    readTime: "8 min read",
    thumbnailUrl: homepageHero,
    tags: ["wedding trends", "video invitations", "2024 weddings", "digital invitations"],
  },
  {
    id: "2",
    title: "Guide to Planning a Traditional Indian Wedding",
    slug: "traditional-indian-wedding-planning-guide",
    excerpt: "Everything you need to know about planning an authentic Indian wedding celebration with traditional ceremonies and modern touches.",
    content: `
## Planning Your Traditional Indian Wedding

An Indian wedding is a vibrant celebration that spans multiple days, filled with rich traditions, colorful ceremonies, and joyous festivities. This comprehensive guide will help you plan an authentic Indian wedding while incorporating modern conveniences.

### Understanding Indian Wedding Ceremonies

#### Pre-Wedding Ceremonies

**Roka/Engagement**: The formal announcement of the couple's intention to marry, often involving ring exchange and family blessings.

**Mehndi**: A beautiful ceremony where intricate henna designs are applied to the bride's hands and feet.

**Sangeet**: A musical night filled with dancing, singing, and family performances.

**Haldi**: A cleansing ceremony where turmeric paste is applied to the bride and groom.

#### The Wedding Day

**Baraat**: The groom's procession, traditionally on a horse or elephant, accompanied by music and dancing.

**Jaimala**: Exchange of flower garlands between bride and groom.

**Pheras**: The seven sacred vows taken around the holy fire.

**Vidaai**: The emotional farewell as the bride leaves her parental home.

### Regional Variations

#### North Indian Weddings
- Elaborate Baraat processions
- Chunni ceremony
- Joota chupai (shoe hiding game)

#### South Indian Weddings
- Temple ceremonies
- Muhurtham timing
- Thali (Mangalsutra) ceremony
- Saree draping traditions

#### Punjabi Weddings
- Chooda ceremony
- Kalire tradition
- Energetic Bhangra performances

### Modern Touches

Today's Indian couples are blending tradition with modernity:

1. **Digital Invitations**: Video invitations that showcase cultural elements
2. **Destination Weddings**: Traditional ceremonies in exotic locations
3. **Fusion Attire**: Western elements mixed with traditional wear
4. **Technology Integration**: Live streaming for distant relatives

### Budgeting Tips

Indian weddings can be elaborate affairs. Here's how to manage costs:

- Prioritize must-have ceremonies
- Consider off-season dates
- Negotiate package deals with vendors
- Use digital solutions for invitations and RSVPs

### Creating Your Wedding Invitation

Your invitation sets the tone for your celebration. Include:

- All ceremony dates and timings
- Venue addresses with maps
- Dress code for each event
- RSVP information

[Create your Indian wedding video invitation](/culture/indian-wedding-video-invitation) with our authentic templates.

## Conclusion

An Indian wedding is a once-in-a-lifetime celebration of love, family, and tradition. With careful planning and the right resources, you can create a memorable event that honors your heritage while reflecting your unique love story.
    `,
    author: "Priya Sharma",
    authorBio: "Cultural wedding consultant specializing in traditional Indian ceremonies.",
    category: "Cultural Guides",
    publishedAt: "Dec 10, 2024",
    readTime: "12 min read",
    thumbnailUrl: indianPunjabiHero,
    tags: ["indian wedding", "traditional wedding", "wedding planning", "hindu wedding"],
  },
  {
    id: "3",
    title: "How to Create Cinematic Wedding Videos on Budget",
    slug: "create-cinematic-wedding-videos-budget",
    excerpt: "Professional tips for creating stunning cinematic wedding video invitations without breaking the bank.",
    content: `
## Creating Cinematic Wedding Videos on a Budget

You don't need a Hollywood budget to create stunning wedding video invitations. With the right techniques and tools, you can achieve cinematic quality that impresses your guests.

### Equipment Essentials

#### Smartphone Filming
Modern smartphones can capture incredible footage:
- Use the highest resolution available (4K if possible)
- Stabilize with a gimbal or tripod
- Film during golden hour for beautiful lighting
- Clean your lens before filming

#### Lighting Tips
- Natural light is your best friend
- Film outdoors during sunrise or sunset
- Use reflectors to fill shadows
- Avoid harsh midday sun

### Composition Techniques

#### Rule of Thirds
Place your subjects at intersection points for visually pleasing compositions.

#### Leading Lines
Use paths, fences, or architectural elements to draw attention to your subjects.

#### Depth of Field
Create cinematic blur by:
- Standing back and zooming in
- Using portrait mode on newer phones
- Filming at wider apertures if using a camera

### Free and Affordable Tools

#### Editing Software
- **DaVinci Resolve**: Professional-grade, completely free
- **CapCut**: Mobile-friendly with great effects
- **Canva Video**: Easy drag-and-drop editing

#### Music Resources
- Royalty-free music libraries
- Platform-provided soundtracks (like WeddingInvite.ai's music library)
- Creative Commons licensed tracks

### Budget-Saving Tips

1. **DIY Pre-Wedding Shoots**: Film your own engagement sessions
2. **Use Templates**: Start with professionally designed templates
3. **Batch Your Filming**: Capture all footage in one session
4. **Leverage Natural Settings**: Parks, beaches, and gardens are free
5. **Ask Talented Friends**: Many people have hidden creative skills

### The Power of Templates

Wedding video invitation platforms like WeddingInvite.ai offer:
- Professionally designed templates
- Built-in music libraries
- Easy customization tools
- Multiple page support
- WhatsApp-optimized output

### Post-Production Magic

#### Color Grading
Apply cinematic color presets to give your footage that professional look.

#### Sound Design
- Layer subtle ambient sounds
- Use music that matches your wedding mood
- Ensure audio levels are balanced

#### Text and Graphics
- Use elegant, readable fonts
- Keep text minimal and impactful
- Match graphics to your wedding theme

## Conclusion

Creating a cinematic wedding video invitation doesn't require expensive equipment or professional skills. With smartphone cameras, free editing tools, and platform templates, you can create something truly beautiful.

[Start creating your cinematic invitation](/templates/wedding) today with our easy-to-use platform.
    `,
    author: "Michael Chen",
    authorBio: "Videographer and content creator helping couples tell their love stories.",
    category: "Tips & Tricks",
    publishedAt: "Dec 5, 2024",
    readTime: "10 min read",
    thumbnailUrl: homepageHero,
    tags: ["video tips", "budget wedding", "DIY wedding", "cinematic video"],
  },
  {
    id: "4",
    title: "Arabic Wedding Traditions: A Complete Guide",
    slug: "arabic-wedding-traditions-complete-guide",
    excerpt: "Explore the rich traditions of Arabic weddings from engagement to Zaffa procession and everything in between.",
    content: `
## Arabic Wedding Traditions: A Complete Guide

Arabic weddings are magnificent celebrations that blend ancient traditions with modern elegance. From the UAE to Saudi Arabia, these weddings are known for their grandeur, hospitality, and deep-rooted customs.

### The Engagement (Khetbeh)

The journey begins with the **Khetbeh**, where the groom's family formally asks for the bride's hand. This involves:

- Formal meeting of both families
- Discussion of mahr (bride's gift)
- Exchange of rings
- Reading of Al-Fatiha (opening chapter of Quran)

### Pre-Wedding Celebrations

#### Henna Night (Laylat Al-Henna)
A joyous women-only celebration featuring:
- Intricate henna designs for the bride
- Traditional songs and dances
- Sweets and refreshments
- Quality time with female relatives

#### Bridal Preparation
The bride undergoes beauty rituals including:
- Hammam (traditional bath)
- Professional makeup and styling
- Trying on her wedding attire
- Final dress fittings

### The Wedding Day

#### The Zaffa Procession
The iconic Arabic wedding procession features:
- Professional dancers and musicians
- Drummers and traditional instruments
- The couple's grand entrance
- Family and friends joining the celebration

#### The Ceremony
Arabic wedding ceremonies include:
- Reading of the marriage contract (Aqd)
- Exchange of vows and rings
- Blessings from religious leaders
- First dance as married couple

### Regional Variations

#### UAE Weddings
- Lavish hotel venues
- Separate celebrations for men and women
- Elaborate bridal entrances
- Traditional Emirati dances

#### Saudi Arabian Weddings
- Grand ballroom celebrations
- Traditional Ardha dance
- Generous hospitality
- Multiple-day festivities

#### Gulf Region Customs
- Pearl and gold decorations
- Traditional incense burning
- Arabic coffee ceremonies
- Date palm motifs

### Modern Arabic Weddings

Today's couples blend tradition with contemporary elements:

1. **Digital Invitations**: Video invitations with Arabic calligraphy
2. **International Venues**: Destination weddings worldwide
3. **Designer Attire**: International designers with Arabic flair
4. **Technology**: Live streaming for international guests

### Creating Your Arabic Wedding Invitation

Your invitation should reflect:
- Elegant Arabic typography
- Gold and rich color palettes
- Both Arabic and English text
- All event details and dress codes

[Create your Arabic wedding video invitation](/culture/arabic-wedding-video-uae-saudi) with our authentic templates.

## Conclusion

Arabic weddings are a beautiful blend of tradition, family, and celebration. Whether you're planning a traditional ceremony or a modern fusion event, these customs create memories that last a lifetime.
    `,
    author: "Fatima Al-Hassan",
    authorBio: "Wedding planner specializing in traditional Arabic celebrations across the Gulf region.",
    category: "Cultural Guides",
    publishedAt: "Nov 28, 2024",
    readTime: "11 min read",
    thumbnailUrl: arabicHero,
    tags: ["arabic wedding", "UAE wedding", "Saudi wedding", "gulf wedding", "zaffa"],
  },
  {
    id: "5",
    title: "5 Ways AI is Revolutionizing Wedding Invitations",
    slug: "ai-revolutionizing-wedding-invitations",
    excerpt: "How artificial intelligence is transforming the way couples create and share their wedding invitations.",
    content: `
## 5 Ways AI is Revolutionizing Wedding Invitations

Artificial intelligence is no longer just a futuristic concept—it's actively transforming how couples create, personalize, and share their wedding invitations. Here's how AI is making wedding planning easier and more creative than ever.

### 1. Smart Photo Enhancement

AI-powered tools can automatically:
- Enhance photo quality and resolution
- Remove unwanted background elements
- Adjust lighting and color balance
- Apply professional-grade filters

Gone are the days of needing a professional photographer for every invitation photo. AI can transform casual snapshots into stunning visuals.

### 2. Intelligent Text Suggestions

Modern AI can help craft the perfect wedding invitation text:
- Suggest elegant wording for different ceremony types
- Translate content into multiple languages
- Ensure cultural appropriateness
- Check grammar and spelling automatically

### 3. Personalized Design Recommendations

AI algorithms analyze your preferences to:
- Suggest color palettes that match your theme
- Recommend fonts that complement your style
- Propose layouts based on your content
- Adapt designs for different cultures

### 4. Automated Video Creation

AI-powered video platforms can:
- Generate smooth transitions between scenes
- Sync photos and videos to music automatically
- Add professional motion graphics
- Optimize output for different platforms (WhatsApp, Instagram, etc.)

### 5. Smart Guest Management

AI enhances the invitation process by:
- Tracking RSVPs automatically
- Sending personalized reminders
- Managing dietary preferences
- Organizing seating suggestions

### The Future of AI in Wedding Invitations

We're just scratching the surface. Future developments may include:
- Real-time 3D venue previews
- Voice-activated customization
- Augmented reality invitation experiences
- Predictive guest behavior analysis

### Finding the Right Balance

While AI offers incredible capabilities, the best wedding invitations still need a human touch:
- Personal stories and memories
- Family traditions and customs
- Authentic emotional content
- Unique couple personalities

### Platforms Leading the Way

Modern invitation platforms like WeddingInvite.ai combine AI capabilities with:
- Culturally authentic templates
- Easy-to-use editors
- Multiple language support
- WhatsApp optimization

## Conclusion

AI is democratizing wedding invitation design, making professional-quality results accessible to everyone. The technology handles the technical complexity, freeing couples to focus on what matters most: celebrating their love.

[Experience AI-powered invitation creation](/templates/wedding) with our platform.
    `,
    author: "David Park",
    authorBio: "Technology journalist covering AI applications in lifestyle and events.",
    category: "Technology",
    publishedAt: "Nov 20, 2024",
    readTime: "7 min read",
    thumbnailUrl: homepageHero,
    tags: ["AI", "technology", "wedding tech", "innovation", "digital invitations"],
  },
  {
    id: "6",
    title: "Nigerian Wedding Customs: Colors, Dances, and Joy",
    slug: "nigerian-wedding-customs-guide",
    excerpt: "A vibrant journey through Nigerian wedding traditions, from Ankara fabrics to traditional dances.",
    content: `
## Nigerian Wedding Customs: Colors, Dances, and Joy

Nigerian weddings are legendary celebrations known for their vibrant colors, energetic music, and deep cultural significance. This guide explores the rich traditions that make Nigerian weddings unforgettable.

### Pre-Wedding Ceremonies

#### Introduction Ceremony
The first formal meeting between families:
- Groom's family visits bride's family
- Exchange of gifts and kola nuts
- Discussion of bride price
- Formal blessing requests

#### Traditional Engagement
A colorful celebration featuring:
- Matching Aso Ebi (family uniform) outfits
- Traditional dances and performances
- Exchange of engagement items
- Prayers and blessings

### The Wedding Attire

#### Bride's Attire
Nigerian brides often change outfits multiple times:
- Traditional wrapper and blouse (Iro and Buba)
- Elaborate Gele (head wrap)
- Coral beads and gold jewelry
- White wedding gown for ceremony

#### Groom's Attire
Grooms dress equally magnificently in:
- Agbada (flowing robe)
- Fila (traditional cap)
- Aso Oke fabric
- Beaded accessories

### Traditional Ceremonies

#### Yoruba Weddings
- Engagement letter reading
- Wine carrying ceremony
- Prostration of the groom
- Blessing from elders

#### Igbo Weddings
- Wine carrying by the bride
- Breaking of kola nut
- Igba Nkwu ceremony
- Traditional dances

#### Hausa Weddings
- Kayan Zance gifts
- Walima celebration
- Traditional music
- Islamic prayers

### Music and Dance

Nigerian weddings feature incredible entertainment:
- Live band performances
- Traditional drummers
- Juju music
- Afrobeats DJs
- Professional dancers

### The Aso Ebi Tradition

Aso Ebi means "family cloth":
- Families wear matching fabrics
- Shows unity and support
- Creates stunning visual impact
- Often custom-made for the event

### Modern Nigerian Weddings

Contemporary couples blend traditions with:
- Destination wedding locations
- Professional photography/videography
- Social media documentation
- Luxury venue choices
- Celebrity performances

### Creating Your Nigerian Wedding Invitation

Your invitation should capture:
- Vibrant African patterns
- Rich color combinations
- All ceremony details
- Traditional and modern elements

[Explore our African wedding templates](/culture/nigerian-traditional-wedding-video) for authentic designs.

## Conclusion

Nigerian weddings are celebrations of life, love, and community. The fusion of traditional customs with modern elements creates events that are both culturally meaningful and incredibly memorable.
    `,
    author: "Chioma Okonkwo",
    authorBio: "Nigerian event planner and cultural traditions expert based in Lagos.",
    category: "Cultural Guides",
    publishedAt: "Nov 15, 2024",
    readTime: "9 min read",
    thumbnailUrl: indianPunjabiHero,
    tags: ["nigerian wedding", "african wedding", "yoruba", "igbo", "cultural wedding"],
  },
];

export default function ArticlePage() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug;
  
  const article = articles.find(a => a.slug === slug);
  
  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-6">The article you're looking for doesn't exist.</p>
          <Link href="/blog">
            <Button>Back to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  const relatedArticles = articles
    .filter(a => a.id !== article.id && a.category === article.category)
    .slice(0, 3);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `${article.title} - WeddingInvite.ai Blog`;

  const handleShare = async (platform: string) => {
    const urls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(article.title)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
    };
    
    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400');
    }
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.excerpt,
    "image": article.thumbnailUrl,
    "author": {
      "@type": "Person",
      "name": article.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "WeddingInvite.ai",
      "logo": {
        "@type": "ImageObject",
        "url": "https://weddinginvite.ai/logo.png"
      }
    },
    "datePublished": article.publishedAt,
    "dateModified": article.publishedAt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": shareUrl
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://weddinginvite.ai"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://weddinginvite.ai/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": article.title,
        "item": shareUrl
      }
    ]
  };

  return (
    <>
      <SEOHead
        title={`${article.title} | WeddingInvite.ai Blog`}
        description={article.excerpt}
        keywords={article.tags.join(", ")}
        ogImage={article.thumbnailUrl}
        ogType="article"
        canonical={`/blog/${article.slug}`}
        schema={[articleSchema, breadcrumbSchema]}
      />

      <article className="py-8 md:py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground line-clamp-1">{article.title}</span>
          </nav>

          {/* Back Button */}
          <Link href="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Article Header */}
          <header className="mb-8">
            <Badge className="mb-4" data-testid="badge-category">{article.category}</Badge>
            <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight" data-testid="text-article-title">
              {article.title}
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              {article.excerpt}
            </p>
            
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                {article.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {article.publishedAt}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {article.readTime}
              </span>
            </div>
          </header>

          {/* Featured Image */}
          <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-8 bg-muted">
            <img
              src={article.thumbnailUrl}
              alt={article.title}
              className="w-full h-full object-cover"
              data-testid="img-article-hero"
            />
          </div>

          {/* Share Buttons */}
          <div className="flex items-center gap-3 mb-8 pb-8 border-b">
            <span className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Share2 className="w-4 h-4" />
              Share:
            </span>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => handleShare('facebook')}
              aria-label="Share on Facebook"
              data-testid="button-share-facebook"
            >
              <Facebook className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => handleShare('twitter')}
              aria-label="Share on Twitter"
              data-testid="button-share-twitter"
            >
              <Twitter className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => handleShare('linkedin')}
              aria-label="Share on LinkedIn"
              data-testid="button-share-linkedin"
            >
              <Linkedin className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => handleShare('whatsapp')}
              aria-label="Share on WhatsApp"
              data-testid="button-share-whatsapp"
            >
              <SiWhatsapp className="w-4 h-4" />
            </Button>
          </div>

          {/* Article Content */}
          <div 
            className="prose prose-lg dark:prose-invert max-w-none mb-12"
            data-testid="article-content"
          >
            {article.content.split('\n').map((paragraph, index) => {
              const trimmed = paragraph.trim();
              if (!trimmed) return null;
              
              if (trimmed.startsWith('## ')) {
                return <h2 key={index} className="font-playfair text-2xl md:text-3xl font-bold mt-8 mb-4">{trimmed.replace('## ', '')}</h2>;
              }
              if (trimmed.startsWith('### ')) {
                return <h3 key={index} className="font-playfair text-xl md:text-2xl font-semibold mt-6 mb-3">{trimmed.replace('### ', '')}</h3>;
              }
              if (trimmed.startsWith('#### ')) {
                return <h4 key={index} className="font-semibold text-lg mt-4 mb-2">{trimmed.replace('#### ', '')}</h4>;
              }
              if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
                return <p key={index} className="font-semibold my-2">{trimmed.replace(/\*\*/g, '')}</p>;
              }
              if (trimmed.startsWith('- ')) {
                return <li key={index} className="ml-4">{trimmed.replace('- ', '')}</li>;
              }
              if (trimmed.match(/^\d+\./)) {
                return <li key={index} className="ml-4">{trimmed.replace(/^\d+\.\s*/, '')}</li>;
              }
              if (trimmed.includes('[') && trimmed.includes('](/')) {
                const linkMatch = trimmed.match(/\[([^\]]+)\]\(([^)]+)\)/);
                if (linkMatch) {
                  const [, text, href] = linkMatch;
                  const before = trimmed.split('[')[0];
                  const after = trimmed.split(')')[1] || '';
                  return (
                    <p key={index} className="my-4 text-muted-foreground leading-relaxed">
                      {before}
                      <Link href={href} className="text-primary hover:underline">{text}</Link>
                      {after}
                    </p>
                  );
                }
              }
              return <p key={index} className="my-4 text-muted-foreground leading-relaxed">{trimmed}</p>;
            })}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b">
            {article.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Author Box */}
          <div className="bg-card rounded-xl p-6 mb-12 border">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                {article.author.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">{article.author}</h4>
                <p className="text-sm text-muted-foreground">{article.authorBio}</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-8 text-center mb-12">
            <h3 className="font-playfair text-2xl font-bold text-foreground mb-3">
              Ready to Create Your Wedding Invitation?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Browse our collection of culturally authentic video invitation templates designed for weddings around the world.
            </p>
            <Link href="/templates/wedding">
              <Button size="lg" data-testid="button-cta-templates">
                Browse Templates
              </Button>
            </Link>
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <section>
              <h3 className="font-playfair text-2xl font-bold text-foreground mb-6">
                Related Articles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((related) => (
                  <Card key={related.id} className="group overflow-hidden" data-testid={`card-related-${related.id}`}>
                    <Link href={`/blog/${related.slug}`} className="block">
                      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                        <img
                          src={related.thumbnailUrl}
                          alt={related.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                          {related.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {related.excerpt}
                        </p>
                      </div>
                    </Link>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </>
  );
}
