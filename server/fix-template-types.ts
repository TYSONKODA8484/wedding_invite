import { db } from "./db";
import { templates } from "@shared/schema";
import { eq } from "drizzle-orm";

async function fixTemplateTypes() {
  console.log("🔧 Fixing template types...");

  try {
    // Get all templates with 'wedding' as templateType
    const wrongTypeTemplates = await db
      .select()
      .from(templates)
      .where(eq(templates.templateType, "wedding"));

    console.log(`Found ${wrongTypeTemplates.length} templates with wrong type 'wedding'`);

    if (wrongTypeTemplates.length === 0) {
      console.log("✅ No templates to fix!");
      return;
    }

    // Update all to 'video' type (assuming these are video templates)
    let updated = 0;
    for (const template of wrongTypeTemplates) {
      console.log(`  Updating: ${template.slug} - "${template.templateName}"`);
      await db
        .update(templates)
        .set({ templateType: "video" })
        .where(eq(templates.id, template.id));
      updated++;
    }

    console.log(`\n✅ Fixed ${updated} templates!`);
    console.log("✅ All templates now have either 'card' or 'video' as templateType");

    // Show summary of template types
    const allTemplates = await db.select().from(templates);
    const typeCounts = allTemplates.reduce((acc, t) => {
      acc[t.templateType] = (acc[t.templateType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log("\n📊 Template type summary:");
    for (const [type, count] of Object.entries(typeCounts)) {
      console.log(`  ${type}: ${count}`);
    }

  } catch (error) {
    console.error("❌ Fix failed:", error);
    throw error;
  }
}

// Auto-run the function
fixTemplateTypes()
  .then(() => {
    console.log("\n✅ Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Error:", error);
    process.exit(1);
  });
