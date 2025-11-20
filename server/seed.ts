import { db } from "./db";
import { users, templates, type InsertUser, type InsertTemplate } from "@shared/schema";
import * as bcrypt from "bcryptjs";

export async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Seed test user
    const passwordHash = await bcrypt.hash("Test@1234", 10);
    
    const [testUser] = await db
      .insert(users)
      .values({
        name: "Aarti Sharma",
        email: "aarti@example.com",
        phone: "+919999999999",
        passwordHash,
      })
      .onConflictDoNothing()
      .returning();

    console.log("✅ Test user created:", testUser?.email);

    // Seed Indian Hindu Wedding template
    const indianTemplateJson = {
      template_id: "T_IND_001",
      name: "Indian Hindu Wedding Invite",
      type: "card",
      orientation: "portrait",
      photo_option: "with_photo",
      pages: [
        {
          page_id: "P1",
          page_number: 1,
          fields: [
            { field_id: "P1_title_1", label: "Main Title Line 1", type: "text", value: "शादी", ae_layer: "Page1_TitleLine1" },
            { field_id: "P1_title_2", label: "Main Title Line 2", type: "text", value: "आमंत्रण", ae_layer: "Page1_TitleLine2" }
          ],
          media: [
            { media_id: "P1_bg", type: "image", url: "/s3/T_IND_001/page1/bg.png", ae_layer: "Page1_Background" }
          ]
        },
        {
          page_id: "P2",
          page_number: 2,
          fields: [
            { field_id: "P2_mantra", label: "Ganesh Mantra", type: "text", value: "|| श्री गणेशाय नमः ||", ae_layer: "Page2_Mantra" },
            { field_id: "P2_initials", label: "Initials", type: "text", value: "SA", ae_layer: "Page2_Initials" },
            { field_id: "P2_couple", label: "Couple Names", type: "text", value: "आदिलक्ष्मी और रवींद्रन", ae_layer: "Page2_CoupleNames" },
            { field_id: "P2_dates", label: "Wedding Dates", type: "text", value: "14 और 15 अक्टूबर, 2025", ae_layer: "Page2_Dates" },
            { field_id: "P2_venue", label: "Venue", type: "text", value: "ग्रैंड हयात होटल, फेज़ 2, अहमदाबाद, गुजरात - 380001", ae_layer: "Page2_Venue" }
          ],
          media: []
        },
        {
          page_id: "P3",
          page_number: 3,
          fields: [
            { field_id: "P3_invite", label: "Invite Line", type: "text", value: "हम आपके विवाह समारोह में आपकी गरिमामयी उपस्थिति का सम्मान चाहते हैं।", ae_layer: "Page3_Invite" },
            { field_id: "P3_bride", label: "Bride Name", type: "text", value: "आदिलक्ष्मी", ae_layer: "Page3_BrideName" },
            { field_id: "P3_bride_parents", label: "Bride Parents", type: "text", value: "श्रीमती. पूजा भट्ट और श्री. महेश कुमार भट्ट की बेटी", ae_layer: "Page3_BrideParents" },
            { field_id: "P3_groom", label: "Groom Name", type: "text", value: "रवींद्रन", ae_layer: "Page3_GroomName" },
            { field_id: "P3_groom_parents", label: "Groom Parents", type: "text", value: "श्रीमती निहारिका दुबे और श्री रवि दुबे के पुत्र", ae_layer: "Page3_GroomParents" },
            { field_id: "P3_venue", label: "Venue Text", type: "text", value: "ग्रैंड हयात होटल, फेज़ 2, अहमदाबाद, गुजरात - 380001", ae_layer: "Page3_Venue" }
          ],
          media: []
        },
        {
          page_id: "P4",
          page_number: 4,
          fields: [
            { field_id: "P4_event_title", label: "Event Title", type: "text", value: "हल्दी की कहानियाँ", ae_layer: "Page4_EventTitle" },
            { field_id: "P4_event_date", label: "Event Date", type: "text", value: "सोमवार, 14 अक्टूबर 2025", ae_layer: "Page4_EventDate" },
            { field_id: "P4_event_sub", label: "Event Subtitle", type: "text", value: "फूलों की हल्दी", ae_layer: "Page4_EventSubtitle" },
            { field_id: "P4_event_time", label: "Event Time", type: "text", value: "रात्रि 12:00 बजे से", ae_layer: "Page4_EventTime" },
            { field_id: "P4_event_venue", label: "Event Venue", type: "text", value: "ग्रैंड हयात होटल, फेज़ 2, अहमदाबाद, गुजरात - 380001", ae_layer: "Page4_EventVenue" }
          ],
          media: []
        },
        {
          page_id: "P9",
          page_number: 9,
          fields: [
            { field_id: "P9_initials", label: "Initials", type: "text", value: "SA", ae_layer: "Page9_Initials" },
            { field_id: "P9_title", label: "Guest Title", type: "text", value: "दर्शनाभिलाषी", ae_layer: "Page9_GuestTitle" },
            { field_id: "P9_g1", label: "Guest 1", type: "text", value: "Dr. आराध्या और Dr. मुकेश भट्ट", ae_layer: "Page9_Guest1" },
            { field_id: "P9_g2", label: "Guest 2", type: "text", value: "श्रीमती. नव्या और Dr. अंगद भट्ट", ae_layer: "Page9_Guest2" },
            { field_id: "P9_g3", label: "Guest 3", type: "text", value: "स्वागतकर्ता", ae_layer: "Page9_Guest3" },
            { field_id: "P9_g4", label: "Guest 4", type: "text", value: "Dr. मयूरी और पवन आहूजा", ae_layer: "Page9_Guest4" },
            { field_id: "P9_g5", label: "Guest 5", type: "text", value: "पूजा और वैभव भट्ट", ae_layer: "Page9_Guest5" },
            { field_id: "P9_g6", label: "Guest 6", type: "text", value: "Dr. निमिषा और Dr. करण सिंह", ae_layer: "Page9_Guest6" }
          ],
          media: []
        }
      ],
      meta: {
        created_by: testUser?.id || null,
        created_at: "2025-01-15T10:00:00Z"
      }
    };

    const [indianTemplate] = await db
      .insert(templates)
      .values({
        name: "Indian Hindu Wedding Invite",
        slug: "indian-hindu-wedding-invite",
        type: "wedding",
        orientation: "portrait",
        photoOption: "with_photo",
        tags: ["hindu", "marathi", "indian", "wedding", "save-the-date"],
        coverImage: "/api/media/Ind/IndWedVid_a.mp4",
        thumbnailUrl: "/stock-images/indian_wedding_couple.jpg",
        duration: 45,
        currency: "INR",
        price: "1200.00",
        templateJson: indianTemplateJson,
        createdBy: testUser?.id || null,
      })
      .onConflictDoNothing()
      .returning();

    console.log("✅ Indian template created:", indianTemplate?.name);
    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}
