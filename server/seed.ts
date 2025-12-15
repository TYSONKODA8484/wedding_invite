import { db } from "./db";
import { music, templates, type InsertMusic, type InsertTemplate } from "@shared/schema";

// AWS S3 Configuration
const AWS_S3_BASE_URL = process.env.AWS_S3_BASE_URL || "https://wedding-invite-bucket-1.s3.ap-south-1.amazonaws.com";

export async function seed() {
  console.log("🌱 Seeding fresh database...\n");

  try {
    // ==================== SEED MUSIC LIBRARY (6 tracks) ====================
    console.log("📀 Seeding music library...");
    const musicTracks: InsertMusic[] = [
      { name: "Epic Love Romantic", url: `${AWS_S3_BASE_URL}/music/default/epic-love-inspirational-romantic-cinematic-30-seconds-406069.mp3`, duration: 30, category: "wedding" },
      { name: "Hopeful Acoustic", url: `${AWS_S3_BASE_URL}/music/default/hopeful-acoustic-travel-30-seconds-368800.mp3`, duration: 30, category: "wedding" },
      { name: "Magical Orchestral", url: `${AWS_S3_BASE_URL}/music/default/magical-dramedy-orchestral-sneaky-spell-30-sec-375796.mp3`, duration: 30, category: "birthday" },
      { name: "Orchestral Joy", url: `${AWS_S3_BASE_URL}/music/default/orchestral-joy-30-sec-423312.mp3`, duration: 30, category: "birthday" },
      { name: "Enchanted Music", url: `${AWS_S3_BASE_URL}/music/default/sneaky-art-30-sec-enchanted-music-426698.mp3`, duration: 30, category: "wedding" },
      { name: "Uplifting Corporate", url: `${AWS_S3_BASE_URL}/music/default/uplifting-feelgood-30-seconds-corporate-430728.mp3`, duration: 30, category: "birthday" },
    ];

    const insertedMusic = await db.insert(music).values(musicTracks).returning();
    console.log(`✅ ${insertedMusic.length} music tracks seeded\n`);

    // Quick lookup by music name for default assignments
    const musicByName = Object.fromEntries(insertedMusic.map((m) => [m.name, m.id]));

    // ==================== SEED 8 TEMPLATES ====================
    console.log("📋 Seeding templates...\n");

    const templatesData: InsertTemplate[] = [
      // === WEDDING CATEGORY (4 templates) ===
      
      // 1. Wedding Card - Single Page - With Photo - Portrait
      {
        slug: "wedding-card-single-photo-portrait",
        templateName: "शादी का कार्ड - फोटो के साथ",
        templateType: "card",
        category: "wedding",
        subcategory: "invitation",
        region: "india",
        currency: "INR",
        price: "999.00",
        durationSec: 15,
        previewImageUrl: `${AWS_S3_BASE_URL}/template/page/IndWedpho_a1.png`,
        previewVideoUrl: `${AWS_S3_BASE_URL}/template/IndWedpho_a1.png`,
        orientation: "portrait",
        photoOption: "with_photo",
        templateTags: ["wedding", "card", "photo", "single-page", "hindi", "portrait"],
        thumbnailUrl: `${AWS_S3_BASE_URL}/template/page/IndWedpho_a1.png`,
        templateJson: {
          pages: [{
            page_id: "P1",
            page_number: 1,
            media: [{ url: `${AWS_S3_BASE_URL}/template/page/IndWedpho_a1.png`, type: "image", position: "background" }],
            fields: [
              { type: "text", label: "Main Title", value: "शादी का निमंत्रण", ae_layer: "MainTitle", field_id: "main_title" },
              { type: "text", label: "Bride Name", value: "प्रिया", ae_layer: "BrideName", field_id: "bride_name" },
              { type: "text", label: "Groom Name", value: "राहुल", ae_layer: "GroomName", field_id: "groom_name" },
              { type: "text", label: "Wedding Date", value: "15 फरवरी, 2025", ae_layer: "WeddingDate", field_id: "wedding_date" },
              { type: "text", label: "Venue", value: "ग्रैंड बॉलरूम, मुंबई", ae_layer: "Venue", field_id: "venue" },
              { type: "image", label: "Couple Photo", value: "", ae_layer: "CouplePhoto", field_id: "couple_photo" }
            ]
          }]
        }
      },

      // 2. Wedding Card - Multiple Pages - No Photo - Landscape
      {
        slug: "wedding-card-multi-no-photo-landscape",
        templateName: "विवाह निमंत्रण - मल्टी पेज",
        templateType: "card",
        category: "wedding",
        subcategory: "invitation",
        region: "india",
        currency: "INR",
        price: "1299.00",
        durationSec: 20,
        previewImageUrl: `${AWS_S3_BASE_URL}/template/page/IndWedpho_a2.png`,
        previewVideoUrl: `${AWS_S3_BASE_URL}/template/IndWedpho_a2.png`,
        orientation: "landscape",
        photoOption: "no_photo",
        templateTags: ["wedding", "card", "no-photo", "multi-page", "hindi", "landscape"],
        thumbnailUrl: `${AWS_S3_BASE_URL}/template/page/IndWedpho_a2.png`,
        templateJson: {
          pages: [
            {
              page_id: "P1",
              page_number: 1,
              media: [{ url: `${AWS_S3_BASE_URL}/template/page/IndWedpho_a2.png`, type: "image", position: "background" }],
              fields: [
                { type: "text", label: "Main Title", value: "शादी का निमंत्रण", ae_layer: "MainTitle", field_id: "main_title" },
                { type: "text", label: "Subtitle", value: "|| श्री गणेशाय नमः ||", ae_layer: "Subtitle", field_id: "subtitle" }
              ]
            },
            {
              page_id: "P2",
              page_number: 2,
              media: [{ url: `${AWS_S3_BASE_URL}/template/page/IndWedpho_a3.png`, type: "image", position: "background" }],
              fields: [
                { type: "text", label: "Bride Name", value: "आयशा शर्मा", ae_layer: "BrideName", field_id: "bride_name" },
                { type: "text", label: "Bride Parents", value: "श्रीमती सुनीता और श्री राजेश शर्मा की सुपुत्री", ae_layer: "BrideParents", field_id: "bride_parents" },
                { type: "text", label: "Groom Name", value: "विक्रम पटेल", ae_layer: "GroomName", field_id: "groom_name" },
                { type: "text", label: "Groom Parents", value: "श्रीमती मीना और श्री अमित पटेल के सुपुत्र", ae_layer: "GroomParents", field_id: "groom_parents" }
              ]
            },
            {
              page_id: "P3",
              page_number: 3,
              media: [{ url: `${AWS_S3_BASE_URL}/template/page/IndWedpho_a4.png`, type: "image", position: "background" }],
              fields: [
                { type: "text", label: "Event Title", value: "विवाह समारोह", ae_layer: "EventTitle", field_id: "event_title" },
                { type: "text", label: "Event Date", value: "शुक्रवार, 20 फरवरी 2025", ae_layer: "EventDate", field_id: "event_date" },
                { type: "text", label: "Event Time", value: "सायं 6:00 बजे से", ae_layer: "EventTime", field_id: "event_time" },
                { type: "text", label: "Venue", value: "राज महल बैंक्वेट, नई दिल्ली", ae_layer: "Venue", field_id: "venue" }
              ]
            },
            {
              page_id: "P4",
              page_number: 4,
              media: [{ url: `${AWS_S3_BASE_URL}/template/page/IndWedpho_a9.png`, type: "image", position: "background" }],
              fields: [
                { type: "text", label: "Invite Message", value: "आपकी उपस्थिति हमारे लिए गौरव की बात होगी", ae_layer: "InviteMessage", field_id: "invite_message" },
                { type: "text", label: "Contact", value: "+91 98765 43210", ae_layer: "Contact", field_id: "contact" }
              ]
            }
          ]
        }
      },

      // 3. Wedding Video - Single Page - With Photo - Portrait
      {
        slug: "wedding-video-single-photo-portrait",
        templateName: "शादी वीडियो - फोटो पोर्ट्रेट",
        templateType: "video",
        category: "wedding",
        subcategory: "save-the-date",
        region: "india",
        currency: "INR",
        price: "1999.00",
        durationSec: 30,
        previewImageUrl: `${AWS_S3_BASE_URL}/template/page/IndWedpho_a4.png`,
        previewVideoUrl: `${AWS_S3_BASE_URL}/template/video/IndWedVid_a.mp4`,
        defaultMusicId: musicByName["Epic Love Romantic"],
        orientation: "portrait",
        photoOption: "with_photo",
        templateTags: ["wedding", "video", "photo", "portrait", "hindi"],
        thumbnailUrl: `${AWS_S3_BASE_URL}/template/page/IndWedpho_a4.png`,
        templateJson: {
          pages: [
            {
              page_id: "P1",
              page_number: 1,
              media: [
                { url: `${AWS_S3_BASE_URL}/template/page/IndWedpho_a1.png`, type: "image", position: "background" },
                { url: `${AWS_S3_BASE_URL}/template/video/IndWedVid_a.mp4`, type: "video", position: "background" },
                { url: `${AWS_S3_BASE_URL}/music/default/epic-love-inspirational-romantic-cinematic-30-seconds-406069.mp3`, type: "audio", position: "background" }
              ],
              fields: [
                { type: "text", label: "Main Title", value: "शादी की सेव द डेट", ae_layer: "MainTitle", field_id: "main_title" },
                { type: "image", label: "Couple Photo", value: "", ae_layer: "CouplePhoto", field_id: "couple_photo" }
              ]
            },
            {
              page_id: "P2",
              page_number: 2,
              media: [
                { url: `${AWS_S3_BASE_URL}/template/page/IndWedpho_a2.png`, type: "image", position: "background" },
                { url: `${AWS_S3_BASE_URL}/template/video/IndWedVid_a.mp4`, type: "video", position: "background" }
              ],
              fields: [
                { type: "text", label: "Bride Name", value: "अंजलि वर्मा", ae_layer: "BrideName", field_id: "bride_name" },
                { type: "text", label: "Groom Name", value: "अर्जुन मेहता", ae_layer: "GroomName", field_id: "groom_name" },
                { type: "text", label: "Wedding Date", value: "25 दिसंबर, 2025", ae_layer: "WeddingDate", field_id: "wedding_date" }
              ]
            },
            {
              page_id: "P3",
              page_number: 3,
              media: [
                { url: `${AWS_S3_BASE_URL}/template/page/IndWedpho_a3.png`, type: "image", position: "background" },
                { url: `${AWS_S3_BASE_URL}/template/video/IndWedVid_a.mp4`, type: "video", position: "background" }
              ],
              fields: [
                { type: "text", label: "Venue", value: "ताज होटल, मुंबई", ae_layer: "Venue", field_id: "venue" },
                { type: "text", label: "Message", value: "आपका स्वागत है", ae_layer: "Message", field_id: "message" }
              ]
            }
          ]
        }
      },

      // 4. Wedding Video - Multiple Pages - No Photo - Landscape
      {
        slug: "wedding-video-multi-no-photo-landscape",
        templateName: "विवाह वीडियो - वाइड मल्टी पेज",
        templateType: "video",
        category: "wedding",
        subcategory: "ceremony",
        region: "india",
        currency: "INR",
        price: "2499.00",
        durationSec: 45,
        previewImageUrl: `${AWS_S3_BASE_URL}/template/page/IndWedpho_a9.png`,
        previewVideoUrl: `${AWS_S3_BASE_URL}/template/video/IndWedVid_a.mp4`,
        defaultMusicId: musicByName["Hopeful Acoustic"],
        orientation: "landscape",
        photoOption: "no_photo",
        templateTags: ["wedding", "video", "no-photo", "multi-page", "landscape", "hindi"],
        thumbnailUrl: `${AWS_S3_BASE_URL}/template/page/IndWedpho_a9.png`,
        templateJson: {
          pages: [
            {
              page_id: "P1",
              page_number: 1,
              media: [
                { url: `${AWS_S3_BASE_URL}/template/page/IndWedpho_a1.png`, type: "image", position: "background" },
                { url: `${AWS_S3_BASE_URL}/template/video/IndWedVid_a.mp4`, type: "video", position: "background" },
                { url: `${AWS_S3_BASE_URL}/music/default/hopeful-acoustic-travel-30-seconds-368800.mp3`, type: "audio", position: "background" }
              ],
              fields: [
                { type: "text", label: "Opening Title", value: "शादी का निमंत्रण", ae_layer: "OpeningTitle", field_id: "opening_title" }
              ]
            },
            {
              page_id: "P2",
              page_number: 2,
              media: [
                { url: `${AWS_S3_BASE_URL}/template/page/IndWedpho_a2.png`, type: "image", position: "background" },
                { url: `${AWS_S3_BASE_URL}/template/video/IndWedVid_a.mp4`, type: "video", position: "background" }
              ],
              fields: [
                { type: "text", label: "Mantra", value: "|| श्री गणेशाय नमः ||", ae_layer: "Mantra", field_id: "mantra" },
                { type: "text", label: "Blessing", value: "आशीर्वाद", ae_layer: "Blessing", field_id: "blessing" }
              ]
            },
            {
              page_id: "P3",
              page_number: 3,
              media: [
                { url: `${AWS_S3_BASE_URL}/template/page/IndWedpho_a3.png`, type: "image", position: "background" },
                { url: `${AWS_S3_BASE_URL}/template/video/IndWedVid_a.mp4`, type: "video", position: "background" }
              ],
              fields: [
                { type: "text", label: "Bride Name", value: "स्नेहा गुप्ता", ae_layer: "BrideName", field_id: "bride_name" },
                { type: "text", label: "Bride Family", value: "श्रीमती और श्री गुप्ता परिवार", ae_layer: "BrideFamily", field_id: "bride_family" }
              ]
            },
            {
              page_id: "P4",
              page_number: 4,
              media: [
                { url: `${AWS_S3_BASE_URL}/template/page/IndWedpho_a4.png`, type: "image", position: "background" },
                { url: `${AWS_S3_BASE_URL}/template/video/IndWedVid_a.mp4`, type: "video", position: "background" }
              ],
              fields: [
                { type: "text", label: "Groom Name", value: "कार्तिक शर्मा", ae_layer: "GroomName", field_id: "groom_name" },
                { type: "text", label: "Groom Family", value: "श्रीमती और श्री शर्मा परिवार", ae_layer: "GroomFamily", field_id: "groom_family" }
              ]
            },
            {
              page_id: "P5",
              page_number: 5,
              media: [
                { url: `${AWS_S3_BASE_URL}/template/page/IndWedpho_a9.png`, type: "image", position: "background" },
                { url: `${AWS_S3_BASE_URL}/template/video/IndWedVid_a.mp4`, type: "video", position: "background" }
              ],
              fields: [
                { type: "text", label: "Event Details", value: "विवाह समारोह", ae_layer: "EventDetails", field_id: "event_details" },
                { type: "text", label: "Date", value: "1 जनवरी, 2026", ae_layer: "Date", field_id: "date" },
                { type: "text", label: "Time", value: "शाम 7:00 बजे", ae_layer: "Time", field_id: "time" },
                { type: "text", label: "Venue", value: "लक्ज़री पैलेस, बेंगलुरु", ae_layer: "Venue", field_id: "venue" }
              ]
            },
            {
              page_id: "P6",
              page_number: 6,
              media: [
                { url: `${AWS_S3_BASE_URL}/template/page/IndWedpho_a1.png`, type: "image", position: "background" },
                { url: `${AWS_S3_BASE_URL}/template/video/IndWedVid_a.mp4`, type: "video", position: "background" }
              ],
              fields: [
                { type: "text", label: "Closing Message", value: "आपकी उपस्थिति अपेक्षित है", ae_layer: "ClosingMessage", field_id: "closing_message" },
                { type: "text", label: "RSVP", value: "+91 99999 88888", ae_layer: "RSVP", field_id: "rsvp" }
              ]
            }
          ]
        }
      },

      // === BIRTHDAY CATEGORY (4 templates) ===

      // 5. Birthday Card - Single Page - With Photo - Portrait
      {
        slug: "birthday-card-single-photo-portrait",
        templateName: "जन्मदिन कार्ड - फोटो पोर्ट्रेट",
        templateType: "card",
        category: "birthday",
        subcategory: "celebration",
        region: "india",
        currency: "INR",
        price: "799.00",
        durationSec: 15,
        previewImageUrl: `${AWS_S3_BASE_URL}/template/page/IndWedpho_a4.png`,
        previewVideoUrl: `${AWS_S3_BASE_URL}/template/IndWedpho_a4.png`,
        orientation: "portrait",
        photoOption: "with_photo",
        templateTags: ["birthday", "card", "photo", "portrait", "hindi"],
        thumbnailUrl: `${AWS_S3_BASE_URL}/template/page/IndWedpho_a4.png`,
        templateJson: {
          pages: [{
            page_id: "P1",
            page_number: 1,
            media: [{ url: `${AWS_S3_BASE_URL}/template/page/IndWedpho_a4.png`, type: "image", position: "background" }],
            fields: [
              { type: "text", label: "Main Title", value: "जन्मदिन मुबारक!", ae_layer: "MainTitle", field_id: "main_title" },
              { type: "text", label: "Name", value: "आरव", ae_layer: "Name", field_id: "name" },
              { type: "text", label: "Age", value: "5 साल", ae_layer: "Age", field_id: "age" },
              { type: "text", label: "Date", value: "10 मार्च, 2025", ae_layer: "Date", field_id: "date" },
              { type: "text", label: "Venue", value: "पार्टी हॉल, दिल्ली", ae_layer: "Venue", field_id: "venue" },
              { type: "image", label: "Birthday Photo", value: "", ae_layer: "BirthdayPhoto", field_id: "birthday_photo" }
            ]
          }]
        }
      },

      // 6. Birthday Card - Multiple Pages - No Photo - Landscape
      {
        slug: "birthday-card-multi-no-photo-landscape",
        templateName: "बर्थडे कार्ड - वाइड मल्टी पेज",
        templateType: "card",
        category: "birthday",
        subcategory: "party",
        region: "india",
        currency: "INR",
        price: "999.00",
        durationSec: 20,
        previewImageUrl: `${AWS_S3_BASE_URL}/template/page/IndWedpho_a9.png`,
        previewVideoUrl: `${AWS_S3_BASE_URL}/template/IndWedpho_a9.png`,
        orientation: "landscape",
        photoOption: "no_photo",
        templateTags: ["birthday", "card", "no-photo", "multi-page", "landscape", "hindi"],
        thumbnailUrl: `${AWS_S3_BASE_URL}/template/page/IndWedpho_a9.png`,
        templateJson: {
          pages: [
            {
              page_id: "P1",
              page_number: 1,
              media: [{ url: `${AWS_S3_BASE_URL}/template/page/IndWedpho_a9.png`, type: "image", position: "background" }],
              fields: [
                { type: "text", label: "Invitation Title", value: "जन्मदिन की पार्टी", ae_layer: "InvitationTitle", field_id: "invitation_title" },
                { type: "text", label: "Subtitle", value: "आपका स्वागत है", ae_layer: "Subtitle", field_id: "subtitle" }
              ]
            },
            {
              page_id: "P2",
              page_number: 2,
              media: [{ url: `${AWS_S3_BASE_URL}/template/page/IndWedpho_a1.png`, type: "image", position: "background" }],
              fields: [
                { type: "text", label: "Celebrant Name", value: "सारा खान", ae_layer: "CelebrantName", field_id: "celebrant_name" },
                { type: "text", label: "Age Turning", value: "18वां जन्मदिन", ae_layer: "AgeTurning", field_id: "age_turning" },
                { type: "text", label: "Message", value: "हमारे साथ जश्न मनाएं", ae_layer: "Message", field_id: "message" }
              ]
            },
            {
              page_id: "P3",
              page_number: 3,
              media: [{ url: `${AWS_S3_BASE_URL}/template/page/IndWedpho_a2.png`, type: "image", position: "background" }],
              fields: [
                { type: "text", label: "Date", value: "शनिवार, 5 अप्रैल 2025", ae_layer: "Date", field_id: "date" },
                { type: "text", label: "Time", value: "दोपहर 4:00 बजे", ae_layer: "Time", field_id: "time" },
                { type: "text", label: "Venue", value: "रेनबो पार्टी हॉल, मुंबई", ae_layer: "Venue", field_id: "venue" },
                { type: "text", label: "Contact", value: "+91 98765 12345", ae_layer: "Contact", field_id: "contact" }
              ]
            }
          ]
        }
      },

      // 7. Birthday Video - Single Page - With Photo - Portrait
      {
        slug: "birthday-video-single-photo-portrait",
        templateName: "बर्थडे वीडियो - फोटो पोर्ट्रेट",
        templateType: "video",
        category: "birthday",
        subcategory: "celebration",
        region: "india",
        currency: "INR",
        price: "1599.00",
        durationSec: 30,
        previewImageUrl: `${AWS_S3_BASE_URL}/template/page/IndWedpho_a1.png`,
        previewVideoUrl: `${AWS_S3_BASE_URL}/template/video/IndWedVid_a.mp4`,
        defaultMusicId: musicByName["Orchestral Joy"],
        orientation: "portrait",
        photoOption: "with_photo",
        templateTags: ["birthday", "video", "photo", "portrait", "hindi"],
        thumbnailUrl: `${AWS_S3_BASE_URL}/template/page/IndWedpho_a1.png`,
        templateJson: {
          pages: [
            {
              page_id: "P1",
              page_number: 1,
              media: [
                { url: `${AWS_S3_BASE_URL}/template/page/IndWedpho_a1.png`, type: "image", position: "background" },
                { url: `${AWS_S3_BASE_URL}/template/video/IndWedVid_a.mp4`, type: "video", position: "background" },
                { url: `${AWS_S3_BASE_URL}/music/default/orchestral-joy-30-sec-423312.mp3`, type: "audio", position: "background" }
              ],
              fields: [
                { type: "text", label: "Opening Title", value: "जन्मदिन मुबारक", ae_layer: "OpeningTitle", field_id: "opening_title" },
                { type: "image", label: "Birthday Photo", value: "", ae_layer: "BirthdayPhoto", field_id: "birthday_photo" }
              ]
            },
            {
              page_id: "P2",
              page_number: 2,
              media: [
                { url: `${AWS_S3_BASE_URL}/template/page/IndWedpho_a2.png`, type: "image", position: "background" },
                { url: `${AWS_S3_BASE_URL}/template/video/IndWedVid_a.mp4`, type: "video", position: "background" }
              ],
              fields: [
                { type: "text", label: "Name", value: "रोहन कपूर", ae_layer: "Name", field_id: "name" },
                { type: "text", label: "Age", value: "21 साल पूरे हो रहे हैं", ae_layer: "Age", field_id: "age" }
              ]
            },
            {
              page_id: "P3",
              page_number: 3,
              media: [
                { url: `${AWS_S3_BASE_URL}/template/page/IndWedpho_a3.png`, type: "image", position: "background" },
                { url: `${AWS_S3_BASE_URL}/template/video/IndWedVid_a.mp4`, type: "video", position: "background" }
              ],
              fields: [
                { type: "text", label: "Celebration Message", value: "पार्टी में शामिल हों", ae_layer: "CelebrationMessage", field_id: "celebration_message" },
                { type: "text", label: "Date Time", value: "15 मई, 2025 | शाम 6 बजे", ae_layer: "DateTime", field_id: "date_time" },
                { type: "text", label: "Venue", value: "स्काई लाउंज, गुड़गांव", ae_layer: "Venue", field_id: "venue" }
              ]
            },
            {
              page_id: "P4",
              page_number: 4,
              media: [
                { url: `${AWS_S3_BASE_URL}/template/page/IndWedpho_a4.png`, type: "image", position: "background" },
                { url: `${AWS_S3_BASE_URL}/template/video/IndWedVid_a.mp4`, type: "video", position: "background" }
              ],
              fields: [
                { type: "text", label: "Closing Message", value: "आपकी उपस्थिति ज़रूरी है", ae_layer: "ClosingMessage", field_id: "closing_message" },
                { type: "text", label: "RSVP", value: "+91 87654 32109", ae_layer: "RSVP", field_id: "rsvp" }
              ]
            }
          ]
        }
      },

      // 8. Birthday Video - Multiple Pages - No Photo - Landscape
      {
        slug: "birthday-video-multi-no-photo-landscape",
        templateName: "बर्थडे पार्टी - वाइड वीडियो",
        templateType: "video",
        category: "birthday",
        subcategory: "party",
        region: "india",
        currency: "INR",
        price: "2100.00",
        durationSec: 45,
        previewImageUrl: `${AWS_S3_BASE_URL}/template/page/IndWedpho_a2.png`,
        previewVideoUrl: `${AWS_S3_BASE_URL}/template/video/IndWedVid_a.mp4`,
        defaultMusicId: musicByName["Uplifting Corporate"],
        orientation: "landscape",
        photoOption: "no_photo",
        templateTags: ["birthday", "video", "no-photo", "multi-page", "landscape", "hindi", "party"],
        thumbnailUrl: `${AWS_S3_BASE_URL}/template/page/IndWedpho_a2.png`,
        templateJson: {
          pages: [
            {
              page_id: "P1",
              page_number: 1,
              media: [
                { url: `${AWS_S3_BASE_URL}/template/page/IndWedpho_a1.png`, type: "image", position: "background" },
                { url: `${AWS_S3_BASE_URL}/template/video/IndWedVid_a.mp4`, type: "video", position: "background" },
                { url: `${AWS_S3_BASE_URL}/music/default/uplifting-feelgood-30-seconds-corporate-430728.mp3`, type: "audio", position: "background" }
              ],
              fields: [
                { type: "text", label: "Party Title", value: "पार्टी टाइम", ae_layer: "PartyTitle", field_id: "party_title" }
              ]
            },
            {
              page_id: "P2",
              page_number: 2,
              media: [
                { url: `${AWS_S3_BASE_URL}/template/page/IndWedpho_a2.png`, type: "image", position: "background" },
                { url: `${AWS_S3_BASE_URL}/template/video/IndWedVid_a.mp4`, type: "video", position: "background" }
              ],
              fields: [
                { type: "text", label: "Birthday Greeting", value: "जन्मदिन", ae_layer: "BirthdayGreeting", field_id: "birthday_greeting" }
              ]
            },
            {
              page_id: "P3",
              page_number: 3,
              media: [
                { url: `${AWS_S3_BASE_URL}/template/page/IndWedpho_a3.png`, type: "image", position: "background" },
                { url: `${AWS_S3_BASE_URL}/template/video/IndWedVid_a.mp4`, type: "video", position: "background" }
              ],
              fields: [
                { type: "text", label: "Celebration Text", value: "जश्न", ae_layer: "CelebrationText", field_id: "celebration_text" },
                { type: "text", label: "Honoree Name", value: "मीरा पटेल", ae_layer: "HonoreeName", field_id: "honoree_name" }
              ]
            },
            {
              page_id: "P4",
              page_number: 4,
              media: [
                { url: `${AWS_S3_BASE_URL}/template/page/IndWedpho_a4.png`, type: "image", position: "background" },
                { url: `${AWS_S3_BASE_URL}/template/video/IndWedVid_a.mp4`, type: "video", position: "background" }
              ],
              fields: [
                { type: "text", label: "Fun Text", value: "मस्ती", ae_layer: "FunText", field_id: "fun_text" },
                { type: "text", label: "Theme", value: "बॉलीवुड थीम पार्टी", ae_layer: "Theme", field_id: "theme" }
              ]
            },
            {
              page_id: "P5",
              page_number: 5,
              media: [
                { url: `${AWS_S3_BASE_URL}/template/page/IndWedpho_a9.png`, type: "image", position: "background" },
                { url: `${AWS_S3_BASE_URL}/template/video/IndWedVid_a.mp4`, type: "video", position: "background" }
              ],
              fields: [
                { type: "text", label: "Venue Label", value: "स्थान", ae_layer: "VenueLabel", field_id: "venue_label" },
                { type: "text", label: "Venue Details", value: "सेलिब्रेशन लाउंज, चेन्नई", ae_layer: "VenueDetails", field_id: "venue_details" },
                { type: "text", label: "Date Time", value: "25 जून, 2025 | शाम 7 बजे", ae_layer: "DateTime", field_id: "date_time" }
              ]
            },
            {
              page_id: "P6",
              page_number: 6,
              media: [
                { url: `${AWS_S3_BASE_URL}/template/page/IndWedpho_a1.png`, type: "image", position: "background" },
                { url: `${AWS_S3_BASE_URL}/template/video/IndWedVid_a.mp4`, type: "video", position: "background" }
              ],
              fields: [
                { type: "text", label: "RSVP Label", value: "आरएसवीपी", ae_layer: "RSVPLabel", field_id: "rsvp_label" },
                { type: "text", label: "Contact Number", value: "+91 76543 21098", ae_layer: "ContactNumber", field_id: "contact_number" },
                { type: "text", label: "Closing Message", value: "आपका इंतज़ार रहेगा", ae_layer: "ClosingMessage", field_id: "closing_message" }
              ]
            }
          ]
        }
      }
    ];

    // Insert all templates
    const insertedTemplates = await db.insert(templates).values(templatesData).returning();
    
    console.log("✅ Templates seeded:");
    console.log(`   📄 Wedding Cards: 2 (1 portrait with photo, 1 landscape no photo)`);
    console.log(`   🎬 Wedding Videos: 2 (1 portrait with photo, 1 landscape no photo)`);
    console.log(`   📄 Birthday Cards: 2 (1 portrait with photo, 1 landscape no photo)`);
    console.log(`   🎬 Birthday Videos: 2 (1 portrait with photo, 1 landscape no photo)`);
    console.log(`   📊 Total: ${insertedTemplates.length} templates\n`);

    // Show music-template associations
    console.log("🎵 Music-Template Associations:");
    console.log("   Wedding Video (Photo) → Epic Love Romantic");
    console.log("   Wedding Video (No Photo) → Hopeful Acoustic");
    console.log("   Birthday Video (Photo) → Orchestral Joy");
    console.log("   Birthday Video (No Photo) → Uplifting Corporate");
    console.log("   Available for all: Magical Orchestral, Enchanted Music\n");

    console.log("✅ Fresh seed completed successfully! 🎉");

  } catch (error) {
    console.error("❌ Seed failed:", error);
    throw error;
  }
}







