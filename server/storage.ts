import { db } from "./db";
import { eq } from "drizzle-orm";
import {
  users,
  templates,
  projects,
  orders,
  payments,
  userTemplates,
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
  
  // Order operations
  createOrder(order: InsertOrder): Promise<Order>;
  getOrderById(id: string): Promise<Order | undefined>;
  updateOrder(id: string, updates: Partial<Order>): Promise<Order | undefined>;
  
  // Payment operations
  createPayment(payment: InsertPayment): Promise<Payment>;
  
  // User Template operations (purchase records)
  createUserTemplate(userTemplate: InsertUserTemplate): Promise<UserTemplate>;
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
    
    return userProjects.map(row => {
      const isPaid = 
        (row.order && row.order.status === 'paid') ||
        (row.payment && row.payment.status === 'success') ||
        !!row.project.paidAt;
      
      // Use project-specific URLs if available, fall back to template video
      const videoUrl = row.project.previewUrl || row.project.finalUrl || row.template?.previewVideoUrl;
      
      return {
        id: row.project.id,
        templateId: row.project.templateId,
        templateName: row.template?.templateName || 'Unknown Template',
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
}

export const storage = new DatabaseStorage();
