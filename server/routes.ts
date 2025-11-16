import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/templates", async (req, res) => {
    try {
      const { category, culture, style } = req.query;
      const templates = await storage.getTemplates({
        category: category as string | undefined,
        culture: culture as string | undefined,
        style: style as string | undefined,
      });
      res.json(templates);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch templates" });
    }
  });

  app.get("/api/templates/:slug", async (req, res) => {
    try {
      const template = await storage.getTemplateBySlug(req.params.slug);
      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }
      res.json(template);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch template" });
    }
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const validated = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validated);
      res.status(201).json({ 
        success: true, 
        message: "Thank you for contacting us. We'll get back to you soon!",
        id: contact.id 
      });
    } catch (error) {
      res.status(400).json({ 
        error: "Invalid contact form data",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/articles", async (req, res) => {
    try {
      const articles = await storage.getArticles();
      res.json(articles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch articles" });
    }
  });

  app.get("/api/articles/:slug", async (req, res) => {
    try {
      const article = await storage.getArticleBySlug(req.params.slug);
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch article" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
