import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Template schema
export const templates = pgTable("templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  category: text("category").notNull(), // wedding, engagement, baby, etc.
  culture: text("culture"), // punjabi, tamil, arabic, etc.
  style: text("style").notNull(), // cinematic, modern, traditional
  duration: integer("duration").notNull(), // in seconds
  orientation: text("orientation").notNull(), // portrait, landscape, square
  isVideo: boolean("is_video").notNull().default(true),
  thumbnailUrl: text("thumbnail_url").notNull(),
  videoUrl: text("video_url"),
  price: integer("price").notNull().default(0), // in cents
  isPremium: boolean("is_premium").notNull().default(false),
  tags: text("tags").array(),
});

export const insertTemplateSchema = createInsertSchema(templates).omit({
  id: true,
});

export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type Template = typeof templates.$inferSelect;

// Contact form submission schema
export const contacts = pgTable("contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject"),
  message: text("message").notNull(),
  phone: text("phone"),
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
});

export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;

// Blog article schema
export const articles = pgTable("articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  author: text("author").notNull(),
  category: text("category").notNull(),
  thumbnailUrl: text("thumbnail_url").notNull(),
  publishedAt: text("published_at").notNull(),
});

export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
});

export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Article = typeof articles.$inferSelect;

// TypeScript-only interfaces for static content
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  heroImageUrl: string;
  templateCount: number;
}

export interface Culture {
  id: string;
  name: string;
  slug: string;
  localName?: string;
  description: string;
  heroImageUrl: string;
  traditions: string[];
  symbols: string[];
  templateCount: number;
  parentSlug?: string;
}

export interface Country {
  id: string;
  name: string;
  slug: string;
  description: string;
  heroImageUrl: string;
  popularStyles: string[];
  templateCount: number;
}

export interface Testimonial {
  id: string;
  name: string;
  event: string;
  date: string;
  rating: number;
  quote: string;
  avatarUrl?: string;
  videoUrl?: string;
}

export interface PricingTier {
  id: string;
  name: string;
  price: number;
  period?: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  ctaText: string;
  ctaUrl: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}
