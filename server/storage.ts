import { db } from "./db";
import { eq } from "drizzle-orm";
import {
  users,
  templates,
  projects,
  orders,
  payments,
  type User,
  type InsertUser,
  type Template,
  type InsertTemplate,
  type Project,
  type InsertProject,
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByPhone(phone: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
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
      
      return {
        id: row.project.id,
        templateId: row.project.templateId,
        templateName: row.template?.templateName || 'Unknown Template',
        thumbnailUrl: row.template?.thumbnailUrl || row.template?.previewImageUrl,
        previewImageUrl: row.template?.previewImageUrl,
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
}

export const storage = new DatabaseStorage();
