import { db } from "./db";
import { eq } from "drizzle-orm";
import { templates, templatePages, type InsertTemplate, type InsertTemplatePage, type Template } from "@shared/schema";

const seedTemplates: InsertTemplate[] = [
  // Indian Wedding Templates
  {
    title: "Royal Punjabi Wedding",
    slug: "royal-punjabi-wedding",
    description: "Luxurious cinematic invitation with traditional Punjabi elements, golden accents, and vibrant colors perfect for grand celebrations",
    category: "wedding",
    culture: "indian-punjabi",
    country: "india",
    style: "traditional",
    duration: 45,
    thumbnailUrl: "/stock-images/indian_wedding_coupl_05edd387.jpg",
    demoVideoUrl: "/public-objects/templates/royal-punjabi/demo.mp4",
    priceInr: 149900, // ₹1,499
    isPremium: true,
    isActive: true,
    pageCount: 7,
    tags: ["punjabi", "traditional", "luxury", "gold", "royal", "india"],
    orientation: "portrait",
  },
  {
    title: "Modern South Indian Wedding",
    slug: "modern-south-indian-wedding",
    description: "Contemporary design with temple motifs, elegant animations, and traditional Tamil/Telugu cultural elements",
    category: "wedding",
    culture: "indian-south",
    country: "india",
    style: "modern",
    duration: 40,
    thumbnailUrl: "/stock-images/indian_wedding_coupl_cdae7d23.jpg",
    demoVideoUrl: "/public-objects/templates/modern-south-indian/demo.mp4",
    priceInr: 129900, // ₹1,299
    isPremium: false,
    isActive: true,
    pageCount: 6,
    tags: ["south-indian", "modern", "temple", "elegant", "india"],
    orientation: "portrait",
  },
  
  // UAE Wedding Templates
  {
    title: "Luxury Dubai Wedding",
    slug: "luxury-dubai-wedding",
    description: "Opulent UAE wedding invitation with luxury gold accents, modern Arabic design, and elegant animations perfect for sophisticated Dubai celebrations",
    category: "wedding",
    culture: "arabic-uae",
    country: "uae",
    style: "modern",
    duration: 40,
    thumbnailUrl: "/stock-images/arabic_uae_wedding_l_b2db9a70.jpg",
    demoVideoUrl: "/public-objects/templates/luxury-dubai/demo.mp4",
    priceInr: 189900, // ₹1,899
    isPremium: true,
    isActive: true,
    pageCount: 6,
    tags: ["uae", "dubai", "luxury", "modern", "arabic", "gold"],
    orientation: "portrait",
  },
  {
    title: "Modern Emirati Wedding",
    slug: "modern-emirati-wedding",
    description: "Contemporary UAE wedding invitation with Islamic geometric patterns, elegant typography, and luxurious Middle Eastern aesthetics",
    category: "wedding",
    culture: "arabic-uae",
    country: "uae",
    style: "modern",
    duration: 35,
    thumbnailUrl: "/stock-images/arabic_uae_wedding_l_af38be58.jpg",
    demoVideoUrl: "/public-objects/templates/modern-emirati/demo.mp4",
    priceInr: 159900, // ₹1,599
    isPremium: false,
    isActive: true,
    pageCount: 6,
    tags: ["uae", "emirati", "modern", "arabic", "elegant"],
    orientation: "portrait",
  },

  // Saudi Arabia Wedding Templates
  {
    title: "Saudi Royal Wedding",
    slug: "saudi-royal-wedding",
    description: "Majestic Saudi Arabian wedding invitation with royal gold details, traditional Islamic patterns, and opulent design perfect for grand celebrations",
    category: "wedding",
    culture: "arabic-saudi",
    country: "saudi-arabia",
    style: "traditional",
    duration: 45,
    thumbnailUrl: "/stock-images/saudi_arabian_weddin_519f891c.jpg",
    demoVideoUrl: "/public-objects/templates/saudi-royal/demo.mp4",
    priceInr: 229900, // ₹2,299
    isPremium: true,
    isActive: true,
    pageCount: 7,
    tags: ["saudi-arabia", "royal", "luxury", "traditional", "islamic", "gold"],
    orientation: "portrait",
  },
  {
    title: "Traditional Saudi Wedding",
    slug: "traditional-saudi-wedding",
    description: "Elegant Saudi wedding invitation with classic Arabic calligraphy, cultural motifs, and traditional design elements",
    category: "wedding",
    culture: "arabic-saudi",
    country: "saudi-arabia",
    style: "traditional",
    duration: 40,
    thumbnailUrl: "/stock-images/saudi_arabian_weddin_655988b1.jpg",
    demoVideoUrl: "/public-objects/templates/traditional-saudi/demo.mp4",
    priceInr: 199900, // ₹1,999
    isPremium: true,
    isActive: true,
    pageCount: 6,
    tags: ["saudi-arabia", "traditional", "arabic", "cultural", "elegant"],
    orientation: "portrait",
  },

  // Engagement Templates
  {
    title: "Indian Engagement Ceremony",
    slug: "indian-engagement-ceremony",
    description: "Beautiful engagement invitation with traditional Indian elements and romantic design",
    category: "engagement",
    culture: "indian-universal",
    country: "india",
    style: "traditional",
    duration: 30,
    thumbnailUrl: "/stock-images/indian_wedding_coupl_50b61ff2.jpg",
    demoVideoUrl: "/public-objects/templates/indian-engagement/demo.mp4",
    priceInr: 89900, // ₹899
    isPremium: false,
    isActive: true,
    pageCount: 6,
    tags: ["engagement", "indian", "traditional", "romantic"],
    orientation: "portrait",
  },
  {
    title: "Arabic Engagement Celebration",
    slug: "arabic-engagement-celebration",
    description: "Elegant Arabic engagement invitation with modern design and cultural elements",
    category: "engagement",
    culture: "arabic-universal",
    country: "uae",
    style: "modern",
    duration: 30,
    thumbnailUrl: "/stock-images/arabic_wedding_venue_109cc4ce.jpg",
    demoVideoUrl: "/public-objects/templates/arabic-engagement/demo.mp4",
    priceInr: 94900, // ₹949
    isPremium: false,
    isActive: true,
    pageCount: 6,
    tags: ["engagement", "arabic", "modern", "elegant", "uae"],
    orientation: "portrait",
  },

  // Reception Templates
  {
    title: "Grand Reception Party",
    slug: "grand-reception-party",
    description: "Luxurious reception invitation with party vibes, elegant design, and celebration theme",
    category: "reception",
    culture: "modern-universal",
    country: "india",
    style: "modern",
    duration: 35,
    thumbnailUrl: "/stock-images/arabic_wedding_venue_e385e301.jpg",
    demoVideoUrl: "/public-objects/templates/grand-reception/demo.mp4",
    priceInr: 109900, // ₹1,099
    isPremium: false,
    isActive: true,
    pageCount: 6,
    tags: ["reception", "party", "celebration", "luxury", "modern", "india"],
    orientation: "portrait",
  },
];

// Define standard pages for different template types
const indianWeddingPages = [
  {
    pageNumber: 1,
    pageName: "Welcome",
    thumbnailUrl: "/stock-images/elegant_wedding_invi_5da970d4.jpg",
    editableFields: [
      { id: "title", type: "text", label: "Main Title", defaultValue: "You're Invited", maxLength: 50 },
      { id: "subtitle", type: "text", label: "Subtitle", defaultValue: "To Our Wedding Celebration", maxLength: 100 },
    ],
  },
  {
    pageNumber: 2,
    pageName: "Bride & Groom",
    thumbnailUrl: "/stock-images/elegant_wedding_invi_5da970d4.jpg",
    editableFields: [
      { id: "brideName", type: "text", label: "Bride Name", defaultValue: "", maxLength: 50 },
      { id: "brideParents", type: "text", label: "Bride's Parents", defaultValue: "", maxLength: 100 },
      { id: "bridePhoto", type: "image", label: "Bride Photo", defaultValue: "" },
      { id: "groomName", type: "text", label: "Groom Name", defaultValue: "", maxLength: 50 },
      { id: "groomParents", type: "text", label: "Groom's Parents", defaultValue: "", maxLength: 100 },
      { id: "groomPhoto", type: "image", label: "Groom Photo", defaultValue: "" },
    ],
  },
  {
    pageNumber: 3,
    pageName: "Wedding Details",
    thumbnailUrl: "/stock-images/elegant_wedding_invi_5da970d4.jpg",
    editableFields: [
      { id: "date", type: "text", label: "Wedding Date", defaultValue: "", maxLength: 50 },
      { id: "time", type: "text", label: "Wedding Time", defaultValue: "", maxLength: 50 },
      { id: "venueName", type: "text", label: "Venue Name", defaultValue: "", maxLength: 100 },
      { id: "location", type: "text", label: "Location", defaultValue: "", maxLength: 200 },
    ],
  },
  {
    pageNumber: 4,
    pageName: "Celebration Events",
    thumbnailUrl: "/stock-images/elegant_wedding_invi_5da970d4.jpg",
    editableFields: [
      { id: "ceremonyName", type: "text", label: "Ceremony Name", defaultValue: "Wedding Ceremony", maxLength: 50 },
      { id: "date", type: "text", label: "Date", defaultValue: "", maxLength: 50 },
      { id: "time", type: "text", label: "Time", defaultValue: "", maxLength: 50 },
      { id: "venue", type: "text", label: "Venue Name", defaultValue: "", maxLength: 100 },
      { id: "address", type: "text", label: "Full Address", defaultValue: "", maxLength: 200 },
    ],
  },
  {
    pageNumber: 5,
    pageName: "Special Message",
    thumbnailUrl: "/stock-images/elegant_wedding_invi_5da970d4.jpg",
    editableFields: [
      { id: "message", type: "text", label: "Message to Guests", defaultValue: "Your presence will make our day special", maxLength: 200 },
      { id: "couplePhoto", type: "image", label: "Couple Photo", defaultValue: "" },
    ],
  },
  {
    pageNumber: 6,
    pageName: "RSVP & Contact",
    thumbnailUrl: "/stock-images/elegant_wedding_invi_5da970d4.jpg",
    editableFields: [
      { id: "rsvpText", type: "text", label: "RSVP Message", defaultValue: "Kindly confirm your presence", maxLength: 100 },
      { id: "contactName", type: "text", label: "Contact Person", defaultValue: "", maxLength: 50 },
      { id: "contactPhone", type: "text", label: "Contact Phone", defaultValue: "", maxLength: 20 },
      { id: "whatsappNumber", type: "text", label: "WhatsApp Number", defaultValue: "", maxLength: 20 },
    ],
  },
];

const arabicWeddingPages = [
  {
    pageNumber: 1,
    pageName: "Welcome",
    thumbnailUrl: "/stock-images/elegant_wedding_invi_5da970d4.jpg",
    editableFields: [
      { id: "arabicTitle", type: "text", label: "Arabic Title", defaultValue: "دعوة زفاف", maxLength: 50 },
      { id: "englishTitle", type: "text", label: "English Title", defaultValue: "Wedding Invitation", maxLength: 50 },
    ],
  },
  {
    pageNumber: 2,
    pageName: "Bride & Groom",
    thumbnailUrl: "/stock-images/elegant_wedding_invi_5da970d4.jpg",
    editableFields: [
      { id: "brideName", type: "text", label: "Bride Name", defaultValue: "", maxLength: 50 },
      { id: "brideFamily", type: "text", label: "Bride Family", defaultValue: "", maxLength: 100 },
      { id: "groomName", type: "text", label: "Groom Name", defaultValue: "", maxLength: 50 },
      { id: "groomFamily", type: "text", label: "Groom Family", defaultValue: "", maxLength: 100 },
      { id: "couplePhoto", type: "image", label: "Couple Photo", defaultValue: "" },
    ],
  },
  {
    pageNumber: 3,
    pageName: "Wedding Details",
    thumbnailUrl: "/stock-images/elegant_wedding_invi_5da970d4.jpg",
    editableFields: [
      { id: "date", type: "text", label: "Wedding Date", defaultValue: "", maxLength: 50 },
      { id: "time", type: "text", label: "Wedding Time", defaultValue: "", maxLength: 50 },
      { id: "venue", type: "text", label: "Venue Name", defaultValue: "", maxLength: 100 },
      { id: "location", type: "text", label: "Location", defaultValue: "", maxLength: 200 },
    ],
  },
  {
    pageNumber: 4,
    pageName: "Celebration Events",
    thumbnailUrl: "/stock-images/elegant_wedding_invi_5da970d4.jpg",
    editableFields: [
      { id: "hennaEvent", type: "text", label: "Henna Night Details", defaultValue: "", maxLength: 150 },
      { id: "weddingEvent", type: "text", label: "Wedding Event Details", defaultValue: "", maxLength: 150 },
      { id: "receptionEvent", type: "text", label: "Reception Details", defaultValue: "", maxLength: 150 },
    ],
  },
  {
    pageNumber: 5,
    pageName: "Blessing",
    thumbnailUrl: "/stock-images/elegant_wedding_invi_5da970d4.jpg",
    editableFields: [
      { id: "blessing", type: "text", label: "Blessing/Dua", defaultValue: "May Allah bless this union", maxLength: 200 },
      { id: "decorPhoto", type: "image", label: "Decoration Photo", defaultValue: "" },
    ],
  },
  {
    pageNumber: 6,
    pageName: "Contact Information",
    thumbnailUrl: "/stock-images/elegant_wedding_invi_5da970d4.jpg",
    editableFields: [
      { id: "hostName", type: "text", label: "Host Name", defaultValue: "", maxLength: 50 },
      { id: "contactNumber", type: "text", label: "Contact Number", defaultValue: "", maxLength: 20 },
      { id: "rsvpMessage", type: "text", label: "RSVP Message", defaultValue: "Please confirm your attendance", maxLength: 100 },
    ],
  },
];

const modernWeddingPages = [
  {
    pageNumber: 1,
    pageName: "Cover",
    editableFields: [
      { id: "coupleName", type: "text", label: "Couple Names", defaultValue: "", maxLength: 100 },
      { id: "tagline", type: "text", label: "Tagline", defaultValue: "Together Forever", maxLength: 50 },
      { id: "coverPhoto", type: "image", label: "Cover Photo", defaultValue: "" },
    ],
  },
  {
    pageNumber: 2,
    pageName: "Our Story",
    editableFields: [
      { id: "storyText", type: "text", label: "Love Story", defaultValue: "Our journey began...", maxLength: 300 },
      { id: "storyPhoto", type: "image", label: "Story Photo", defaultValue: "" },
    ],
  },
  {
    pageNumber: 3,
    pageName: "Wedding Day",
    editableFields: [
      { id: "date", type: "text", label: "Date", defaultValue: "", maxLength: 50 },
      { id: "time", type: "text", label: "Time", defaultValue: "", maxLength: 50 },
      { id: "venue", type: "text", label: "Venue", defaultValue: "", maxLength: 100 },
    ],
  },
  {
    pageNumber: 4,
    pageName: "Gallery",
    editableFields: [
      { id: "photo1", type: "image", label: "Photo 1", defaultValue: "" },
      { id: "photo2", type: "image", label: "Photo 2", defaultValue: "" },
      { id: "photo3", type: "image", label: "Photo 3", defaultValue: "" },
    ],
  },
  {
    pageNumber: 5,
    pageName: "Join Us",
    editableFields: [
      { id: "message", type: "text", label: "Message", defaultValue: "Join us in celebrating our special day", maxLength: 150 },
    ],
  },
  {
    pageNumber: 6,
    pageName: "Details",
    editableFields: [
      { id: "contactName", type: "text", label: "Contact", defaultValue: "", maxLength: 50 },
      { id: "phone", type: "text", label: "Phone", defaultValue: "", maxLength: 20 },
    ],
  },
];

async function seedDatabase() {
  console.log("🌱 Starting database seed...");

  try {
    for (const templateData of seedTemplates) {
      // Check if template already exists by slug
      const existingTemplate = await db.query.templates.findFirst({
        where: (templates, { eq }) => eq(templates.slug, templateData.slug),
      });

      let template: Template;

      if (existingTemplate) {
        // Update existing template to preserve its ID (exclude server-managed fields)
        const updatePayload: Partial<InsertTemplate> = {};
        
        // Only set fields that are defined in templateData
        if (templateData.title !== undefined) updatePayload.title = templateData.title;
        if (templateData.description !== undefined) updatePayload.description = templateData.description;
        if (templateData.category !== undefined) updatePayload.category = templateData.category;
        if (templateData.culture !== undefined) updatePayload.culture = templateData.culture;
        if (templateData.style !== undefined) updatePayload.style = templateData.style;
        if (templateData.duration !== undefined) updatePayload.duration = templateData.duration;
        if (templateData.thumbnailUrl !== undefined) updatePayload.thumbnailUrl = templateData.thumbnailUrl;
        if (templateData.demoVideoUrl !== undefined) updatePayload.demoVideoUrl = templateData.demoVideoUrl;
        if (templateData.priceInr !== undefined) updatePayload.priceInr = templateData.priceInr;
        if (templateData.isPremium !== undefined) updatePayload.isPremium = templateData.isPremium;
        if (templateData.isActive !== undefined) updatePayload.isActive = templateData.isActive;
        if (templateData.pageCount !== undefined) updatePayload.pageCount = templateData.pageCount;
        if (templateData.tags !== undefined) updatePayload.tags = templateData.tags;
        if (templateData.orientation !== undefined) updatePayload.orientation = templateData.orientation;
        
        const [updated] = await db
          .update(templates)
          .set(updatePayload)
          .where(eq(templates.id, existingTemplate.id))
          .returning();
        template = updated;
        console.log(`✅ Updated template: ${template.title}`);
      } else {
        // Insert new template
        const [inserted] = await db.insert(templates).values(templateData).returning();
        template = inserted;
        console.log(`✅ Created template: ${template.title}`);
      }

      // Determine which page structure to use
      let pages = indianWeddingPages;
      if (templateData.culture.startsWith("arabic")) {
        pages = arabicWeddingPages;
      } else if (templateData.culture === "modern-universal") {
        pages = modernWeddingPages;
      }

      // Upsert pages for this template (update content if it changes)
      for (const pageData of pages.slice(0, templateData.pageCount)) {
        const pageInsert: InsertTemplatePage = {
          templateId: template.id,
          pageNumber: pageData.pageNumber,
          pageName: pageData.pageName,
          thumbnailUrl: `/public-objects/templates/${templateData.slug}/page-${pageData.pageNumber}.jpg`,
          editableFields: pageData.editableFields,
        };

        // Use onConflictDoUpdate to sync page content if definitions change
        await db
          .insert(templatePages)
          .values(pageInsert)
          .onConflictDoUpdate({
            target: [templatePages.templateId, templatePages.pageNumber],
            set: {
              pageName: pageData.pageName,
              thumbnailUrl: `/public-objects/templates/${templateData.slug}/page-${pageData.pageNumber}.jpg`,
              editableFields: pageData.editableFields,
            },
          });
      }

      console.log(`   📄 Ensured ${templateData.pageCount} pages for ${template.title}`);
    }

    console.log("\n✨ Database seeding complete!");
    console.log(`📊 Total templates processed: ${seedTemplates.length}`);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

export { seedDatabase };

// Run seed if called directly
seedDatabase()
  .then(() => {
    console.log("👍 Seed completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Seed failed:", error);
    process.exit(1);
  });
