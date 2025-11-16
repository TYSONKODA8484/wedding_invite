import { useRoute } from "wouter";
import { SEOHead } from "@/components/SEOHead";
import { HeroSection } from "@/components/HeroSection";
import { TemplateCard } from "@/components/TemplateCard";
import { Card } from "@/components/ui/card";
import indianPunjabiHero from "@assets/generated_images/Indian_Punjabi_wedding_culture_b8245c44.png";
import tamilHero from "@assets/generated_images/Tamil_wedding_culture_page_3a868c20.png";
import arabicHero from "@assets/generated_images/Arabic_UAE_wedding_culture_5fdde5ea.png";
import nigerianHero from "@assets/generated_images/Nigerian_traditional_wedding_culture_733beed6.png";
import quinceaneraHero from "@assets/generated_images/Quinceañera_culture_page_hero_f3e1cb71.png";
import homepageHero from "@assets/generated_images/Homepage_cinematic_wedding_hero_efb94fa0.png";

const cultureData: Record<string, any> = {
  "indian-wedding-video-invitation": {
    name: "Indian Wedding Video Invitations",
    localName: "भारतीय विवाह निमंत्रण",
    description: "Create authentic Indian wedding video invitations celebrating rich traditions, vibrant colors, and cultural heritage with cinematic quality.",
    traditions: ["Mehendi Ceremony", "Sangeet Night", "Baraat Procession", "Pheras & Rituals", "Reception Celebration"],
    symbols: ["Kalash & Coconut", "Marigold Flowers", "Sacred Fire", "Rangoli Designs", "Traditional Attire"],
    heroImage: indianPunjabiHero,
    templateCount: 120,
  },
  "punjabi": {
    name: "Punjabi Wedding Videos",
    localName: "ਪੰਜਾਬੀ ਵਿਆਹ",
    description: "Vibrant Punjabi wedding video invitations featuring Bhangra, colorful turbans, and joyful celebrations of love and family.",
    traditions: ["Roka Ceremony", "Chunni Ceremony", "Jaggo & Sangeet", "Anand Karaj", "Doli & Vidai"],
    symbols: ["Red & Gold Colors", "Phulkari Patterns", "Dhol Drums", "Sehra for Groom", "Chooda for Bride"],
    heroImage: indianPunjabiHero,
    templateCount: 45,
  },
  "tamil": {
    name: "Tamil Wedding Videos",
    localName: "தமிழ் திருமண வீடியோ",
    description: "Traditional Tamil wedding video invitations honoring Dravidian heritage with temple aesthetics and sacred rituals.",
    traditions: ["Sumangali Prarthanai", "Kashi Yatra", "Oonjal Ceremony", "Saptapadi", "Grihapravesh"],
    symbols: ["Silk Sarees", "Jasmine Garlands", "Temple Architecture", "Thali Mangalsutra", "Banana Leaves"],
    heroImage: tamilHero,
    templateCount: 38,
  },
  "telugu": {
    name: "Telugu Wedding Videos",
    localName: "తెలుగు పెళ్ళి వీడియో",
    description: "Elegant Telugu wedding video invitations showcasing Andhra Pradesh and Telangana wedding customs.",
    traditions: ["Pellikuthuru", "Snatakam", "Kashi Yatra", "Madhuparkam", "Jeelakarra Bellam"],
    symbols: ["Gold Jewelry", "Kanchipuram Silk", "Turmeric Paste", "Mango Leaves", "Traditional Kolam"],
    heroImage: tamilHero,
    templateCount: 32,
  },
  "gujarati": {
    name: "Gujarati Wedding Videos",
    localName: "ગુજરાતી લગ્ન વીડિયો",
    description: "Colorful Gujarati wedding video invitations featuring Garba, traditional rituals, and joyful celebrations.",
    traditions: ["Griha Shanti", "Mandap Mahurat", "Jaan", "Varmala", "Saptapadi"],
    symbols: ["Bandhani Prints", "Mirror Work", "Dandiya Sticks", "Swastik Symbol", "Coconut & Dates"],
    heroImage: indianPunjabiHero,
    templateCount: 28,
  },
  "bengali": {
    name: "Bengali Wedding Videos",
    localName: "বাংলা বিয়ে ভিডিও",
    description: "Artistic Bengali wedding video invitations honoring Tagore's land with poetry, music, and rituals.",
    traditions: ["Aashirbad", "Dodhi Mangal", "Bor Jatri", "Subho Drishti", "Saptapadi"],
    symbols: ["Red & White Saree", "Shankha Pola Bangles", "Alpana Designs", "Topor Crown", "Betel Leaves"],
    heroImage: tamilHero,
    templateCount: 26,
  },
  "muslim-nikah": {
    name: "Muslim Nikah Videos",
    localName: "نکاح کی ویڈیو",
    description: "Elegant Muslim nikah video invitations respecting Islamic traditions with modest and beautiful designs.",
    traditions: ["Mangni", "Mehendi", "Nikah Ceremony", "Rukhsati", "Walima Reception"],
    symbols: ["Crescent & Star", "Arabic Calligraphy", "Henna Designs", "Green & Gold", "Floral Patterns"],
    heroImage: arabicHero,
    templateCount: 42,
  },
  "christian": {
    name: "Christian Wedding Videos",
    localName: "క్రైస్తవ వివాహ వీడియో",
    description: "Sacred Christian wedding video invitations for church ceremonies and holy matrimony celebrations.",
    traditions: ["Church Ceremony", "Exchange of Vows", "Ring Exchange", "Unity Candle", "First Dance"],
    symbols: ["Cross & Bible", "White Dove", "Wedding Bells", "Church Architecture", "White & Ivory"],
    heroImage: homepageHero,
    templateCount: 35,
  },
  "arabic-wedding-video-uae-saudi": {
    name: "Arabic Wedding Videos - UAE & Saudi",
    localName: "فيديو الزفاف العربي",
    description: "Luxurious Arabic wedding video invitations for UAE and Saudi celebrations with opulent designs and traditional elegance.",
    traditions: ["Henna Night", "Zaffa Procession", "Katb Al-Kitab", "Wedding Party", "Honeymoon Send-off"],
    symbols: ["Gold Decor", "Arabic Calligraphy", "Oud Perfume", "Luxurious Fabrics", "Intricate Patterns"],
    heroImage: arabicHero,
    templateCount: 55,
  },
  "nigerian-traditional-wedding-video": {
    name: "Nigerian Traditional Wedding Videos",
    localName: "Ìgbéyàwó Nàìjíríà",
    description: "Vibrant Nigerian wedding video invitations celebrating African heritage with colorful traditional attire and customs.",
    traditions: ["Introduction Ceremony", "Wine Carrying", "Bride Price", "Traditional Dance", "Cultural Blessings"],
    symbols: ["Ankara Fabric", "Gele Headwrap", "Coral Beads", "Aso Ebi", "Traditional Drums"],
    heroImage: nigerianHero,
    templateCount: 48,
  },
  "quinceanera-video-invitation": {
    name: "Quinceañera Video Invitations",
    localName: "Invitación de Quinceañera",
    description: "Beautiful quinceañera video invitations celebrating a young woman's 15th birthday with Latin American traditions.",
    traditions: ["Mass Ceremony", "Changing of Shoes", "Last Doll", "Father-Daughter Dance", "Waltz"],
    symbols: ["Tiara & Crown", "Pink & Gold", "Roses", "Butterfly Theme", "Ball Gown"],
    heroImage: quinceaneraHero,
    templateCount: 40,
  },
  "chinese-tea-ceremony-video": {
    name: "Chinese Tea Ceremony Videos",
    localName: "中国茶道婚礼视频",
    description: "Traditional Chinese wedding video invitations honoring tea ceremony customs and ancient Chinese traditions.",
    traditions: ["Tea Ceremony", "Hair Combing Ritual", "Wedding Banquet", "Door Games", "Red Packet Exchange"],
    symbols: ["Red & Gold Colors", "Dragon & Phoenix", "Double Happiness", "Peonies", "Lanterns"],
    heroImage: homepageHero,
    templateCount: 36,
  },
  "korean-pyebaek-video": {
    name: "Korean Pyebaek Ceremony Videos",
    localName: "한국 폐백 비디오",
    description: "Elegant Korean wedding video invitations featuring traditional Hanbok attire and Pyebaek ceremony.",
    traditions: ["Pyebaek Ceremony", "Modern Ceremony", "Paebaek Bows", "Date & Nut Toss", "Reception"],
    symbols: ["Hanbok Attire", "Red & Blue Colors", "Korean Knots", "Ducks Symbolism", "Traditional Table"],
    heroImage: tamilHero,
    templateCount: 30,
  },
  "filipino-debut-video": {
    name: "Filipino Debut Videos",
    localName: "Debut ng Pilipino",
    description: "Festive Filipino debut video invitations for 18th birthday celebrations with traditional customs.",
    traditions: ["Grand Entrance", "18 Roses Dance", "18 Candles", "Father-Daughter Dance", "Debut Waltz"],
    symbols: ["Gown & Tiara", "Roses", "Pearls", "Butterfly Theme", "Gold Accents"],
    heroImage: quinceaneraHero,
    templateCount: 32,
  },
  "jewish-bar-bat-mitzvah-video-invitation": {
    name: "Jewish Bar/Bat Mitzvah Videos",
    localName: "בר/בת מצווה",
    description: "Meaningful Jewish Bar and Bat Mitzvah video invitations celebrating coming of age with sacred traditions.",
    traditions: ["Torah Reading", "Aliyah Ceremony", "Candle Lighting", "Hora Dance", "Reception Celebration"],
    symbols: ["Star of David", "Torah Scroll", "Tallit & Kippah", "Blue & Silver", "Hamsa Hand"],
    heroImage: homepageHero,
    templateCount: 34,
  },
};

export default function CulturePage() {
  const [, params] = useRoute("/culture/:slug");
  const slug = params?.slug || "indian-wedding-video-invitation";
  const culture = cultureData[slug] || cultureData["indian-wedding-video-invitation"];

  const templates = [
    { id: "1", title: "Traditional Celebration", slug: "traditional-celebration", category: "wedding", duration: 60, thumbnailUrl: culture.heroImage, isPremium: true },
    { id: "2", title: "Cultural Heritage", slug: "cultural-heritage", category: "wedding", duration: 50, thumbnailUrl: culture.heroImage, isPremium: true },
    { id: "3", title: "Modern Fusion", slug: "modern-fusion", category: "wedding", duration: 45, thumbnailUrl: culture.heroImage, isPremium: false },
    { id: "4", title: "Classic Traditions", slug: "classic-traditions", category: "wedding", duration: 55, thumbnailUrl: culture.heroImage, isPremium: false },
  ];

  return (
    <>
      <SEOHead
        title={culture.name}
        description={`${culture.description} Browse ${culture.templateCount}+ authentic video invitation templates.`}
        keywords={`${culture.name}, ${slug}, cultural wedding video, ${culture.localName}, traditional invitation`}
      />

      <HeroSection
        title={culture.name}
        subtitle={culture.localName}
        description={culture.description}
        backgroundImage={culture.heroImage}
        height="large"
        primaryCTA={{
          text: "Browse Templates",
          href: "#templates",
        }}
      />

      <section className="py-12 lg:py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
            <Card className="p-8">
              <h2 className="font-playfair text-2xl lg:text-3xl font-bold text-foreground mb-6">
                Traditional Ceremonies
              </h2>
              <ul className="space-y-3">
                {culture.traditions.map((tradition: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">{tradition}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-8">
              <h2 className="font-playfair text-2xl lg:text-3xl font-bold text-foreground mb-6">
                Cultural Symbols
              </h2>
              <ul className="space-y-3">
                {culture.symbols.map((symbol: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">{symbol}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <div className="mb-8" id="templates">
            <h3 className="font-playfair text-3xl lg:text-4xl font-bold text-foreground mb-2 text-center">
              {culture.name} Templates
            </h3>
            <p className="text-muted-foreground text-center text-lg">{culture.templateCount} culturally authentic templates available</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {templates.map((template) => (
              <TemplateCard key={template.id} {...template} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
