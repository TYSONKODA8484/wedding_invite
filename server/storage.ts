import { db } from "./db";
import { eq } from "drizzle-orm";
import {
  users,
  templates,
  customizations,
  type User,
  type InsertUser,
  type Template,
  type InsertTemplate,
  type Customization,
  type InsertCustomization,
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Template operations
  getTemplates(filters?: {
    type?: string;
    tags?: string[];
  }): Promise<Template[]>;
  getTemplateById(id: string): Promise<Template | undefined>;
  getTemplateBySlug(slug: string): Promise<Template | undefined>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  
  // Customization operations
  getUserCustomizations(userId: string): Promise<Customization[]>;
  getCustomizationById(id: string): Promise<Customization | undefined>;
  createCustomization(customization: InsertCustomization): Promise<Customization>;
  updateCustomization(id: string, updates: Partial<Customization>): Promise<Customization | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  // Template operations
  async getTemplates(filters?: {
    type?: string;
    tags?: string[];
  }): Promise<Template[]> {
    // For now, return all templates
    // TODO: Implement filtering by type and tags
    const allTemplates = await db.select().from(templates);
    return allTemplates;
  }

  async getTemplateById(id: string): Promise<Template | undefined> {
    const [template] = await db.select().from(templates).where(eq(templates.id, id));
    return template || undefined;
  }

  async getTemplateBySlug(slug: string): Promise<Template | undefined> {
    const [template] = await db.select().from(templates).where(eq(templates.slug, slug));
    return template || undefined;
  }

  async createTemplate(templateData: InsertTemplate): Promise<Template> {
    const [template] = await db
      .insert(templates)
      .values(templateData)
      .returning();
    return template;
  }

  // Customization operations
  async getUserCustomizations(userId: string): Promise<Customization[]> {
    return db
      .select()
      .from(customizations)
      .where(eq(customizations.userId, userId));
  }

  async getCustomizationById(id: string): Promise<Customization | undefined> {
    const [customization] = await db
      .select()
      .from(customizations)
      .where(eq(customizations.id, id));
    return customization || undefined;
  }

  async createCustomization(customizationData: InsertCustomization): Promise<Customization> {
    const [customization] = await db
      .insert(customizations)
      .values(customizationData)
      .returning();
    return customization;
  }

  async updateCustomization(id: string, updates: Partial<Customization>): Promise<Customization | undefined> {
    const [updated] = await db
      .update(customizations)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(customizations.id, id))
      .returning();
    return updated || undefined;
  }
}

export const storage = new DatabaseStorage();
