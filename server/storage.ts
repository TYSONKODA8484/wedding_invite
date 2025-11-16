import { randomUUID } from "crypto";
import type { Template, InsertTemplate, Contact, InsertContact, Article, InsertArticle } from "@shared/schema";

export interface IStorage {
  getTemplates(filters?: {
    category?: string;
    culture?: string;
    style?: string;
  }): Promise<Template[]>;
  getTemplateBySlug(slug: string): Promise<Template | undefined>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  
  createContact(contact: InsertContact): Promise<Contact>;
  
  getArticles(): Promise<Article[]>;
  getArticleBySlug(slug: string): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
}

export class MemStorage implements IStorage {
  private templates: Map<string, Template>;
  private contacts: Map<string, Contact>;
  private articles: Map<string, Article>;

  constructor() {
    this.templates = new Map();
    this.contacts = new Map();
    this.articles = new Map();
    this.seedData();
  }

  private seedData() {
    const sampleTemplates: InsertTemplate[] = [
      {
        title: "Cinematic Love Story",
        slug: "cinematic-love-story",
        description: "A breathtaking cinematic wedding invitation",
        category: "wedding",
        culture: "universal",
        style: "cinematic",
        duration: 45,
        orientation: "portrait",
        isVideo: true,
        thumbnailUrl: "/images/template1.jpg",
        videoUrl: "/videos/template1.mp4",
        price: 2900,
        isPremium: true,
        tags: ["romantic", "elegant", "modern"],
      },
      {
        title: "Golden Elegance",
        slug: "golden-elegance",
        description: "Luxurious engagement invitation with gold accents",
        category: "engagement",
        culture: "universal",
        style: "elegant",
        duration: 30,
        orientation: "portrait",
        isVideo: true,
        thumbnailUrl: "/images/template2.jpg",
        videoUrl: "/videos/template2.mp4",
        price: 0,
        isPremium: false,
        tags: ["gold", "luxury", "engagement"],
      },
      {
        title: "Traditional Celebration",
        slug: "traditional-celebration",
        description: "Authentic cultural wedding invitation",
        category: "wedding",
        culture: "indian",
        style: "traditional",
        duration: 60,
        orientation: "portrait",
        isVideo: true,
        thumbnailUrl: "/images/template3.jpg",
        videoUrl: "/videos/template3.mp4",
        price: 2900,
        isPremium: true,
        tags: ["traditional", "cultural", "indian"],
      },
    ];

    sampleTemplates.forEach(template => {
      const id = randomUUID();
      this.templates.set(id, { ...template, id });
    });
  }

  async getTemplates(filters?: {
    category?: string;
    culture?: string;
    style?: string;
  }): Promise<Template[]> {
    let templates = Array.from(this.templates.values());
    
    if (filters?.category) {
      templates = templates.filter(t => 
        t.category.toLowerCase() === filters.category!.toLowerCase()
      );
    }
    
    if (filters?.culture) {
      templates = templates.filter(t => 
        t.culture?.toLowerCase() === filters.culture!.toLowerCase()
      );
    }
    
    if (filters?.style) {
      templates = templates.filter(t => 
        t.style.toLowerCase() === filters.style!.toLowerCase()
      );
    }
    
    return templates;
  }

  async getTemplateBySlug(slug: string): Promise<Template | undefined> {
    return Array.from(this.templates.values()).find(
      (template) => template.slug === slug
    );
  }

  async createTemplate(insertTemplate: InsertTemplate): Promise<Template> {
    const id = randomUUID();
    const template: Template = { ...insertTemplate, id };
    this.templates.set(id, template);
    return template;
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const contact: Contact = { ...insertContact, id };
    this.contacts.set(id, contact);
    return contact;
  }

  async getArticles(): Promise<Article[]> {
    return Array.from(this.articles.values());
  }

  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    return Array.from(this.articles.values()).find(
      (article) => article.slug === slug
    );
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const id = randomUUID();
    const article: Article = { ...insertArticle, id };
    this.articles.set(id, article);
    return article;
  }
}

export const storage = new MemStorage();
