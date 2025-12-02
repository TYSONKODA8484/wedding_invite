import { db } from "./db";
import { 
  users, 
  templates, 
  projects,
  userTemplates,
  orders,
  payments,
  music,
  type InsertUser, 
  type InsertTemplate,
  type InsertProject,
  type InsertUserTemplate,
  type InsertOrder,
  type InsertPayment,
  type InsertMusic
} from "@shared/schema";
import * as bcrypt from "bcryptjs";

export async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Seed Music Library (stock music for video templates)
    const musicTracks: InsertMusic[] = [
      { name: "Epic Love Romantic", url: "Ind/music/epic-love-inspirational-romantic-cinematic-30-seconds-406069.mp3", duration: 30, category: "wedding" },
      { name: "Hopeful Acoustic", url: "Ind/music/hopeful-acoustic-travel-30-seconds-368800.mp3", duration: 30, category: "wedding" },
      { name: "Magical Orchestral", url: "Ind/music/magical-dramedy-orchestral-sneaky-spell-30-sec-375796.mp3", duration: 30, category: "birthday" },
      { name: "Orchestral Joy", url: "Ind/music/orchestral-joy-30-sec-423312.mp3", duration: 30, category: "birthday" },
      { name: "Enchanted Music", url: "Ind/music/sneaky-art-30-sec-enchanted-music-426698.mp3", duration: 30, category: "wedding" },
      { name: "Uplifting Corporate", url: "Ind/music/uplifting-feelgood-30-seconds-corporate-430728.mp3", duration: 30, category: "birthday" },
    ];

    const insertedMusic = await db
      .insert(music)
      .values(musicTracks)
      .onConflictDoNothing()
      .returning();
    
    console.log(`✅ ${insertedMusic.length} music tracks seeded`);

    // Create User 1: Has PAID for a template
    const user1PasswordHash = await bcrypt.hash("Test@1234", 10);
    const [user1] = await db
      .insert(users)
      .values({
        name: "Aarti Sharma",
        email: "aarti@example.com",
        phone: "+919999999999",
        passwordHash: user1PasswordHash,
      })
      .onConflictDoNothing()
      .returning();

    console.log("✅ User 1 (PAID) created:", user1?.email);

    // Create User 2: Has NOT PAID
    const user2PasswordHash = await bcrypt.hash("Test@1234", 10);
    const [user2] = await db
      .insert(users)
      .values({
        name: "Rajesh Kumar",
        email: "rajesh@example.com",
        phone: "+918888888888",
        passwordHash: user2PasswordHash,
      })
      .onConflictDoNothing()
      .returning();

    console.log("✅ User 2 (NOT PAID) created:", user2?.email);

    // Template 1: Indian Hindu Wedding Invite (from user's provided data)
    const template1Json = {
      pages: [
        {
          media: [
            {
              url: "/api/media/Ind/IndWedpho_a1.png",
              type: "image",
              position: "background"
            }
          ],
          fields: [
            {
              type: "text",
              label: "Main Title Line 1",
              value: "शादी",
              ae_layer: "Page1_TitleLine1",
              field_id: "title_1"
            },
            {
              type: "text",
              label: "Main Title Line 2",
              value: "आमंत्रण",
              ae_layer: "Page1_TitleLine2",
              field_id: "title_2"
            }
          ],
          page_id: "P1",
          page_number: 1
        },
        {
          media: [
            {
              url: "/api/media/Ind/IndWedpho_a2.png",
              type: "image",
              position: "background"
            }
          ],
          fields: [
            {
              type: "text",
              label: "Ganesh Mantra",
              value: "|| श्री गणेशाय नमः ||",
              ae_layer: "Page2_Mantra",
              field_id: "mantra"
            },
            {
              type: "text",
              label: "Initials",
              value: "SA",
              ae_layer: "Page2_Initials",
              field_id: "initials"
            },
            {
              type: "text",
              label: "Couple Names",
              value: "आदिलक्ष्मी और रवींद्रन",
              ae_layer: "Page2_CoupleNames",
              field_id: "couple_names"
            },
            {
              type: "text",
              label: "Wedding Dates",
              value: "14 और 15 अक्टूबर, 2025",
              ae_layer: "Page2_Dates",
              field_id: "wedding_dates"
            },
            {
              type: "text",
              label: "Venue",
              value: "ग्रैंड हयात होटल, फेज़ 2, अहमदाबाद, गुजरात - 380001",
              ae_layer: "Page2_Venue",
              field_id: "venue"
            }
          ],
          page_id: "P2",
          page_number: 2
        },
        {
          media: [
            {
              url: "/api/media/Ind/IndWedpho_a3.png",
              type: "image",
              position: "background"
            }
          ],
          fields: [
            {
              type: "text",
              label: "Invite Text",
              value: "हम आपके विवाह समारोह में आपकी गरिमामयी उपस्थिति का सम्मान चाहते हैं।",
              ae_layer: "Page3_InviteLine",
              field_id: "invite_line"
            },
            {
              type: "text",
              label: "Bride Name",
              value: "आदिलक्ष्मी",
              ae_layer: "Page3_BrideName",
              field_id: "bride_name"
            },
            {
              type: "text",
              label: "Bride Parents",
              value: "श्रीमती. पूजा भट्ट और श्री. महेश कुमार भट्ट की बेटी",
              ae_layer: "Page3_BrideParents",
              field_id: "bride_parents"
            },
            {
              type: "text",
              label: "Groom Name",
              value: "रवींद्रन",
              ae_layer: "Page3_GroomName",
              field_id: "groom_name"
            },
            {
              type: "text",
              label: "Groom Parents",
              value: "श्रीमती निहारिका दुबे और श्री रवि दुबे के पुत्र",
              ae_layer: "Page3_GroomParents",
              field_id: "groom_parents"
            },
            {
              type: "text",
              label: "Venue Text",
              value: "ग्रैंड हयात होटल, फेज़ 2, अहमदाबाद, गुजरात - 380001",
              ae_layer: "Page3_Venue",
              field_id: "venue_repeat"
            }
          ],
          page_id: "P3",
          page_number: 3
        },
        {
          media: [
            {
              url: "/api/media/Ind/IndWedpho_a4.png",
              type: "image",
              position: "background"
            }
          ],
          fields: [
            {
              type: "text",
              label: "Haldi Event Title",
              value: "हल्दी की कहानियाँ",
              ae_layer: "Page4_EventTitle",
              field_id: "event_title"
            },
            {
              type: "text",
              label: "Event Date",
              value: "सोमवार, 14 अक्टूबर 2025",
              ae_layer: "Page4_EventDate",
              field_id: "event_date"
            },
            {
              type: "text",
              label: "Event Subtitle",
              value: "फूलों की हल्दी",
              ae_layer: "Page4_Subtitle",
              field_id: "event_subtitle"
            },
            {
              type: "text",
              label: "Event Time",
              value: "रात्रि 12:00 बजे से",
              ae_layer: "Page4_EventTime",
              field_id: "event_time"
            },
            {
              type: "text",
              label: "Event Venue",
              value: "ग्रैंड हयात होटल, फेज़ 2, अहमदाबाद, गुजरात - 380001",
              ae_layer: "Page4_EventVenue",
              field_id: "event_venue"
            }
          ],
          page_id: "P4",
          page_number: 4
        },
        {
          media: [
            {
              url: "/api/media/Ind/IndWedpho_a9.png",
              type: "image",
              position: "background"
            }
          ],
          fields: [
            {
              type: "text",
              label: "Initials",
              value: "SA",
              ae_layer: "Page9_Initials",
              field_id: "initials_9"
            },
            {
              type: "text",
              label: "Guest Title",
              value: "दर्शनाभिलाषी",
              ae_layer: "Page9_GuestTitle",
              field_id: "guest_title"
            },
            {
              type: "text",
              label: "Guest 1",
              value: "Dr. आराध्या और Dr. मुकेश भट्ट",
              ae_layer: "Page9_Guest1",
              field_id: "guest_1"
            },
            {
              type: "text",
              label: "Guest 2",
              value: "श्रीमती. नव्या और Dr. अंगद भट्ट",
              ae_layer: "Page9_Guest2",
              field_id: "guest_2"
            },
            {
              type: "text",
              label: "Guest 3",
              value: "स्वागतकर्ता",
              ae_layer: "Page9_Guest3",
              field_id: "guest_3"
            },
            {
              type: "text",
              label: "Guest 4",
              value: "Dr. मयूरी और पवन आहूजा",
              ae_layer: "Page9_Guest4",
              field_id: "guest_4"
            },
            {
              type: "text",
              label: "Guest 5",
              value: "पूजा और वैभव भट्ट",
              ae_layer: "Page9_Guest5",
              field_id: "guest_5"
            },
            {
              type: "text",
              label: "Guest 6",
              value: "Dr. निमिषा और Dr. करण सिंह",
              ae_layer: "Page9_Guest6",
              field_id: "guest_6"
            }
          ],
          page_id: "P5",
          page_number: 5
        }
      ]
    };

    const [template1] = await db
      .insert(templates)
      .values({
        slug: "indian-hindu-wedding-invite",
        templateName: "Indian Hindu Wedding Invite",
        templateType: "wedding",
        currency: "INR",
        price: "1200.00",
        durationSec: 30,
        previewImageUrl: "/attached_assets/Traditional-Indian-Wedding-Invitation-with-Couple-Portrait-Marigold-Garlands-Red-Gold-Theme_1763619463803.jpg",
        previewVideoUrl: "/api/media/Ind/IndWedVid_a.mp4",
        templateJson: template1Json,
        orientation: "portrait",
        photoOption: "with_photo",
        templateTags: ["hindu", "marathi", "indian", "wedding", "save-the-date"],
        thumbnailUrl: "/api/media/Ind/IndWedpho_a9.png",
      })
      .onConflictDoNothing()
      .returning();

    console.log("✅ Template 1 created:", template1?.templateName);

    // Template 2: Similar Indian Wedding (different names/dates) - uses same images
    const template2Json = {
      pages: [
        {
          media: [
            {
              url: "/api/media/Ind/IndWedpho_a1.png",
              type: "image",
              position: "background"
            }
          ],
          fields: [
            {
              type: "text",
              label: "Main Title Line 1",
              value: "विवाह",
              ae_layer: "Page1_TitleLine1",
              field_id: "title_1"
            },
            {
              type: "text",
              label: "Main Title Line 2",
              value: "निमंत्रण",
              ae_layer: "Page1_TitleLine2",
              field_id: "title_2"
            }
          ],
          page_id: "P1",
          page_number: 1
        },
        {
          media: [
            {
              url: "/api/media/Ind/IndWedpho_a2.png",
              type: "image",
              position: "background"
            }
          ],
          fields: [
            {
              type: "text",
              label: "Ganesh Mantra",
              value: "|| श्री गणेशाय नमः ||",
              ae_layer: "Page2_Mantra",
              field_id: "mantra"
            },
            {
              type: "text",
              label: "Initials",
              value: "PR",
              ae_layer: "Page2_Initials",
              field_id: "initials"
            },
            {
              type: "text",
              label: "Couple Names",
              value: "प्रिया और राज",
              ae_layer: "Page2_CoupleNames",
              field_id: "couple_names"
            },
            {
              type: "text",
              label: "Wedding Dates",
              value: "20 और 21 नवंबर, 2025",
              ae_layer: "Page2_Dates",
              field_id: "wedding_dates"
            },
            {
              type: "text",
              label: "Venue",
              value: "ताज पैलेस होटल, मुंबई, महाराष्ट्र - 400001",
              ae_layer: "Page2_Venue",
              field_id: "venue"
            }
          ],
          page_id: "P2",
          page_number: 2
        }
      ]
    };

    const [template2] = await db
      .insert(templates)
      .values({
        slug: "indian-wedding-elegant",
        templateName: "Indian Wedding - Elegant Style",
        templateType: "wedding",
        currency: "INR",
        price: "1500.00",
        durationSec: 30,
        previewImageUrl: "/attached_assets/Traditional-Indian-Wedding-Invitation-with-Couple-Portrait-Marigold-Garlands-Red-Gold-Theme_1763619463803.jpg",
        previewVideoUrl: "/api/media/Ind/IndWedVid_a.mp4",
        templateJson: template2Json,
        orientation: "portrait",
        photoOption: "with_photo",
        templateTags: ["hindu", "indian", "wedding", "elegant"],
        thumbnailUrl: "/api/media/Ind/IndWedpho_a1.png",
      })
      .onConflictDoNothing()
      .returning();

    console.log("✅ Template 2 created:", template2?.templateName);

    // ========== 16 PORTRAIT TEMPLATES (6 cards + 10 videos) ==========
    
    // PORTRAIT CARD 1: Wedding Card - Simple
    await db.insert(templates).values({
      slug: "wedding-card-simple",
      templateName: "शादी का कार्ड - सिंपल",
      templateType: "card",
      currency: "INR",
      price: "1200.00",
      durationSec: 15,
      previewImageUrl: "/attached_assets/Traditional-Indian-Wedding-Invitation-with-Couple-Portrait-Marigold-Garlands-Red-Gold-Theme_1763619463803.jpg",
      previewVideoUrl: "/api/media/Ind/IndWedVid_a.mp4",
      orientation: "portrait",
      photoOption: "with_photo",
      templateTags: ["wedding", "card", "simple", "hindi"],
      thumbnailUrl: "/api/media/Ind/IndWedpho_a1.png",
      templateJson: { pages: [{ page_id: "P1", page_number: 1, media: [{ url: "/api/media/Ind/IndWedpho_a1.png", type: "image", position: "background" }], fields: [{ type: "text", label: "शादी", value: "शुभ विवाह", ae_layer: "Title", field_id: "title" }] }] }
    }).onConflictDoNothing();

    // PORTRAIT CARD 2: Wedding Card - Elegant  
    await db.insert(templates).values({
      slug: "wedding-card-elegant",
      templateName: "विवाह निमंत्रण - एलीगेंट",
      templateType: "card",
      currency: "INR",
      price: "1400.00",
      durationSec: 20,
      previewImageUrl: "/attached_assets/Traditional-Indian-Wedding-Invitation-with-Couple-Portrait-Marigold-Garlands-Red-Gold-Theme_1763619463803.jpg",
      previewVideoUrl: "/api/media/Ind/IndWedVid_a.mp4",
      orientation: "portrait",
      photoOption: "with_photo",
      templateTags: ["wedding", "card", "elegant", "marathi"],
      thumbnailUrl: "/api/media/Ind/IndWedpho_a2.png",
      templateJson: { pages: [{ page_id: "P1", page_number: 1, media: [{ url: "/api/media/Ind/IndWedpho_a2.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Title", value: "लग्न निमंत्रण", ae_layer: "Title", field_id: "title" }] }, { page_id: "P2", page_number: 2, media: [{ url: "/api/media/Ind/IndWedpho_a3.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Details", value: "सादर आमंत्रण", ae_layer: "Details", field_id: "details" }] }] }
    }).onConflictDoNothing();

    // PORTRAIT CARD 3: Birthday Card - Cute
    await db.insert(templates).values({
      slug: "birthday-card-cute",
      templateName: "जन्मदिन कार्ड - क्यूट",
      templateType: "card",
      currency: "INR",
      price: "800.00",
      durationSec: 10,
      previewImageUrl: "/attached_assets/Traditional-Indian-Wedding-Invitation-with-Couple-Portrait-Marigold-Garlands-Red-Gold-Theme_1763619463803.jpg",
      previewVideoUrl: "/api/media/Ind/IndWedVid_a.mp4",
      orientation: "portrait",
      photoOption: "with_photo",
      templateTags: ["birthday", "card", "cute", "celebration"],
      thumbnailUrl: "/api/media/Ind/IndWedpho_a4.png",
      templateJson: { pages: [{ page_id: "P1", page_number: 1, media: [{ url: "/api/media/Ind/IndWedpho_a4.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Birthday", value: "जन्मदिन मुबारक हो", ae_layer: "Title", field_id: "title" }] }] }
    }).onConflictDoNothing();

    // PORTRAIT CARD 4: Birthday Card - Fun
    await db.insert(templates).values({
      slug: "birthday-card-fun",
      templateName: "बर्थडे इन्वाइट - फन",
      templateType: "card",
      currency: "INR",
      price: "900.00",
      durationSec: 15,
      previewImageUrl: "/attached_assets/Traditional-Indian-Wedding-Invitation-with-Couple-Portrait-Marigold-Garlands-Red-Gold-Theme_1763619463803.jpg",
      previewVideoUrl: "/api/media/Ind/IndWedVid_a.mp4",
      orientation: "portrait",
      photoOption: "with_photo",
      templateTags: ["birthday", "card", "fun", "party"],
      thumbnailUrl: "/api/media/Ind/IndWedpho_a9.png",
      templateJson: { pages: [{ page_id: "P1", page_number: 1, media: [{ url: "/api/media/Ind/IndWedpho_a9.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Title", value: "पार्टी में आइए", ae_layer: "Title", field_id: "title" }] }, { page_id: "P2", page_number: 2, media: [{ url: "/api/media/Ind/IndWedpho_a1.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Details", value: "मस्ती करेंगे", ae_layer: "Details", field_id: "details" }] }] }
    }).onConflictDoNothing();

    // PORTRAIT CARD 5: Anniversary Card - Romantic
    await db.insert(templates).values({
      slug: "anniversary-card-romantic",
      templateName: "एनिवर्सरी कार्ड - रोमांटिक",
      templateType: "card",
      currency: "INR",
      price: "1000.00",
      durationSec: 15,
      previewImageUrl: "/attached_assets/Traditional-Indian-Wedding-Invitation-with-Couple-Portrait-Marigold-Garlands-Red-Gold-Theme_1763619463803.jpg",
      previewVideoUrl: "/api/media/Ind/IndWedVid_a.mp4",
      orientation: "portrait",
      photoOption: "with_photo",
      templateTags: ["anniversary", "card", "romantic", "celebration"],
      thumbnailUrl: "/api/media/Ind/IndWedpho_a1.png",
      templateJson: { pages: [{ page_id: "P1", page_number: 1, media: [{ url: "/api/media/Ind/IndWedpho_a2.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Anniversary", value: "वर्षगांठ की शुभकामनाएं", ae_layer: "Title", field_id: "title" }] }] }
    }).onConflictDoNothing();

    // PORTRAIT CARD 6: Anniversary Card - Elegant
    await db.insert(templates).values({
      slug: "anniversary-card-elegant",
      templateName: "सालगिरह - एलीगेंट",
      templateType: "card",
      currency: "INR",
      price: "1100.00",
      durationSec: 20,
      previewImageUrl: "/attached_assets/Traditional-Indian-Wedding-Invitation-with-Couple-Portrait-Marigold-Garlands-Red-Gold-Theme_1763619463803.jpg",
      previewVideoUrl: "/api/media/Ind/IndWedVid_a.mp4",
      orientation: "portrait",
      photoOption: "with_photo",
      templateTags: ["anniversary", "card", "elegant", "love"],
      thumbnailUrl: "/api/media/Ind/IndWedpho_a4.png",
      templateJson: { pages: [{ page_id: "P1", page_number: 1, media: [{ url: "/api/media/Ind/IndWedpho_a3.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Title", value: "प्यार का जश्न", ae_layer: "Title", field_id: "title" }] }, { page_id: "P2", page_number: 2, media: [{ url: "/api/media/Ind/IndWedpho_a4.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Message", value: "हमारे साथ मनाइए", ae_layer: "Message", field_id: "message" }] }] }
    }).onConflictDoNothing();

    // PORTRAIT VIDEO 1: Wedding - Premium 8 pages
    await db.insert(templates).values({
      slug: "wedding-video-premium",
      templateName: "शादी वीडियो - प्रीमियम",
      templateType: "video",
      currency: "INR",
      price: "2900.00",
      durationSec: 60,
      previewImageUrl: "/attached_assets/Traditional-Indian-Wedding-Invitation-with-Couple-Portrait-Marigold-Garlands-Red-Gold-Theme_1763619463803.jpg",
      previewVideoUrl: "/api/media/Ind/IndWedVid_a.mp4",
      orientation: "portrait",
      photoOption: "with_photo",
      templateTags: ["wedding", "video", "premium", "cinematic"],
      thumbnailUrl: "/api/media/Ind/IndWedpho_a2.png",
      templateJson: { pages: [
        { page_id: "P1", page_number: 1, media: [{ url: "/api/media/Ind/IndWedpho_a1.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Title", value: "शादी", ae_layer: "Title", field_id: "title" }] },
        { page_id: "P2", page_number: 2, media: [{ url: "/api/media/Ind/IndWedpho_a2.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Mantra", value: "|| श्री गणेशाय नमः ||", ae_layer: "Mantra", field_id: "mantra" }] },
        { page_id: "P3", page_number: 3, media: [{ url: "/api/media/Ind/IndWedpho_a3.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Couple", value: "दुल्हन और दूल्हा", ae_layer: "Couple", field_id: "couple" }] },
        { page_id: "P4", page_number: 4, media: [{ url: "/api/media/Ind/IndWedpho_a4.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Event", value: "हल्दी समारोह", ae_layer: "Event", field_id: "event" }] },
        { page_id: "P5", page_number: 5, media: [{ url: "/api/media/Ind/IndWedpho_a9.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Mehndi", value: "मेहंदी रस्म", ae_layer: "Mehndi", field_id: "mehndi" }] },
        { page_id: "P6", page_number: 6, media: [{ url: "/api/media/Ind/IndWedpho_a1.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Sangeet", value: "संगीत संध्या", ae_layer: "Sangeet", field_id: "sangeet" }] },
        { page_id: "P7", page_number: 7, media: [{ url: "/api/media/Ind/IndWedpho_a2.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Reception", value: "रिसेप्शन पार्टी", ae_layer: "Reception", field_id: "reception" }] },
        { page_id: "P8", page_number: 8, media: [{ url: "/api/media/Ind/IndWedpho_a3.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Thanks", value: "धन्यवाद", ae_layer: "Thanks", field_id: "thanks" }] }
      ]}
    }).onConflictDoNothing();

    // PORTRAIT VIDEO 2: Wedding - Royal 6 pages
    await db.insert(templates).values({
      slug: "wedding-video-royal",
      templateName: "विवाह - रॉयल स्टाइल",
      templateType: "video",
      currency: "INR",
      price: "2500.00",
      durationSec: 50,
      previewImageUrl: "/attached_assets/Traditional-Indian-Wedding-Invitation-with-Couple-Portrait-Marigold-Garlands-Red-Gold-Theme_1763619463803.jpg",
      previewVideoUrl: "/api/media/Ind/IndWedVid_a.mp4",
      orientation: "portrait",
      photoOption: "with_photo",
      templateTags: ["wedding", "video", "royal", "grand"],
      thumbnailUrl: "/api/media/Ind/IndWedpho_a3.png",
      templateJson: { pages: [
        { page_id: "P1", page_number: 1, media: [{ url: "/api/media/Ind/IndWedpho_a4.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Royal", value: "राजसी विवाह", ae_layer: "Title", field_id: "title" }] },
        { page_id: "P2", page_number: 2, media: [{ url: "/api/media/Ind/IndWedpho_a9.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Names", value: "वर और वधु", ae_layer: "Names", field_id: "names" }] },
        { page_id: "P3", page_number: 3, media: [{ url: "/api/media/Ind/IndWedpho_a1.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Date", value: "शादी की तारीख", ae_layer: "Date", field_id: "date" }] },
        { page_id: "P4", page_number: 4, media: [{ url: "/api/media/Ind/IndWedpho_a2.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Venue", value: "स्थान", ae_layer: "Venue", field_id: "venue" }] },
        { page_id: "P5", page_number: 5, media: [{ url: "/api/media/Ind/IndWedpho_a3.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Events", value: "कार्यक्रम", ae_layer: "Events", field_id: "events" }] },
        { page_id: "P6", page_number: 6, media: [{ url: "/api/media/Ind/IndWedpho_a4.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Contact", value: "संपर्क करें", ae_layer: "Contact", field_id: "contact" }] }
      ]}
    }).onConflictDoNothing();

    // PORTRAIT VIDEO 3: Wedding - Traditional 5 pages
    await db.insert(templates).values({
      slug: "wedding-video-traditional",
      templateName: "पारंपरिक शादी वीडियो",
      templateType: "video",
      currency: "INR",
      price: "2000.00",
      durationSec: 45,
      previewImageUrl: "/attached_assets/Traditional-Indian-Wedding-Invitation-with-Couple-Portrait-Marigold-Garlands-Red-Gold-Theme_1763619463803.jpg",
      previewVideoUrl: "/api/media/Ind/IndWedVid_a.mp4",
      orientation: "portrait",
      photoOption: "with_photo",
      templateTags: ["wedding", "video", "traditional", "hindu"],
      thumbnailUrl: "/api/media/Ind/IndWedpho_a4.png",
      templateJson: { pages: [
        { page_id: "P1", page_number: 1, media: [{ url: "/api/media/Ind/IndWedpho_a1.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Welcome", value: "स्वागत है", ae_layer: "Welcome", field_id: "welcome" }] },
        { page_id: "P2", page_number: 2, media: [{ url: "/api/media/Ind/IndWedpho_a2.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Blessing", value: "आशीर्वाद", ae_layer: "Blessing", field_id: "blessing" }] },
        { page_id: "P3", page_number: 3, media: [{ url: "/api/media/Ind/IndWedpho_a3.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Couple", value: "जोड़ी", ae_layer: "Couple", field_id: "couple" }] },
        { page_id: "P4", page_number: 4, media: [{ url: "/api/media/Ind/IndWedpho_a4.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Ceremony", value: "विवाह संस्कार", ae_layer: "Ceremony", field_id: "ceremony" }] },
        { page_id: "P5", page_number: 5, media: [{ url: "/api/media/Ind/IndWedpho_a9.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Farewell", value: "विदाई", ae_layer: "Farewell", field_id: "farewell" }] }
      ]}
    }).onConflictDoNothing();

    // PORTRAIT VIDEO 4: Wedding - Modern 4 pages
    await db.insert(templates).values({
      slug: "wedding-video-modern",
      templateName: "मॉडर्न शादी इन्वाइट",
      templateType: "video",
      currency: "INR",
      price: "1800.00",
      durationSec: 35,
      previewImageUrl: "/attached_assets/Traditional-Indian-Wedding-Invitation-with-Couple-Portrait-Marigold-Garlands-Red-Gold-Theme_1763619463803.jpg",
      previewVideoUrl: "/api/media/Ind/IndWedVid_a.mp4",
      orientation: "portrait",
      photoOption: "with_photo",
      templateTags: ["wedding", "video", "modern", "contemporary"],
      thumbnailUrl: "/api/media/Ind/IndWedpho_a9.png",
      templateJson: { pages: [
        { page_id: "P1", page_number: 1, media: [{ url: "/api/media/Ind/IndWedpho_a9.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Modern", value: "मॉडर्न विवाह", ae_layer: "Title", field_id: "title" }] },
        { page_id: "P2", page_number: 2, media: [{ url: "/api/media/Ind/IndWedpho_a1.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Us", value: "हम दोनों", ae_layer: "Us", field_id: "us" }] },
        { page_id: "P3", page_number: 3, media: [{ url: "/api/media/Ind/IndWedpho_a2.png", type: "image", position: "background" }], fields: [{ type: "text", label: "When", value: "कब और कहाँ", ae_layer: "When", field_id: "when" }] },
        { page_id: "P4", page_number: 4, media: [{ url: "/api/media/Ind/IndWedpho_a3.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Join", value: "शामिल हों", ae_layer: "Join", field_id: "join" }] }
      ]}
    }).onConflictDoNothing();

    // PORTRAIT VIDEO 5: Birthday - Grand 7 pages
    await db.insert(templates).values({
      slug: "birthday-video-grand",
      templateName: "ग्रैंड बर्थडे - वीडियो",
      templateType: "video",
      currency: "INR",
      price: "2200.00",
      durationSec: 50,
      previewImageUrl: "/attached_assets/Traditional-Indian-Wedding-Invitation-with-Couple-Portrait-Marigold-Garlands-Red-Gold-Theme_1763619463803.jpg",
      previewVideoUrl: "/api/media/Ind/IndWedVid_a.mp4",
      orientation: "portrait",
      photoOption: "with_photo",
      templateTags: ["birthday", "video", "grand", "celebration"],
      thumbnailUrl: "/api/media/Ind/IndWedpho_a1.png",
      templateJson: { pages: [
        { page_id: "P1", page_number: 1, media: [{ url: "/api/media/Ind/IndWedpho_a4.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Birthday", value: "जन्मदिन की पार्टी", ae_layer: "Title", field_id: "title" }] },
        { page_id: "P2", page_number: 2, media: [{ url: "/api/media/Ind/IndWedpho_a9.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Name", value: "मुख्य अतिथि", ae_layer: "Name", field_id: "name" }] },
        { page_id: "P3", page_number: 3, media: [{ url: "/api/media/Ind/IndWedpho_a1.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Age", value: "उम्र मुबारक", ae_layer: "Age", field_id: "age" }] },
        { page_id: "P4", page_number: 4, media: [{ url: "/api/media/Ind/IndWedpho_a2.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Theme", value: "थीम पार्टी", ae_layer: "Theme", field_id: "theme" }] },
        { page_id: "P5", page_number: 5, media: [{ url: "/api/media/Ind/IndWedpho_a3.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Venue", value: "पार्टी का स्थान", ae_layer: "Venue", field_id: "venue" }] },
        { page_id: "P6", page_number: 6, media: [{ url: "/api/media/Ind/IndWedpho_a4.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Time", value: "समय और तारीख", ae_layer: "Time", field_id: "time" }] },
        { page_id: "P7", page_number: 7, media: [{ url: "/api/media/Ind/IndWedpho_a9.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Thanks", value: "आपका स्वागत है", ae_layer: "Thanks", field_id: "thanks" }] }
      ]}
    }).onConflictDoNothing();

    // PORTRAIT VIDEO 6: Birthday - Kids 5 pages
    await db.insert(templates).values({
      slug: "birthday-video-kids",
      templateName: "किड्स बर्थडे - मस्ती",
      templateType: "video",
      currency: "INR",
      price: "1600.00",
      durationSec: 40,
      previewImageUrl: "/attached_assets/Traditional-Indian-Wedding-Invitation-with-Couple-Portrait-Marigold-Garlands-Red-Gold-Theme_1763619463803.jpg",
      previewVideoUrl: "/api/media/Ind/IndWedVid_a.mp4",
      orientation: "portrait",
      photoOption: "with_photo",
      templateTags: ["birthday", "video", "kids", "fun"],
      thumbnailUrl: "/api/media/Ind/IndWedpho_a2.png",
      templateJson: { pages: [
        { page_id: "P1", page_number: 1, media: [{ url: "/api/media/Ind/IndWedpho_a1.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Fun", value: "मस्ती का दिन", ae_layer: "Title", field_id: "title" }] },
        { page_id: "P2", page_number: 2, media: [{ url: "/api/media/Ind/IndWedpho_a2.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Child", value: "बच्चे का नाम", ae_layer: "Child", field_id: "child" }] },
        { page_id: "P3", page_number: 3, media: [{ url: "/api/media/Ind/IndWedpho_a3.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Games", value: "खेल कूद", ae_layer: "Games", field_id: "games" }] },
        { page_id: "P4", page_number: 4, media: [{ url: "/api/media/Ind/IndWedpho_a4.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Cake", value: "केक काटेंगे", ae_layer: "Cake", field_id: "cake" }] },
        { page_id: "P5", page_number: 5, media: [{ url: "/api/media/Ind/IndWedpho_a9.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Join", value: "जरूर आना", ae_layer: "Join", field_id: "join" }] }
      ]}
    }).onConflictDoNothing();

    // PORTRAIT VIDEO 7: Birthday - Adult 3 pages
    await db.insert(templates).values({
      slug: "birthday-video-adult",
      templateName: "बड़ों का जन्मदिन",
      templateType: "video",
      currency: "INR",
      price: "1400.00",
      durationSec: 30,
      previewImageUrl: "/attached_assets/Traditional-Indian-Wedding-Invitation-with-Couple-Portrait-Marigold-Garlands-Red-Gold-Theme_1763619463803.jpg",
      previewVideoUrl: "/api/media/Ind/IndWedVid_a.mp4",
      orientation: "portrait",
      photoOption: "with_photo",
      templateTags: ["birthday", "video", "adult", "elegant"],
      thumbnailUrl: "/api/media/Ind/IndWedpho_a3.png",
      templateJson: { pages: [
        { page_id: "P1", page_number: 1, media: [{ url: "/api/media/Ind/IndWedpho_a9.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Celebration", value: "जश्न मनाएं", ae_layer: "Title", field_id: "title" }] },
        { page_id: "P2", page_number: 2, media: [{ url: "/api/media/Ind/IndWedpho_a1.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Person", value: "जन्मदिन मनाने वाले", ae_layer: "Person", field_id: "person" }] },
        { page_id: "P3", page_number: 3, media: [{ url: "/api/media/Ind/IndWedpho_a2.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Details", value: "विवरण", ae_layer: "Details", field_id: "details" }] }
      ]}
    }).onConflictDoNothing();

    // PORTRAIT VIDEO 8: Anniversary - Golden 6 pages
    await db.insert(templates).values({
      slug: "anniversary-video-golden",
      templateName: "गोल्डन एनिवर्सरी वीडियो",
      templateType: "video",
      currency: "INR",
      price: "2600.00",
      durationSec: 55,
      previewImageUrl: "/attached_assets/Traditional-Indian-Wedding-Invitation-with-Couple-Portrait-Marigold-Garlands-Red-Gold-Theme_1763619463803.jpg",
      previewVideoUrl: "/api/media/Ind/IndWedVid_a.mp4",
      orientation: "portrait",
      photoOption: "with_photo",
      templateTags: ["anniversary", "video", "golden", "premium"],
      thumbnailUrl: "/api/media/Ind/IndWedpho_a4.png",
      templateJson: { pages: [
        { page_id: "P1", page_number: 1, media: [{ url: "/api/media/Ind/IndWedpho_a3.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Golden", value: "50 साल पूरे", ae_layer: "Title", field_id: "title" }] },
        { page_id: "P2", page_number: 2, media: [{ url: "/api/media/Ind/IndWedpho_a4.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Couple", value: "प्यारा जोड़ा", ae_layer: "Couple", field_id: "couple" }] },
        { page_id: "P3", page_number: 3, media: [{ url: "/api/media/Ind/IndWedpho_a9.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Journey", value: "यादों का सफर", ae_layer: "Journey", field_id: "journey" }] },
        { page_id: "P4", page_number: 4, media: [{ url: "/api/media/Ind/IndWedpho_a1.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Family", value: "परिवार", ae_layer: "Family", field_id: "family" }] },
        { page_id: "P5", page_number: 5, media: [{ url: "/api/media/Ind/IndWedpho_a2.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Celebration", value: "समारोह", ae_layer: "Celebration", field_id: "celebration" }] },
        { page_id: "P6", page_number: 6, media: [{ url: "/api/media/Ind/IndWedpho_a3.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Blessings", value: "आशीर्वाद दें", ae_layer: "Blessings", field_id: "blessings" }] }
      ]}
    }).onConflictDoNothing();

    // PORTRAIT VIDEO 9: Anniversary - Silver 4 pages
    await db.insert(templates).values({
      slug: "anniversary-video-silver",
      templateName: "सिल्वर एनिवर्सरी",
      templateType: "video",
      currency: "INR",
      price: "1900.00",
      durationSec: 40,
      previewImageUrl: "/attached_assets/Traditional-Indian-Wedding-Invitation-with-Couple-Portrait-Marigold-Garlands-Red-Gold-Theme_1763619463803.jpg",
      previewVideoUrl: "/api/media/Ind/IndWedVid_a.mp4",
      orientation: "portrait",
      photoOption: "with_photo",
      templateTags: ["anniversary", "video", "silver", "celebration"],
      thumbnailUrl: "/api/media/Ind/IndWedpho_a9.png",
      templateJson: { pages: [
        { page_id: "P1", page_number: 1, media: [{ url: "/api/media/Ind/IndWedpho_a4.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Silver", value: "25 साल का प्यार", ae_layer: "Title", field_id: "title" }] },
        { page_id: "P2", page_number: 2, media: [{ url: "/api/media/Ind/IndWedpho_a9.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Together", value: "साथ-साथ", ae_layer: "Together", field_id: "together" }] },
        { page_id: "P3", page_number: 3, media: [{ url: "/api/media/Ind/IndWedpho_a1.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Party", value: "पार्टी में आइए", ae_layer: "Party", field_id: "party" }] },
        { page_id: "P4", page_number: 4, media: [{ url: "/api/media/Ind/IndWedpho_a2.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Wishes", value: "शुभकामनाएं", ae_layer: "Wishes", field_id: "wishes" }] }
      ]}
    }).onConflictDoNothing();

    // PORTRAIT VIDEO 10: Anniversary - Love 3 pages
    await db.insert(templates).values({
      slug: "anniversary-video-love",
      templateName: "प्यार की सालगिरह",
      templateType: "video",
      currency: "INR",
      price: "1500.00",
      durationSec: 30,
      previewImageUrl: "/attached_assets/Traditional-Indian-Wedding-Invitation-with-Couple-Portrait-Marigold-Garlands-Red-Gold-Theme_1763619463803.jpg",
      previewVideoUrl: "/api/media/Ind/IndWedVid_a.mp4",
      orientation: "portrait",
      photoOption: "with_photo",
      templateTags: ["anniversary", "video", "love", "romantic"],
      thumbnailUrl: "/api/media/Ind/IndWedpho_a1.png",
      templateJson: { pages: [
        { page_id: "P1", page_number: 1, media: [{ url: "/api/media/Ind/IndWedpho_a2.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Love", value: "प्यार का जश्न", ae_layer: "Title", field_id: "title" }] },
        { page_id: "P2", page_number: 2, media: [{ url: "/api/media/Ind/IndWedpho_a3.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Us", value: "हम दोनों", ae_layer: "Us", field_id: "us" }] },
        { page_id: "P3", page_number: 3, media: [{ url: "/api/media/Ind/IndWedpho_a4.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Celebrate", value: "मनाइए हमारे साथ", ae_layer: "Celebrate", field_id: "celebrate" }] }
      ]}
    }).onConflictDoNothing();

    console.log("✅ Added 16 PORTRAIT templates (6 cards + 10 videos)");

    // ========== 12 LANDSCAPE TEMPLATES (4 cards + 8 videos) ==========

    // LANDSCAPE CARD 1: Wedding
    await db.insert(templates).values({
      slug: "wedding-card-landscape",
      templateName: "शादी कार्ड - लैंडस्केप",
      templateType: "card",
      currency: "INR",
      price: "1300.00",
      durationSec: 15,
      previewImageUrl: "/attached_assets/Traditional-Indian-Wedding-Invitation-with-Couple-Portrait-Marigold-Garlands-Red-Gold-Theme_1763619463803.jpg",
      previewVideoUrl: "/api/media/Ind/IndWedVid_a.mp4",
      orientation: "landscape",
      photoOption: "with_photo",
      templateTags: ["wedding", "card", "landscape", "wide"],
      thumbnailUrl: "/api/media/Ind/IndWedpho_a2.png",
      templateJson: { pages: [{ page_id: "P1", page_number: 1, media: [{ url: "/api/media/Ind/IndWedpho_a1.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Title", value: "विवाह समारोह", ae_layer: "Title", field_id: "title" }] }] }
    }).onConflictDoNothing();

    // LANDSCAPE CARD 2: Birthday
    await db.insert(templates).values({
      slug: "birthday-card-landscape",
      templateName: "बर्थडे कार्ड - वाइड",
      templateType: "card",
      currency: "INR",
      price: "850.00",
      durationSec: 12,
      previewImageUrl: "/attached_assets/Traditional-Indian-Wedding-Invitation-with-Couple-Portrait-Marigold-Garlands-Red-Gold-Theme_1763619463803.jpg",
      previewVideoUrl: "/api/media/Ind/IndWedVid_a.mp4",
      orientation: "landscape",
      photoOption: "with_photo",
      templateTags: ["birthday", "card", "landscape", "party"],
      thumbnailUrl: "/api/media/Ind/IndWedpho_a3.png",
      templateJson: { pages: [{ page_id: "P1", page_number: 1, media: [{ url: "/api/media/Ind/IndWedpho_a4.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Birthday", value: "जन्मदिन पार्टी", ae_layer: "Title", field_id: "title" }] }] }
    }).onConflictDoNothing();

    // LANDSCAPE CARD 3: Anniversary
    await db.insert(templates).values({
      slug: "anniversary-card-landscape",
      templateName: "एनिवर्सरी - लैंडस्केप",
      templateType: "card",
      currency: "INR",
      price: "1050.00",
      durationSec: 15,
      previewImageUrl: "/attached_assets/Traditional-Indian-Wedding-Invitation-with-Couple-Portrait-Marigold-Garlands-Red-Gold-Theme_1763619463803.jpg",
      previewVideoUrl: "/api/media/Ind/IndWedpho_a.mp4",
      orientation: "landscape",
      photoOption: "with_photo",
      templateTags: ["anniversary", "card", "landscape", "celebration"],
      thumbnailUrl: "/api/media/Ind/IndWedpho_a4.png",
      templateJson: { pages: [{ page_id: "P1", page_number: 1, media: [{ url: "/api/media/Ind/IndWedpho_a2.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Anniversary", value: "सालगिरह मुबारक", ae_layer: "Title", field_id: "title" }] }] }
    }).onConflictDoNothing();

    // LANDSCAPE CARD 4: Wedding Simple 2 pages
    await db.insert(templates).values({
      slug: "wedding-simple-landscape",
      templateName: "सिंपल शादी - वाइड",
      templateType: "card",
      currency: "INR",
      price: "1450.00",
      durationSec: 20,
      previewImageUrl: "/attached_assets/Traditional-Indian-Wedding-Invitation-with-Couple-Portrait-Marigold-Garlands-Red-Gold-Theme_1763619463803.jpg",
      previewVideoUrl: "/api/media/Ind/IndWedVid_a.mp4",
      orientation: "landscape",
      photoOption: "with_photo",
      templateTags: ["wedding", "card", "landscape", "simple"],
      thumbnailUrl: "/api/media/Ind/IndWedpho_a9.png",
      templateJson: { pages: [
        { page_id: "P1", page_number: 1, media: [{ url: "/api/media/Ind/IndWedpho_a3.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Welcome", value: "स्वागत", ae_layer: "Welcome", field_id: "welcome" }] },
        { page_id: "P2", page_number: 2, media: [{ url: "/api/media/Ind/IndWedpho_a4.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Details", value: "विवरण", ae_layer: "Details", field_id: "details" }] }
      ]}
    }).onConflictDoNothing();

    // LANDSCAPE VIDEO 1: Wedding Cinematic 5 pages
    await db.insert(templates).values({
      slug: "wedding-cinematic-landscape",
      templateName: "सिनेमैटिक शादी - वाइड",
      templateType: "video",
      currency: "INR",
      price: "2700.00",
      durationSec: 50,
      previewImageUrl: "/attached_assets/Traditional-Indian-Wedding-Invitation-with-Couple-Portrait-Marigold-Garlands-Red-Gold-Theme_1763619463803.jpg",
      previewVideoUrl: "/api/media/Ind/IndWedVid_a.mp4",
      orientation: "landscape",
      photoOption: "with_photo",
      templateTags: ["wedding", "video", "landscape", "cinematic"],
      thumbnailUrl: "/api/media/Ind/IndWedpho_a1.png",
      templateJson: { pages: [
        { page_id: "P1", page_number: 1, media: [{ url: "/api/media/Ind/IndWedpho_a1.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Opening", value: "शुभारंभ", ae_layer: "Opening", field_id: "opening" }] },
        { page_id: "P2", page_number: 2, media: [{ url: "/api/media/Ind/IndWedpho_a2.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Story", value: "हमारी कहानी", ae_layer: "Story", field_id: "story" }] },
        { page_id: "P3", page_number: 3, media: [{ url: "/api/media/Ind/IndWedpho_a3.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Wedding", value: "शादी", ae_layer: "Wedding", field_id: "wedding" }] },
        { page_id: "P4", page_number: 4, media: [{ url: "/api/media/Ind/IndWedpho_a4.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Invitation", value: "निमंत्रण", ae_layer: "Invitation", field_id: "invitation" }] },
        { page_id: "P5", page_number: 5, media: [{ url: "/api/media/Ind/IndWedpho_a9.png", type: "image", position: "background" }], fields: [{ type: "text", label: "End", value: "धन्यवाद", ae_layer: "End", field_id: "end" }] }
      ]}
    }).onConflictDoNothing();

    // LANDSCAPE VIDEO 2: Wedding Grand 4 pages
    await db.insert(templates).values({
      slug: "wedding-grand-landscape",
      templateName: "ग्रैंड शादी - लैंडस्केप",
      templateType: "video",
      currency: "INR",
      price: "2300.00",
      durationSec: 40,
      previewImageUrl: "/attached_assets/Traditional-Indian-Wedding-Invitation-with-Couple-Portrait-Marigold-Garlands-Red-Gold-Theme_1763619463803.jpg",
      previewVideoUrl: "/api/media/Ind/IndWedVid_a.mp4",
      orientation: "landscape",
      photoOption: "with_photo",
      templateTags: ["wedding", "video", "landscape", "grand"],
      thumbnailUrl: "/api/media/Ind/IndWedpho_a2.png",
      templateJson: { pages: [
        { page_id: "P1", page_number: 1, media: [{ url: "/api/media/Ind/IndWedpho_a9.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Grand", value: "भव्य विवाह", ae_layer: "Title", field_id: "title" }] },
        { page_id: "P2", page_number: 2, media: [{ url: "/api/media/Ind/IndWedpho_a1.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Couple", value: "वर-वधू", ae_layer: "Couple", field_id: "couple" }] },
        { page_id: "P3", page_number: 3, media: [{ url: "/api/media/Ind/IndWedpho_a2.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Events", value: "समारोह", ae_layer: "Events", field_id: "events" }] },
        { page_id: "P4", page_number: 4, media: [{ url: "/api/media/Ind/IndWedpho_a3.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Join", value: "पधारें", ae_layer: "Join", field_id: "join" }] }
      ]}
    }).onConflictDoNothing();

    // LANDSCAPE VIDEO 3: Wedding Traditional 3 pages
    await db.insert(templates).values({
      slug: "wedding-traditional-landscape",
      templateName: "पारंपरिक विवाह - वाइड",
      templateType: "video",
      currency: "INR",
      price: "1850.00",
      durationSec: 35,
      previewImageUrl: "/attached_assets/Traditional-Indian-Wedding-Invitation-with-Couple-Portrait-Marigold-Garlands-Red-Gold-Theme_1763619463803.jpg",
      previewVideoUrl: "/api/media/Ind/IndWedVid_a.mp4",
      orientation: "landscape",
      photoOption: "with_photo",
      templateTags: ["wedding", "video", "landscape", "traditional"],
      thumbnailUrl: "/api/media/Ind/IndWedpho_a3.png",
      templateJson: { pages: [
        { page_id: "P1", page_number: 1, media: [{ url: "/api/media/Ind/IndWedpho_a4.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Traditional", value: "पारंपरिक रस्म", ae_layer: "Title", field_id: "title" }] },
        { page_id: "P2", page_number: 2, media: [{ url: "/api/media/Ind/IndWedpho_a9.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Family", value: "परिवार", ae_layer: "Family", field_id: "family" }] },
        { page_id: "P3", page_number: 3, media: [{ url: "/api/media/Ind/IndWedpho_a1.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Invite", value: "आमंत्रण", ae_layer: "Invite", field_id: "invite" }] }
      ]}
    }).onConflictDoNothing();

    // LANDSCAPE VIDEO 4: Birthday Party 6 pages
    await db.insert(templates).values({
      slug: "birthday-party-landscape",
      templateName: "बर्थडे पार्टी - वाइड वीडियो",
      templateType: "video",
      currency: "INR",
      price: "2100.00",
      durationSec: 45,
      previewImageUrl: "/attached_assets/Traditional-Indian-Wedding-Invitation-with-Couple-Portrait-Marigold-Garlands-Red-Gold-Theme_1763619463803.jpg",
      previewVideoUrl: "/api/media/Ind/IndWedVid_a.mp4",
      orientation: "landscape",
      photoOption: "with_photo",
      templateTags: ["birthday", "video", "landscape", "party"],
      thumbnailUrl: "/api/media/Ind/IndWedpho_a4.png",
      templateJson: { pages: [
        { page_id: "P1", page_number: 1, media: [{ url: "/api/media/Ind/IndWedpho_a1.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Party", value: "पार्टी टाइम", ae_layer: "Title", field_id: "title" }] },
        { page_id: "P2", page_number: 2, media: [{ url: "/api/media/Ind/IndWedpho_a2.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Birthday", value: "जन्मदिन", ae_layer: "Birthday", field_id: "birthday" }] },
        { page_id: "P3", page_number: 3, media: [{ url: "/api/media/Ind/IndWedpho_a3.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Celebration", value: "जश्न", ae_layer: "Celebration", field_id: "celebration" }] },
        { page_id: "P4", page_number: 4, media: [{ url: "/api/media/Ind/IndWedpho_a4.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Fun", value: "मस्ती", ae_layer: "Fun", field_id: "fun" }] },
        { page_id: "P5", page_number: 5, media: [{ url: "/api/media/Ind/IndWedpho_a9.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Venue", value: "स्थान", ae_layer: "Venue", field_id: "venue" }] },
        { page_id: "P6", page_number: 6, media: [{ url: "/api/media/Ind/IndWedpho_a1.png", type: "image", position: "background" }], fields: [{ type: "text", label: "RSVP", value: "आरएसवीपी", ae_layer: "RSVP", field_id: "rsvp" }] }
      ]}
    }).onConflictDoNothing();

    // LANDSCAPE VIDEO 5: Birthday Kids 4 pages
    await db.insert(templates).values({
      slug: "birthday-kids-landscape",
      templateName: "किड्स पार्टी - लैंडस्केप",
      templateType: "video",
      currency: "INR",
      price: "1700.00",
      durationSec: 35,
      previewImageUrl: "/attached_assets/Traditional-Indian-Wedding-Invitation-with-Couple-Portrait-Marigold-Garlands-Red-Gold-Theme_1763619463803.jpg",
      previewVideoUrl: "/api/media/Ind/IndWedVid_a.mp4",
      orientation: "landscape",
      photoOption: "with_photo",
      templateTags: ["birthday", "video", "landscape", "kids"],
      thumbnailUrl: "/api/media/Ind/IndWedpho_a9.png",
      templateJson: { pages: [
        { page_id: "P1", page_number: 1, media: [{ url: "/api/media/Ind/IndWedpho_a4.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Kids", value: "बच्चों की पार्टी", ae_layer: "Title", field_id: "title" }] },
        { page_id: "P2", page_number: 2, media: [{ url: "/api/media/Ind/IndWedpho_a9.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Child", value: "बच्चा", ae_layer: "Child", field_id: "child" }] },
        { page_id: "P3", page_number: 3, media: [{ url: "/api/media/Ind/IndWedpho_a1.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Theme", value: "थीम", ae_layer: "Theme", field_id: "theme" }] },
        { page_id: "P4", page_number: 4, media: [{ url: "/api/media/Ind/IndWedpho_a2.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Come", value: "आओ", ae_layer: "Come", field_id: "come" }] }
      ]}
    }).onConflictDoNothing();

    // LANDSCAPE VIDEO 6: Anniversary Celebration 5 pages
    await db.insert(templates).values({
      slug: "anniversary-celebration-landscape",
      templateName: "एनिवर्सरी सेलिब्रेशन - वाइड",
      templateType: "video",
      currency: "INR",
      price: "2400.00",
      durationSec: 45,
      previewImageUrl: "/attached_assets/Traditional-Indian-Wedding-Invitation-with-Couple-Portrait-Marigold-Garlands-Red-Gold-Theme_1763619463803.jpg",
      previewVideoUrl: "/api/media/Ind/IndWedVid_a.mp4",
      orientation: "landscape",
      photoOption: "with_photo",
      templateTags: ["anniversary", "video", "landscape", "celebration"],
      thumbnailUrl: "/api/media/Ind/IndWedpho_a1.png",
      templateJson: { pages: [
        { page_id: "P1", page_number: 1, media: [{ url: "/api/media/Ind/IndWedpho_a3.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Anniversary", value: "सालगिरह", ae_layer: "Title", field_id: "title" }] },
        { page_id: "P2", page_number: 2, media: [{ url: "/api/media/Ind/IndWedpho_a4.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Years", value: "साल", ae_layer: "Years", field_id: "years" }] },
        { page_id: "P3", page_number: 3, media: [{ url: "/api/media/Ind/IndWedpho_a9.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Love", value: "प्यार", ae_layer: "Love", field_id: "love" }] },
        { page_id: "P4", page_number: 4, media: [{ url: "/api/media/Ind/IndWedpho_a1.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Celebrate", value: "मनाएं", ae_layer: "Celebrate", field_id: "celebrate" }] },
        { page_id: "P5", page_number: 5, media: [{ url: "/api/media/Ind/IndWedpho_a2.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Thanks", value: "शुक्रिया", ae_layer: "Thanks", field_id: "thanks" }] }
      ]}
    }).onConflictDoNothing();

    // LANDSCAPE VIDEO 7: Anniversary Romantic 3 pages
    await db.insert(templates).values({
      slug: "anniversary-romantic-landscape",
      templateName: "रोमांटिक सालगिरह - वाइड",
      templateType: "video",
      currency: "INR",
      price: "1650.00",
      durationSec: 30,
      previewImageUrl: "/attached_assets/Traditional-Indian-Wedding-Invitation-with-Couple-Portrait-Marigold-Garlands-Red-Gold-Theme_1763619463803.jpg",
      previewVideoUrl: "/api/media/Ind/IndWedVid_a.mp4",
      orientation: "landscape",
      photoOption: "with_photo",
      templateTags: ["anniversary", "video", "landscape", "romantic"],
      thumbnailUrl: "/api/media/Ind/IndWedpho_a2.png",
      templateJson: { pages: [
        { page_id: "P1", page_number: 1, media: [{ url: "/api/media/Ind/IndWedpho_a2.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Romance", value: "रोमांस", ae_layer: "Title", field_id: "title" }] },
        { page_id: "P2", page_number: 2, media: [{ url: "/api/media/Ind/IndWedpho_a3.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Together", value: "साथ", ae_layer: "Together", field_id: "together" }] },
        { page_id: "P3", page_number: 3, media: [{ url: "/api/media/Ind/IndWedpho_a4.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Forever", value: "हमेशा", ae_layer: "Forever", field_id: "forever" }] }
      ]}
    }).onConflictDoNothing();

    // LANDSCAPE VIDEO 8: Anniversary Special 4 pages
    await db.insert(templates).values({
      slug: "anniversary-special-landscape",
      templateName: "स्पेशल एनिवर्सरी - लैंडस्केप",
      templateType: "video",
      currency: "INR",
      price: "2000.00",
      durationSec: 40,
      previewImageUrl: "/attached_assets/Traditional-Indian-Wedding-Invitation-with-Couple-Portrait-Marigold-Garlands-Red-Gold-Theme_1763619463803.jpg",
      previewVideoUrl: "/api/media/Ind/IndWedVid_a.mp4",
      orientation: "landscape",
      photoOption: "with_photo",
      templateTags: ["anniversary", "video", "landscape", "special"],
      thumbnailUrl: "/api/media/Ind/IndWedpho_a3.png",
      templateJson: { pages: [
        { page_id: "P1", page_number: 1, media: [{ url: "/api/media/Ind/IndWedpho_a9.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Special", value: "विशेष दिन", ae_layer: "Title", field_id: "title" }] },
        { page_id: "P2", page_number: 2, media: [{ url: "/api/media/Ind/IndWedpho_a1.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Milestone", value: "मील का पत्थर", ae_layer: "Milestone", field_id: "milestone" }] },
        { page_id: "P3", page_number: 3, media: [{ url: "/api/media/Ind/IndWedpho_a2.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Party", value: "पार्टी", ae_layer: "Party", field_id: "party" }] },
        { page_id: "P4", page_number: 4, media: [{ url: "/api/media/Ind/IndWedpho_a3.png", type: "image", position: "background" }], fields: [{ type: "text", label: "Join Us", value: "शामिल हों", ae_layer: "JoinUs", field_id: "joinus" }] }
      ]}
    }).onConflictDoNothing();

    console.log("✅ Added 12 LANDSCAPE templates (4 cards + 8 videos)");
    console.log("✅ Total NEW templates added: 28 (16 portrait + 12 landscape)");

    if (!user1 || !user2 || !template1 || !template2) {
      console.log("⚠️ Some records already exist, skipping project/order creation");
      return;
    }

    // Project 1: User 1 customizing Template 1 (PAID)
    const [project1] = await db
      .insert(projects)
      .values({
        userId: user1.id,
        templateId: template1.id,
        customization: {
          pages: [
            {
              media: [
                {
                  url: "/api/media/Ind/IndWedpho_a1.png",
                  type: "image",
                  position: "background"
                }
              ],
              fields: [
                {
                  type: "text",
                  label: "Main Title Line 1",
                  value: "शादी",
                  ae_layer: "Page1_TitleLine1",
                  field_id: "title_1"
                },
                {
                  type: "text",
                  label: "Main Title Line 2",
                  value: "का न्योता",
                  ae_layer: "Page1_TitleLine2",
                  field_id: "title_2"
                }
              ],
              page_id: "P1",
              page_number: 1
            }
          ]
        },
        status: "completed",
        previewUrl: "/api/media/Ind/IndWedVid_a.mp4",
        finalUrl: "/downloads/user1_final_wedding.mp4",
        paidAt: new Date(),
      })
      .returning();

    console.log("✅ Project 1 created for User 1 (PAID)");

    // Project 2: User 2 customizing Template 2 (NOT PAID - draft)
    const [project2] = await db
      .insert(projects)
      .values({
        userId: user2.id,
        templateId: template2.id,
        customization: {
          pages: [
            {
              media: [
                {
                  url: "/api/media/Ind/IndWedpho_a1.png",
                  type: "image",
                  position: "background"
                }
              ],
              fields: [
                {
                  type: "text",
                  label: "Main Title Line 1",
                  value: "विवाह",
                  ae_layer: "Page1_TitleLine1",
                  field_id: "title_1"
                }
              ],
              page_id: "P1",
              page_number: 1
            }
          ]
        },
        status: "draft",
        previewUrl: null,
        finalUrl: null,
        paidAt: null,
      })
      .returning();

    console.log("✅ Project 2 created for User 2 (NOT PAID - draft)");

    // Order 1: For User 1's paid project
    const [order1] = await db
      .insert(orders)
      .values({
        orderNumber: "ORD-20250120-001",
        userId: user1.id,
        projectId: project1.id,
        templateId: template1.id,
        amount: "1200.00",
        currency: "INR",
        status: "paid",
        paymentProvider: "razorpay",
        providerOrderId: "order_razorpay_123456",
      })
      .returning();

    console.log("✅ Order 1 created (PAID)");

    // Payment 1: Successful payment for Order 1
    await db
      .insert(payments)
      .values({
        orderId: order1.id,
        provider: "razorpay",
        status: "success",
        amount: "1200.00",
        currency: "INR",
        payload: {
          razorpay_payment_id: "pay_razorpay_abc123",
          razorpay_order_id: "order_razorpay_123456",
          razorpay_signature: "signature_xyz789",
        },
      });

    console.log("✅ Payment 1 created (SUCCESS)");

    // User Template 1: Purchase record for User 1
    await db
      .insert(userTemplates)
      .values({
        userId: user1.id,
        projectId: project1.id,
        purchaseAmount: "1200.00",
        razorpayOrderId: "order_razorpay_123456",
        razorpayPaymentId: "pay_razorpay_abc123",
      });

    console.log("✅ User Template 1 created (purchase record)");

    console.log("✅ Database seeded successfully!");
    console.log("\n📊 Summary:");
    console.log("- 6 Music tracks: wedding & birthday categories");
    console.log("- 2 Users: Aarti (PAID), Rajesh (NOT PAID)");
    console.log("- 2 Templates: Indian Hindu Wedding templates");
    console.log("- 2 Projects: 1 completed & paid, 1 draft");
    console.log("- 1 Order & Payment: User 1's successful purchase");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run the seed function if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seed()
    .then(() => {
      console.log("✨ Seeding complete!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Seeding failed:", error);
      process.exit(1);
    });
}
