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
        culture: "western",
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
        culture: "western",
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
      {
        title: "Arabian Nights",
        slug: "arabian-nights",
        description: "Elegant Arabic wedding invitation",
        category: "wedding",
        culture: "arabic",
        style: "elegant",
        duration: 50,
        orientation: "portrait",
        isVideo: true,
        thumbnailUrl: "/images/template4.jpg",
        videoUrl: "/videos/template4.mp4",
        price: 2900,
        isPremium: true,
        tags: ["arabic", "elegant", "cultural"],
      },
      {
        title: "Nigerian Heritage",
        slug: "nigerian-heritage",
        description: "Vibrant Nigerian wedding celebration",
        category: "wedding",
        culture: "nigerian",
        style: "traditional",
        duration: 55,
        orientation: "portrait",
        isVideo: true,
        thumbnailUrl: "/images/template5.jpg",
        videoUrl: "/videos/template5.mp4",
        price: 2900,
        isPremium: true,
        tags: ["nigerian", "vibrant", "cultural"],
      },
      {
        title: "Chinese Elegance",
        slug: "chinese-elegance",
        description: "Traditional Chinese wedding invitation",
        category: "wedding",
        culture: "chinese",
        style: "traditional",
        duration: 48,
        orientation: "portrait",
        isVideo: true,
        thumbnailUrl: "/images/template6.jpg",
        videoUrl: "/videos/template6.mp4",
        price: 2900,
        isPremium: true,
        tags: ["chinese", "traditional", "cultural"],
      },
      {
        title: "Modern Romance",
        slug: "modern-romance",
        description: "Contemporary engagement invitation",
        category: "engagement",
        culture: "western",
        style: "modern",
        duration: 40,
        orientation: "portrait",
        isVideo: true,
        thumbnailUrl: "/images/template7.jpg",
        videoUrl: "/videos/template7.mp4",
        price: 1900,
        isPremium: false,
        tags: ["modern", "contemporary", "engagement"],
      },
      {
        title: "Baby Celebration",
        slug: "baby-celebration",
        description: "Sweet baby shower invitation",
        category: "baby",
        culture: "western",
        style: "modern",
        duration: 35,
        orientation: "portrait",
        isVideo: true,
        thumbnailUrl: "/images/template8.jpg",
        videoUrl: "/videos/template8.mp4",
        price: 1500,
        isPremium: false,
        tags: ["baby", "shower", "modern"],
      },
      {
        title: "Birthday Bash",
        slug: "birthday-bash",
        description: "Fun birthday party invitation",
        category: "birthday",
        culture: "western",
        style: "modern",
        duration: 30,
        orientation: "portrait",
        isVideo: true,
        thumbnailUrl: "/images/template9.jpg",
        videoUrl: "/videos/template9.mp4",
        price: 1200,
        isPremium: false,
        tags: ["birthday", "fun", "party"],
      },
      {
        title: "Corporate Event",
        slug: "corporate-event",
        description: "Professional corporate event invitation",
        category: "corporate",
        culture: "western",
        style: "modern",
        duration: 42,
        orientation: "portrait",
        isVideo: true,
        thumbnailUrl: "/images/template10.jpg",
        videoUrl: "/videos/template10.mp4",
        price: 2500,
        isPremium: true,
        tags: ["corporate", "professional", "business"],
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
