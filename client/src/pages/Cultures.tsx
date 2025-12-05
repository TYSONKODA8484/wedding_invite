import { SEOHead } from "@/components/SEOHead";
import { HeroSection } from "@/components/HeroSection";
import { CultureCard } from "@/components/CultureCard";
import indianPunjabiHero from "@assets/generated_images/Indian_Punjabi_wedding_culture_b8245c44.png";
import tamilHero from "@assets/generated_images/Tamil_wedding_culture_page_3a868c20.png";
import arabicHero from "@assets/generated_images/Arabic_UAE_wedding_culture_5fdde5ea.png";
import nigerianHero from "@assets/generated_images/Nigerian_traditional_wedding_culture_733beed6.png";
import quinceaneraHero from "@assets/generated_images/Quinceañera_culture_page_hero_f3e1cb71.png";
import koreanHero from "@assets/generated_images/korean_hanbok_wedding_ceremony.png";
import chineseHero from "@assets/generated_images/chinese_tea_ceremony_wedding.png";

export default function Cultures() {
  const cultures = [
    {
      id: "1",
      name: "Indian Weddings",
      localName: "भारतीय विवाह",
      slug: "indian-wedding-video-invitation",
      description: "Rich traditions and vibrant celebrations across diverse Indian cultures",
      heroImageUrl: indianPunjabiHero,
      templateCount: 120,
    },
    {
      id: "2",
      name: "Punjabi Weddings",
      localName: "ਪੰਜਾਬੀ ਵਿਆਹ",
      slug: "indian-wedding-video-invitation/punjabi",
      description: "Vibrant Punjabi celebrations with Bhangra and colorful traditions",
      heroImageUrl: indianPunjabiHero,
      templateCount: 45,
    },
    {
      id: "3",
      name: "Tamil Weddings",
      localName: "தமிழ் திருமணம்",
      slug: "indian-wedding-video-invitation/tamil",
      description: "Traditional Tamil ceremonies honoring Dravidian heritage",
      heroImageUrl: tamilHero,
      templateCount: 38,
    },
    {
      id: "4",
      name: "Arabic Weddings",
      localName: "الزفاف العربي",
      slug: "arabic-wedding-video-uae-saudi",
      description: "Luxurious Middle Eastern wedding traditions",
      heroImageUrl: arabicHero,
      templateCount: 55,
    },
    {
      id: "5",
      name: "Nigerian Weddings",
      localName: "Ìgbéyàwó Nàìjíríà",
      slug: "nigerian-traditional-wedding-video",
      description: "Colorful African cultural celebrations",
      heroImageUrl: nigerianHero,
      templateCount: 48,
    },
    {
      id: "6",
      name: "Quinceañera",
      localName: "Quinceañera",
      slug: "quinceanera-video-invitation",
      description: "Latin American coming-of-age celebrations",
      heroImageUrl: quinceaneraHero,
      templateCount: 40,
    },
    {
      id: "7",
      name: "Chinese Weddings",
      localName: "中国婚礼",
      slug: "chinese-tea-ceremony-video",
      description: "Traditional Chinese tea ceremonies and customs",
      heroImageUrl: chineseHero,
      templateCount: 36,
    },
    {
      id: "8",
      name: "Korean Weddings",
      localName: "한국 결혼식",
      slug: "korean-pyebaek-video",
      description: "Elegant Korean Hanbok ceremonies",
      heroImageUrl: koreanHero,
      templateCount: 30,
    },
  ];

  return (
    <>
      <SEOHead
        title="Cultural Wedding Video Invitations - 50+ Global Cultures"
        description="Explore authentic video invitation templates for 50+ cultures worldwide. Indian, Arabic, Nigerian, Chinese, Korean, and more cultural wedding traditions."
        keywords="cultural wedding videos, Indian wedding invitation, Arabic wedding, Nigerian wedding, traditional wedding videos"
      />

      <HeroSection
        title="Celebrate Every Culture"
        description="Authentic video invitation templates honoring wedding traditions from around the world. Find templates designed specifically for your cultural heritage."
        backgroundImage={indianPunjabiHero}
        height="large"
        primaryCTA={{
          text: "Explore Cultures",
          href: "#cultures",
        }}
      />

      <section className="py-12 lg:py-16 bg-background" id="cultures">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Browse by Culture
            </h2>
            <p className="text-muted-foreground text-lg lg:text-xl max-w-2xl mx-auto">
              Each culture has unique traditions, symbols, and celebrations. Our templates honor these authentic customs with cultural accuracy and respect.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {cultures.map((culture) => (
              <CultureCard key={culture.id} {...culture} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
