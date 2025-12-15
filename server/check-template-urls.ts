import { db } from "./db";
import { templates } from "@shared/schema";

async function checkUrls() {
  const allTemplates = await db.select().from(templates).limit(1);
  const template = allTemplates[0];
  
  console.log("\n📋 Template:", template.templateName);
  console.log("\n🔗 Top-level URLs:");
  console.log("  previewImageUrl:", template.previewImageUrl);
  console.log("  previewVideoUrl:", template.previewVideoUrl);
  console.log("  thumbnailUrl:", template.thumbnailUrl);
  
  console.log("\n📄 Page Media URLs:");
  template.templateJson.pages.forEach((page: any, i: number) => {
    console.log(`  Page ${i + 1}:`, page.media?.[0]?.url);
  });
  
  process.exit(0);
}

checkUrls();
