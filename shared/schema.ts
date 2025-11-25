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
  integer,
  uuid,
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

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique().notNull(),
  phone: varchar("phone"),
  name: varchar("name").notNull(),
  passwordHash: varchar("password_hash"),
  googleId: varchar("google_id").unique(),
  authProvider: varchar("auth_provider").notNull().default("password"),
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

// Templates table
export const templates = pgTable("templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: varchar("slug").notNull().unique(),
  templateName: varchar("template_name").notNull(),
  templateType: varchar("template_type").notNull(),
  category: varchar("category").notNull().default("wedding"),
  subcategory: varchar("subcategory").notNull().default("general"),
  currency: varchar("currency").notNull().default("INR"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  durationSec: integer("duration_sec").notNull().default(30),
  previewImageUrl: varchar("preview_image_url").notNull(),
  previewVideoUrl: varchar("preview_video_url").notNull(),
  templateJson: jsonb("template_json").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  orientation: varchar("orientation").notNull(),
  photoOption: varchar("photo_option").notNull(),
  templateTags: jsonb("template_tags").notNull().default([]),
  thumbnailUrl: varchar("thumbnail_url").notNull(),
  popularityScore: integer("popularity_score").notNull().default(0),
  totalGenerations: integer("total_generations").notNull().default(0),
  totalPurchases: integer("total_purchases").notNull().default(0),
});

export const insertTemplateSchema = createInsertSchema(templates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type Template = typeof templates.$inferSelect;

// Projects table - user's customized templates
export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  templateId: varchar("template_id").notNull().references(() => templates.id, { onDelete: "cascade" }),
  customization: jsonb("customization").notNull(),
  status: varchar("status").notNull().default("draft"), // draft, preview_requested, rendering, completed
  previewUrl: varchar("preview_url"),
  finalUrl: varchar("final_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  paidAt: timestamp("paid_at"),
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

// User Templates - purchase records
export const userTemplates = pgTable("user_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  projectId: varchar("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  purchaseAmount: decimal("purchase_amount", { precision: 10, scale: 2 }).notNull(),
  razorpayOrderId: varchar("razorpay_order_id"),
  razorpayPaymentId: varchar("razorpay_payment_id"),
  purchasedAt: timestamp("purchased_at").defaultNow(),
});

export const insertUserTemplateSchema = createInsertSchema(userTemplates).omit({
  id: true,
  purchasedAt: true,
});

export type InsertUserTemplate = z.infer<typeof insertUserTemplateSchema>;
export type UserTemplate = typeof userTemplates.$inferSelect;

// Orders table
export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderNumber: varchar("order_number").notNull().unique(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  projectId: varchar("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  templateId: varchar("template_id").notNull().references(() => templates.id, { onDelete: "cascade" }),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency").notNull().default("INR"),
  status: varchar("status").notNull().default("pending"), // pending, paid, failed
  paymentProvider: varchar("payment_provider").notNull().default("razorpay"),
  providerOrderId: varchar("provider_order_id"),
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

// Payments table
export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  provider: varchar("provider").notNull().default("razorpay"),
  status: varchar("status").notNull(), // success, failed
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency").notNull().default("INR"),
  payload: jsonb("payload").notNull(),
  receivedAt: timestamp("received_at").defaultNow(),
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  receivedAt: true,
});

export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
  userTemplates: many(userTemplates),
  orders: many(orders),
}));

export const templatesRelations = relations(templates, ({ many }) => ({
  projects: many(projects),
  orders: many(orders),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
  template: one(templates, {
    fields: [projects.templateId],
    references: [templates.id],
  }),
  userTemplates: many(userTemplates),
  orders: many(orders),
}));

export const userTemplatesRelations = relations(userTemplates, ({ one }) => ({
  user: one(users, {
    fields: [userTemplates.userId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [userTemplates.projectId],
    references: [projects.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [orders.projectId],
    references: [projects.id],
  }),
  template: one(templates, {
    fields: [orders.templateId],
    references: [templates.id],
  }),
  payments: many(payments),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  order: one(orders, {
    fields: [payments.orderId],
    references: [orders.id],
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
