import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
  decimal,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth (REQUIRED - DO NOT MODIFY)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Users table for Replit Auth (REQUIRED FIELDS - DO NOT MODIFY)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  // Additional fields for wedding invite platform
  phone: varchar("phone"),
  whatsappNumber: varchar("whatsapp_number"),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Templates table - video invitation templates
export const templates = pgTable("templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  category: text("category").notNull(), // wedding, engagement, birthday, etc.
  culture: text("culture").notNull(), // indian-punjabi, indian-tamil, arabic, etc.
  country: text("country").notNull(), // india, uae, saudi-arabia
  style: text("style").notNull(), // cinematic, modern, traditional
  duration: integer("duration").notNull(), // video duration in seconds (20-60s)
  thumbnailUrl: text("thumbnail_url").notNull(),
  demoVideoUrl: text("demo_video_url").notNull(), // Full-quality demo video
  priceInr: integer("price_inr").notNull(), // Price in paise (₹1200 = 120000)
  isPremium: boolean("is_premium").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  pageCount: integer("page_count").notNull().default(6), // Number of pages (6-7)
  tags: text("tags").array(),
  orientation: text("orientation").notNull().default("portrait"), // portrait (9:16)
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

// Template Pages - individual pages within each template
export const templatePages = pgTable("template_pages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  templateId: varchar("template_id").notNull().references(() => templates.id, { onDelete: "cascade" }),
  pageNumber: integer("page_number").notNull(), // 1-7
  pageName: text("page_name").notNull(), // "Bride & Groom", "Wedding Details", "RSVP", etc.
  thumbnailUrl: text("thumbnail_url").notNull(),
  // JSON field containing editable field definitions for this page
  // Structure: [{ id: "field1", type: "text", label: "Bride Name", defaultValue: "", maxLength: 50 }, ...]
  editableFields: jsonb("editable_fields").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  // Unique constraint: one page number per template
  uniqueTemplateIdPageNumber: uniqueIndex("template_pages_template_id_page_number_unique").on(table.templateId, table.pageNumber),
}));

export const insertTemplatePageSchema = createInsertSchema(templatePages).omit({
  id: true,
  createdAt: true,
});

export type InsertTemplatePage = z.infer<typeof insertTemplatePageSchema>;
export type TemplatePage = typeof templatePages.$inferSelect;

// Customizations - user's saved template edits
export const customizations = pgTable("customizations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  templateId: varchar("template_id").notNull().references(() => templates.id, { onDelete: "cascade" }),
  customizationName: text("customization_name"), // Optional: "Our Wedding", "Meera's Birthday"
  status: text("status").notNull().default("draft"), // draft, preview_requested, preview_ready, paid
  previewVideoUrl: text("preview_video_url"), // Watermarked low-res preview (480p)
  finalVideoUrl: text("final_video_url"), // Full-quality video (post-payment)
  previewRequestedAt: timestamp("preview_requested_at"),
  previewCompletedAt: timestamp("preview_completed_at"),
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

// Customization Pages - field values for each page
export const customizationPages = pgTable("customization_pages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customizationId: varchar("customization_id").notNull().references(() => customizations.id, { onDelete: "cascade" }),
  templatePageId: varchar("template_page_id").notNull().references(() => templatePages.id, { onDelete: "cascade" }),
  pageNumber: integer("page_number").notNull(),
  // JSON field containing user-entered field values
  // Structure: { field1: "John Doe", field2: "/objects/uploads/abc123.jpg", ... }
  fieldValues: jsonb("field_values").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertCustomizationPageSchema = createInsertSchema(customizationPages).omit({
  id: true,
  updatedAt: true,
});

export type InsertCustomizationPage = z.infer<typeof insertCustomizationPageSchema>;
export type CustomizationPage = typeof customizationPages.$inferSelect;

// Orders - created before payment
export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  customizationId: varchar("customization_id").notNull().references(() => customizations.id, { onDelete: "cascade" }),
  templateId: varchar("template_id").notNull().references(() => templates.id),
  amountInr: integer("amount_inr").notNull(), // Total in paise
  currency: text("currency").notNull().default("INR"),
  status: text("status").notNull().default("pending"), // pending, paid, failed, refunded
  razorpayOrderId: text("razorpay_order_id").unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

// Payments - Razorpay payment records
export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  razorpayPaymentId: text("razorpay_payment_id").unique(),
  razorpayOrderId: text("razorpay_order_id"),
  razorpaySignature: text("razorpay_signature"),
  amountInr: integer("amount_inr").notNull(),
  status: text("status").notNull(), // authorized, captured, failed, refunded
  method: text("method"), // card, netbanking, wallet, upi
  email: text("email"),
  contact: text("contact"),
  errorCode: text("error_code"),
  errorDescription: text("error_description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
});

export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;

// Downloads - track download attempts (max 5 per order)
export const downloads = pgTable("downloads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  customizationId: varchar("customization_id").notNull().references(() => customizations.id, { onDelete: "cascade" }),
  signedUrl: text("signed_url"), // Time-limited signed URL (48h expiry)
  urlExpiresAt: timestamp("url_expires_at"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  downloadedAt: timestamp("downloaded_at").defaultNow(),
});

export const insertDownloadSchema = createInsertSchema(downloads).omit({
  id: true,
  downloadedAt: true,
});

export type InsertDownload = z.infer<typeof insertDownloadSchema>;
export type Download = typeof downloads.$inferSelect;

// Analytics Events - funnel tracking
export const analyticsEvents = pgTable("analytics_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: "set null" }),
  sessionId: varchar("session_id"), // Anonymous session tracking
  eventType: text("event_type").notNull(), // template_viewed, edit_started, preview_requested, payment_initiated, payment_completed, download
  templateId: varchar("template_id").references(() => templates.id, { onDelete: "set null" }),
  customizationId: varchar("customization_id").references(() => customizations.id, { onDelete: "set null" }),
  orderId: varchar("order_id").references(() => orders.id, { onDelete: "set null" }),
  metadata: jsonb("metadata"), // Additional event data (device, browser, utm_source, etc.)
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAnalyticsEventSchema = createInsertSchema(analyticsEvents).omit({
  id: true,
  createdAt: true,
});

export type InsertAnalyticsEvent = z.infer<typeof insertAnalyticsEventSchema>;
export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;

// Relations for better query experience
export const usersRelations = relations(users, ({ many }) => ({
  customizations: many(customizations),
  orders: many(orders),
  payments: many(payments),
  downloads: many(downloads),
}));

export const templatesRelations = relations(templates, ({ many }) => ({
  pages: many(templatePages),
  customizations: many(customizations),
}));

export const templatePagesRelations = relations(templatePages, ({ one }) => ({
  template: one(templates, {
    fields: [templatePages.templateId],
    references: [templates.id],
  }),
}));

export const customizationsRelations = relations(customizations, ({ one, many }) => ({
  user: one(users, {
    fields: [customizations.userId],
    references: [users.id],
  }),
  template: one(templates, {
    fields: [customizations.templateId],
    references: [templates.id],
  }),
  pages: many(customizationPages),
  orders: many(orders),
}));

export const customizationPagesRelations = relations(customizationPages, ({ one }) => ({
  customization: one(customizations, {
    fields: [customizationPages.customizationId],
    references: [customizations.id],
  }),
  templatePage: one(templatePages, {
    fields: [customizationPages.templatePageId],
    references: [templatePages.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  customization: one(customizations, {
    fields: [orders.customizationId],
    references: [customizations.id],
  }),
  template: one(templates, {
    fields: [orders.templateId],
    references: [templates.id],
  }),
  payments: many(payments),
  downloads: many(downloads),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  order: one(orders, {
    fields: [payments.orderId],
    references: [orders.id],
  }),
  user: one(users, {
    fields: [payments.userId],
    references: [users.id],
  }),
}));

export const downloadsRelations = relations(downloads, ({ one }) => ({
  order: one(orders, {
    fields: [downloads.orderId],
    references: [orders.id],
  }),
  user: one(users, {
    fields: [downloads.userId],
    references: [users.id],
  }),
  customization: one(customizations, {
    fields: [downloads.customizationId],
    references: [customizations.id],
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
