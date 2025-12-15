import { db } from "./db";
import { templates, music } from "@shared/schema";

async function verify() {
  console.log("\n🔍 Verifying database contents...\n");

  const allTemplates = await db.select().from(templates);
  const allMusic = await db.select().from(music);

  console.log("📋 TEMPLATES (" + allTemplates.length + "):");
  allTemplates.forEach(t => {
    console.log(`  - ${t.templateName}`);
    console.log(`    Type: ${t.templateType} | Category: ${t.category} | Orientation: ${t.orientation} | Photo: ${t.photoOption}`);
  });

  console.log("\n🎵 MUSIC (" + allMusic.length + "):");
  allMusic.forEach(m => {
    console.log(`  - ${m.name} (${m.category})`);
  });

  process.exit(0);
}

verify();
