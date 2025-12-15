import { db } from "./db";
import { music } from "@shared/schema";
import { sql, eq } from "drizzle-orm";

console.log("🚀 Starting cleanup script...");

async function cleanupDuplicateMusic() {
  console.log("🧹 Cleaning up duplicate music entries...");

  try {
    // Get all music entries
    const allMusic = await db.select().from(music);
    console.log(`Found ${allMusic.length} total music entries`);

    // Group by name to find duplicates
    const musicByName = new Map<string, typeof allMusic>();
    for (const track of allMusic) {
      if (!musicByName.has(track.name)) {
        musicByName.set(track.name, []);
      }
      musicByName.get(track.name)!.push(track);
    }

    // Find and delete duplicates (keep the oldest one)
    let deletedCount = 0;
    for (const [name, tracks] of musicByName.entries()) {
      if (tracks.length > 1) {
        console.log(`\n📋 Found ${tracks.length} duplicates of "${name}"`);
        
        // Sort by createdAt (oldest first)
        tracks.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateA - dateB;
        });

        // Keep the first (oldest), delete the rest
        const toKeep = tracks[0];
        const toDelete = tracks.slice(1);

        console.log(`  ✓ Keeping: ${toKeep.id} (created: ${toKeep.createdAt})`);
        
        for (const duplicate of toDelete) {
          console.log(`  ✗ Deleting: ${duplicate.id} (created: ${duplicate.createdAt})`);
          await db.delete(music).where(eq(music.id, duplicate.id));
          deletedCount++;
        }
      }
    }

    console.log(`\n✅ Cleanup complete! Deleted ${deletedCount} duplicate entries.`);
    console.log(`📊 Remaining unique music tracks: ${musicByName.size}`);

    // Display final list
    console.log("\n📝 Final music library:");
    const finalMusic = await db.select().from(music);
    for (const track of finalMusic) {
      console.log(`  - ${track.name} (${track.category}, ${track.duration}s)`);
    }

  } catch (error) {
    console.error("❌ Cleanup failed:", error);
    throw error;
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  cleanupDuplicateMusic()
    .then(() => {
      console.log("\n✅ Done!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ Error:", error);
      process.exit(1);
    });
}

export { cleanupDuplicateMusic };
