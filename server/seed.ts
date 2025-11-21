import { db } from "./db";
import { 
  users, 
  templates, 
  projects,
  userTemplates,
  orders,
  payments,
  type InsertUser, 
  type InsertTemplate,
  type InsertProject,
  type InsertUserTemplate,
  type InsertOrder,
  type InsertPayment
} from "@shared/schema";
import * as bcrypt from "bcryptjs";

export async function seed() {
  console.log("🌱 Seeding database...");

  try {
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
        thumbnailUrl: "/attached_assets/Traditional-Indian-Wedding-Invitation-with-Couple-Portrait-Marigold-Garlands-Red-Gold-Theme_1763619463803.jpg",
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
        thumbnailUrl: "/attached_assets/Traditional-Indian-Wedding-Invitation-with-Couple-Portrait-Marigold-Garlands-Red-Gold-Theme_1763619463803.jpg",
      })
      .onConflictDoNothing()
      .returning();

    console.log("✅ Template 2 created:", template2?.templateName);

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
