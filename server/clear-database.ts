import { db } from "./db";
import { music, templates, projects, userTemplates, orders, payments, users } from "@shared/schema";
import { sql } from "drizzle-orm";

async function clearDatabase() {
  console.log("🗑️  Clearing all database tables...");

  try {
    // Delete in order to respect foreign key constraints
    console.log("  Deleting payments...");
    await db.delete(payments);
    
    console.log("  Deleting orders...");
    await db.delete(orders);
    
    console.log("  Deleting user_templates...");
    await db.delete(userTemplates);
    
    console.log("  Deleting projects...");
    await db.delete(projects);
    
    console.log("  Deleting templates...");
    await db.delete(templates);
    
    console.log("  Deleting music...");
    await db.delete(music);
    
    console.log("  Deleting users...");
    await db.delete(users);

    console.log("\n✅ All tables cleared successfully!");

  } catch (error) {
    console.error("❌ Clear failed:", error);
    throw error;
  }
}

// Auto-run
clearDatabase()
  .then(() => {
    console.log("\n✅ Database is now empty and ready for fresh seed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Error:", error);
    process.exit(1);
  });
