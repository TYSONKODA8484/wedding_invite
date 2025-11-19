import { SEOHead } from "@/components/SEOHead";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Calendar, User, ArrowRight } from "lucide-react";
import homepageHero from "@assets/generated_images/Homepage_cinematic_wedding_hero_efb94fa0.png";
import indianPunjabiHero from "@assets/generated_images/Indian_Punjabi_wedding_culture_b8245c44.png";
import arabicHero from "@assets/generated_images/Arabic_UAE_wedding_culture_5fdde5ea.png";

export default function Blog() {
  const articles = [
    {
      id: "1",
      title: "10 Wedding Video Invitation Trends for 2024",
      slug: "wedding-video-invitation-trends-2024",
      excerpt: "Discover the hottest trends in wedding video invitations, from AI-generated content to culturally authentic designs.",
      author: "Sophia Martinez",
      category: "Trends",
      publishedAt: "Dec 15, 2024",
      thumbnailUrl: homepageHero,
    },
    {
      id: "2",
      title: "Guide to Planning a Traditional Indian Wedding",
      slug: "traditional-indian-wedding-planning-guide",
      excerpt: "Everything you need to know about planning an authentic Indian wedding celebration with traditional ceremonies and modern touches.",
      author: "Priya Sharma",
      category: "Cultural Guides",
      publishedAt: "Dec 10, 2024",
      thumbnailUrl: indianPunjabiHero,
    },
    {
      id: "3",
      title: "How to Create Cinematic Wedding Videos on Budget",
      slug: "create-cinematic-wedding-videos-budget",
      excerpt: "Professional tips for creating stunning cinematic wedding video invitations without breaking the bank.",
      author: "Michael Chen",
      category: "Tips & Tricks",
      publishedAt: "Dec 5, 2024",
      thumbnailUrl: homepageHero,
    },
    {
      id: "4",
      title: "Arabic Wedding Traditions: A Complete Guide",
      slug: "arabic-wedding-traditions-complete-guide",
      excerpt: "Explore the rich traditions of Arabic weddings from engagement to Zaffa procession and everything in between.",
      author: "Fatima Al-Hassan",
      category: "Cultural Guides",
      publishedAt: "Nov 28, 2024",
      thumbnailUrl: arabicHero,
    },
    {
      id: "5",
      title: "5 Ways AI is Revolutionizing Wedding Invitations",
      slug: "ai-revolutionizing-wedding-invitations",
      excerpt: "How artificial intelligence is transforming the way couples create and share their wedding invitations.",
      author: "David Park",
      category: "Technology",
      publishedAt: "Nov 20, 2024",
      thumbnailUrl: homepageHero,
    },
    {
      id: "6",
      title: "Nigerian Wedding Customs: Colors, Dances, and Joy",
      slug: "nigerian-wedding-customs-guide",
      excerpt: "A vibrant journey through Nigerian wedding traditions, from Ankara fabrics to traditional dances.",
      author: "Chioma Okonkwo",
      category: "Cultural Guides",
      publishedAt: "Nov 15, 2024",
      thumbnailUrl: indianPunjabiHero,
    },
  ];

  return (
    <>
      <SEOHead
        title="Wedding Blog - Tips, Trends & Cultural Guides"
        description="Expert wedding planning tips, video invitation trends, and cultural wedding guides. Learn how to create perfect wedding celebrations."
        keywords="wedding blog, wedding tips, cultural wedding guides, video invitation trends, wedding planning"
      />

      <section className="py-16 md:py-24 lg:py-32 bg-gradient-to-b from-background to-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h1 className="font-playfair text-5xl lg:text-6xl font-bold text-foreground mb-4">
              Wedding Blog
            </h1>
            <p className="text-muted-foreground text-lg lg:text-xl max-w-2xl mx-auto">
              Expert tips, cultural guides, and inspiration for your perfect celebration
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {articles.map((article) => (
              <Card key={article.id} className="group overflow-hidden transition-all duration-300" data-testid={`article-${article.id}`}>
                <Link href={`/blog/${article.slug}`} className="block hover-elevate active-elevate-2">
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    <img
                      src={article.thumbnailUrl}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                      {article.category}
                    </Badge>
                  </div>
                  <div className="p-6">
                    <h3 className="font-playfair text-xl lg:text-2xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {article.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {article.publishedAt}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
                      Read More
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
