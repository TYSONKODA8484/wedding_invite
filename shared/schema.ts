import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  decimal,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (REQUIRED - DO NOT MODIFY)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Users table for custom authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  email: varchar("email").unique().notNull(),
  phone: varchar("phone"),
  passwordHash: varchar("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Templates table - stores template metadata and full JSON structure
export const templates = pgTable("templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  type: varchar("type").notNull(), // 'card' or 'video'
  orientation: varchar("orientation").notNull(), // 'portrait' or 'landscape'
  photoOption: varchar("photo_option").notNull(), // 'with_photo' or 'without_photo'
  tags: jsonb("tags").notNull().default([]), // array of strings
  coverImage: varchar("cover_image").notNull(), // S3 key or URL
  currency: varchar("currency").notNull().default("INR"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(), // e.g., 199.00
  templateJson: jsonb("template_json").notNull(), // Full template structure (pages[], fields[], media[])
  createdBy: varchar("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertTemplateSchema = createInsertSchema(templates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type Template = typeof templates.$inferSelect;

// User Customizations - saved template edits
export const customizations = pgTable("customizations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  templateId: varchar("template_id").notNull().references(() => templates.id, { onDelete: "cascade" }),
  templateJson: jsonb("template_json").notNull(), // Full edited template JSON
  currency: varchar("currency").notNull().default("INR"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status").notNull().default("draft"), // draft, preview_requested, paid
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertCustomizationSchema = createInsertSchema(customizations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCustomization = z.infer<typeof insertCustomizationSchema>;
export type Customization = typeof customizations.$inferSelect;

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  templates: many(templates),
  customizations: many(customizations),
}));

export const templatesRelations = relations(templates, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [templates.createdBy],
    references: [users.id],
  }),
  customizations: many(customizations),
}));

export const customizationsRelations = relations(customizations, ({ one }) => ({
  user: one(users, {
    fields: [customizations.userId],
    references: [users.id],
  }),
  template: one(templates, {
    fields: [customizations.templateId],
    references: [templates.id],
  }),
}));

// Contact form schema (for marketing site contact page)
export const contacts = pgTable("contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject"),
  message: text("message").notNull(),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
});

export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;
