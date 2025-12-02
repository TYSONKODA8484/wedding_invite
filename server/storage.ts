import { db } from "./db";
import { eq, sql } from "drizzle-orm";
import {
  users,
  templates,
  projects,
  orders,
  payments,
  userTemplates,
  music,
  type User,
  type InsertUser,
  type Template,
  type InsertTemplate,
  type Project,
  type InsertProject,
  type Order,
  type InsertOrder,
  type Payment,
  type InsertPayment,
  type UserTemplate,
  type InsertUserTemplate,
  type Music,
  type InsertMusic,
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByPhone(phone: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  
  // Template operations
  getTemplates(filters?: {
    type?: string;
    tags?: string[];
  }): Promise<Template[]>;
  getTemplateById(id: string): Promise<Template | undefined>;
  getTemplateBySlug(slug: string): Promise<Template | undefined>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  
  // Project operations (user's customized templates)
  getUserProjects(userId: string): Promise<Project[]>;
  getProjectById(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, updates: Partial<Project>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;
  
  // Order operations
  createOrder(order: InsertOrder): Promise<Order>;
  getOrderById(id: string): Promise<Order | undefined>;
  updateOrder(id: string, updates: Partial<Order>): Promise<Order | undefined>;
  
  // Payment operations
  createPayment(payment: InsertPayment): Promise<Payment>;
  
  // User Template operations (purchase records)
  createUserTemplate(userTemplate: InsertUserTemplate): Promise<UserTemplate>;
  
  // Popularity tracking operations
  incrementTemplateGeneration(templateId: string): Promise<Template | undefined>;
  incrementTemplatePurchase(templateId: string): Promise<Template | undefined>;
  
  // Music operations
  getMusicLibrary(category?: string): Promise<Music[]>;
  getMusicById(id: string): Promise<Music | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserById(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    if (!phone) {
      return undefined;
    }
    const [user] = await db.select().from(users).where(eq(users.phone, phone));
    return user || undefined;
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    if (!googleId) {
      return undefined;
    }
    const [user] = await db.select().from(users).where(eq(users.googleId, googleId));
    return user || undefined;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  // Template operations
  async getTemplates(filters?: {
    type?: string;
    tags?: string[];
  }): Promise<Template[]> {
    const allTemplates = await db.select().from(templates).orderBy(templates.slug);
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

  // Project operations (renamed from Customization)
  async getUserProjects(userId: string): Promise<any[]> {
    const userProjects = await db
      .select({
        project: projects,
        template: templates,
        order: orders,
        payment: payments,
      })
      .from(projects)
      .leftJoin(templates, eq(projects.templateId, templates.id))
      .leftJoin(orders, eq(projects.id, orders.projectId))
      .leftJoin(payments, eq(orders.id, payments.orderId))
      .where(eq(projects.userId, userId));
    
    // Deduplicate projects by ID (in case of multiple orders/payments)
    const projectMap = new Map<string, typeof userProjects[0]>();
    for (const row of userProjects) {
      const existing = projectMap.get(row.project.id);
      // Prefer rows with successful payments or paid orders
      const currentIsPaid = (row.order?.status === 'paid') || 
                            (row.payment?.status === 'success') || 
                            !!row.project.paidAt;
      const existingIsPaid = existing && (
        (existing.order?.status === 'paid') || 
        (existing.payment?.status === 'success') || 
        !!existing.project.paidAt
      );
      
      if (!existing || (currentIsPaid && !existingIsPaid)) {
        projectMap.set(row.project.id, row);
      }
    }
    
    return Array.from(projectMap.values()).map(row => {
      const isPaid = 
        (row.order && row.order.status === 'paid') ||
        (row.payment && row.payment.status === 'success') ||
        !!row.project.paidAt;
      
      // Determine template type (card or video)
      const rawType = row.template?.templateType || 'video';
      const templateType = rawType === 'card' ? 'card' : 'video';
      
      // Construct object storage URLs for card/video preview/final files
      // Pattern: /objects/projects/{projectId}/{card|video}_{preview|final}.{ext}
      const projectId = row.project.id;
      const cardExt = 'jpg';
      const videoExt = 'mp4';
      
      // Object storage URLs for the four file types
      const cardPreviewUrl = `/objects/projects/${projectId}/card_preview.${cardExt}`;
      const cardFinalUrl = `/objects/projects/${projectId}/card_final.${cardExt}`;
      const videoPreviewUrl = `/objects/projects/${projectId}/video_preview.${videoExt}`;
      const videoFinalUrl = `/objects/projects/${projectId}/video_final.${videoExt}`;
      
      // Use project-specific URLs if available, fall back to template video
      const videoUrl = row.project.previewUrl || row.project.finalUrl || row.template?.previewVideoUrl;
      
      return {
        id: row.project.id,
        templateId: row.project.templateId,
        templateName: row.template?.templateName || 'Unknown Template',
        templateType,
        thumbnailUrl: row.template?.thumbnailUrl || row.template?.previewImageUrl,
        previewImageUrl: row.template?.previewImageUrl,
        previewVideoUrl: videoUrl,
        orientation: row.template?.orientation || 'portrait',
        price: row.template?.price || '0',
        currency: row.template?.currency || 'INR',
        status: row.project.status,
        isPaid,
        paymentStatus: row.payment?.status || row.order?.status || 'pending',
        previewUrl: row.project.previewUrl,
        finalUrl: row.project.finalUrl,
        cardPreviewUrl,
        cardFinalUrl,
        videoPreviewUrl: videoPreviewUrl,
        videoFinalUrl,
        createdAt: row.project.createdAt,
        updatedAt: row.project.updatedAt,
        paidAt: row.project.paidAt,
      };
    });
  }

  async getProjectById(id: string): Promise<Project | undefined> {
    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id));
    return project || undefined;
  }

  async createProject(projectData: InsertProject): Promise<Project> {
    const [project] = await db
      .insert(projects)
      .values(projectData)
      .returning();
    return project;
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project | undefined> {
    const [updated] = await db
      .update(projects)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteProject(id: string): Promise<boolean> {
    const result = await db
      .delete(projects)
      .where(eq(projects.id, id))
      .returning();
    return result.length > 0;
  }

  // Order operations
  async createOrder(orderData: InsertOrder): Promise<Order> {
    const [order] = await db
      .insert(orders)
      .values(orderData)
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

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order | undefined> {
    const [updated] = await db
      .update(orders)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, id))
      .returning();
    return updated || undefined;
  }

  // Payment operations
  async createPayment(paymentData: InsertPayment): Promise<Payment> {
    const [payment] = await db
      .insert(payments)
      .values(paymentData)
      .returning();
    return payment;
  }

  // User Template operations (purchase records)
  async createUserTemplate(userTemplateData: InsertUserTemplate): Promise<UserTemplate> {
    const [userTemplate] = await db
      .insert(userTemplates)
      .values(userTemplateData)
      .returning();
    return userTemplate;
  }

  // Popularity tracking operations
  // Formula: popularityScore = floor(totalGenerations / 10) + totalPurchases
  // Single atomic UPDATE to avoid race conditions
  
  async incrementTemplateGeneration(templateId: string): Promise<Template | undefined> {
    if (!templateId) return undefined;
    
    // Atomic UPDATE: increment generation and recalculate score in one statement
    // In PostgreSQL, all SET expressions are evaluated using OLD row values,
    // so (total_generations + 1) gives us the new value for score calculation
    const [updated] = await db
      .update(templates)
      .set({
        totalGenerations: sql`${templates.totalGenerations} + 1`,
        popularityScore: sql`FLOOR((${templates.totalGenerations} + 1)::numeric / 10) + ${templates.totalPurchases}`,
        updatedAt: new Date(),
      })
      .where(eq(templates.id, templateId))
      .returning();
    
    return updated || undefined;
  }

  async incrementTemplatePurchase(templateId: string): Promise<Template | undefined> {
    if (!templateId) return undefined;
    
    // Atomic UPDATE: increment purchase and recalculate score in one statement
    // In PostgreSQL, all SET expressions are evaluated using OLD row values,
    // so (total_purchases + 1) gives us the new value for score calculation
    const [updated] = await db
      .update(templates)
      .set({
        totalPurchases: sql`${templates.totalPurchases} + 1`,
        popularityScore: sql`FLOOR(${templates.totalGenerations}::numeric / 10) + ${templates.totalPurchases} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(templates.id, templateId))
      .returning();
    
    return updated || undefined;
  }

  // Music operations
  async getMusicLibrary(category?: string): Promise<Music[]> {
    if (category) {
      return await db
        .select()
        .from(music)
        .where(eq(music.category, category));
    }
    return await db.select().from(music);
  }

  async getMusicById(id: string): Promise<Music | undefined> {
    const [track] = await db
      .select()
      .from(music)
      .where(eq(music.id, id));
    return track || undefined;
  }
}

export const storage = new DatabaseStorage();
