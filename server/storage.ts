import { db } from "./db";
import { eq, and, desc, like, sql } from "drizzle-orm";
import {
  users,
  templates,
  templatePages,
  customizations,
  customizationPages,
  orders,
  payments,
  downloads,
  analyticsEvents,
  type User,
  type UpsertUser,
  type Template,
  type InsertTemplate,
  type TemplatePage,
  type InsertTemplatePage,
  type Customization,
  type InsertCustomization,
  type CustomizationPage,
  type InsertCustomizationPage,
  type Order,
  type InsertOrder,
  type Payment,
  type InsertPayment,
  type Download,
  type InsertDownload,
  type InsertAnalyticsEvent,
} from "@shared/schema";

export interface IStorage {
  // User operations (REQUIRED for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Template operations
  getTemplates(filters?: {
    category?: string;
    culture?: string;
    country?: string;
    style?: string;
    isActive?: boolean;
  }): Promise<Template[]>;
  getTemplateById(id: string): Promise<Template | undefined>;
  getTemplateBySlug(slug: string): Promise<Template | undefined>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  
  // Template pages operations
  getTemplatePages(templateId: string): Promise<TemplatePage[]>;
  createTemplatePage(page: InsertTemplatePage): Promise<TemplatePage>;
  
  // Customization operations
  getUserCustomizations(userId: string): Promise<Customization[]>;
  getCustomizationById(id: string): Promise<Customization | undefined>;
  createCustomization(customization: InsertCustomization): Promise<Customization>;
  updateCustomization(id: string, updates: Partial<Customization>): Promise<Customization | undefined>;
  
  // Customization pages operations
  getCustomizationPages(customizationId: string): Promise<CustomizationPage[]>;
  createCustomizationPage(page: InsertCustomizationPage): Promise<CustomizationPage>;
  updateCustomizationPage(id: string, fieldValues: any): Promise<CustomizationPage | undefined>;
  
  // Order operations
  createOrder(order: InsertOrder): Promise<Order>;
  getOrderById(id: string): Promise<Order | undefined>;
  getOrderByRazorpayId(razorpayOrderId: string): Promise<Order | undefined>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;
  getUserOrders(userId: string): Promise<Order[]>;
  
  // Payment operations
  createPayment(payment: InsertPayment): Promise<Payment>;
  getPaymentByRazorpayId(razorpayPaymentId: string): Promise<Payment | undefined>;
  
  // Download operations
  createDownload(download: InsertDownload): Promise<Download>;
  getOrderDownloads(orderId: string): Promise<Download[]>;
  
  // Analytics operations
  trackEvent(event: InsertAnalyticsEvent): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations (REQUIRED for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Template operations
  async getTemplates(filters?: {
    category?: string;
    culture?: string;
    country?: string;
    style?: string;
    isActive?: boolean;
  }): Promise<Template[]> {
    const conditions = [];
    
    if (filters?.category) {
      conditions.push(eq(templates.category, filters.category));
    }
    if (filters?.culture) {
      // Support partial culture matching (e.g., "indian" matches "indian-punjabi", "indian-tamil", etc.)
      conditions.push(like(templates.culture, `${filters.culture}%`));
    }
    if (filters?.country) {
      conditions.push(eq(templates.country, filters.country));
    }
    if (filters?.style) {
      conditions.push(eq(templates.style, filters.style));
    }
    if (filters?.isActive !== undefined) {
      conditions.push(eq(templates.isActive, filters.isActive));
    }
    
    if (conditions.length > 0) {
      return await db.select().from(templates).where(and(...conditions));
    }
    
    // When no filters, sort by country with India first
    return await db.select().from(templates).orderBy(
      sql`CASE 
        WHEN ${templates.country} = 'india' THEN 1
        WHEN ${templates.country} = 'uae' THEN 2
        WHEN ${templates.country} = 'saudi-arabia' THEN 3
        ELSE 4
      END`
    );
  }

  async getTemplateById(id: string): Promise<Template | undefined> {
    const [template] = await db.select().from(templates).where(eq(templates.id, id));
    return template || undefined;
  }

  async getTemplateBySlug(slug: string): Promise<Template | undefined> {
    const [template] = await db.select().from(templates).where(eq(templates.slug, slug));
    return template || undefined;
  }

  async createTemplate(insertTemplate: InsertTemplate): Promise<Template> {
    const [template] = await db
      .insert(templates)
      .values(insertTemplate)
      .returning();
    return template;
  }

  // Template pages operations
  async getTemplatePages(templateId: string): Promise<TemplatePage[]> {
    return await db
      .select()
      .from(templatePages)
      .where(eq(templatePages.templateId, templateId))
      .orderBy(templatePages.pageNumber);
  }

  async createTemplatePage(page: InsertTemplatePage): Promise<TemplatePage> {
    const [templatePage] = await db
      .insert(templatePages)
      .values(page)
      .returning();
    return templatePage;
  }

  // Customization operations
  async getUserCustomizations(userId: string): Promise<Customization[]> {
    return await db
      .select()
      .from(customizations)
      .where(eq(customizations.userId, userId))
      .orderBy(desc(customizations.createdAt));
  }

  async getCustomizationById(id: string): Promise<Customization | undefined> {
    const [customization] = await db
      .select()
      .from(customizations)
      .where(eq(customizations.id, id));
    return customization || undefined;
  }

  async createCustomization(insertCustomization: InsertCustomization): Promise<Customization> {
    const [customization] = await db
      .insert(customizations)
      .values(insertCustomization)
      .returning();
    return customization;
  }

  async updateCustomization(
    id: string,
    updates: Partial<Customization>
  ): Promise<Customization | undefined> {
    const [updated] = await db
      .update(customizations)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(customizations.id, id))
      .returning();
    return updated || undefined;
  }

  // Customization pages operations
  async getCustomizationPages(customizationId: string): Promise<CustomizationPage[]> {
    return await db
      .select()
      .from(customizationPages)
      .where(eq(customizationPages.customizationId, customizationId))
      .orderBy(customizationPages.pageNumber);
  }

  async createCustomizationPage(page: InsertCustomizationPage): Promise<CustomizationPage> {
    const [customizationPage] = await db
      .insert(customizationPages)
      .values(page)
      .returning();
    return customizationPage;
  }

  async updateCustomizationPage(
    id: string,
    fieldValues: any
  ): Promise<CustomizationPage | undefined> {
    const [updated] = await db
      .update(customizationPages)
      .set({ fieldValues, updatedAt: new Date() })
      .where(eq(customizationPages.id, id))
      .returning();
    return updated || undefined;
  }

  // Order operations
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db
      .insert(orders)
      .values(insertOrder)
      .returning();
    return order;
  }

  async getOrderById(id: string): Promise<Order | undefined> {
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, id));
    return order || undefined;
  }

  async getOrderByRazorpayId(razorpayOrderId: string): Promise<Order | undefined> {
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.razorpayOrderId, razorpayOrderId));
    return order || undefined;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const [updated] = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return updated || undefined;
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));
  }

  // Payment operations
  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const [payment] = await db
      .insert(payments)
      .values(insertPayment)
      .returning();
    return payment;
  }

  async getPaymentByRazorpayId(razorpayPaymentId: string): Promise<Payment | undefined> {
    const [payment] = await db
      .select()
      .from(payments)
      .where(eq(payments.razorpayPaymentId, razorpayPaymentId));
    return payment || undefined;
  }

  // Download operations
  async createDownload(insertDownload: InsertDownload): Promise<Download> {
    const [download] = await db
      .insert(downloads)
      .values(insertDownload)
      .returning();
    return download;
  }

  async getOrderDownloads(orderId: string): Promise<Download[]> {
    return await db
      .select()
      .from(downloads)
      .where(eq(downloads.orderId, orderId))
      .orderBy(desc(downloads.downloadedAt));
  }

  // Analytics operations
  async trackEvent(event: InsertAnalyticsEvent): Promise<void> {
    await db.insert(analyticsEvents).values(event);
  }

  // Contact form (for marketing pages - temporary)
  async createContact(contact: any): Promise<any> {
    const [result] = await db.insert(contacts).values(contact).returning();
    return result;
  }
}

export const storage = new DatabaseStorage();
