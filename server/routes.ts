import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import * as bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.SESSION_SECRET || "your-secret-key-change-in-production";

export async function registerRoutes(app: Express): Promise<Server> {
  // ==================== AUTH ROUTES ====================
  
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { name, email, phone, password } = req.body;
      
      if (!name || !email || !password) {
        return res.status(400).json({ error: "Name, email, and password are required" });
      }
      
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "User with this email already exists" });
      }
      
      const passwordHash = await bcrypt.hash(password, 10);
      
      const user = await storage.createUser({
        name,
        email,
        phone: phone || null,
        passwordHash,
      });
      
      res.status(201).json({
        user_id: user.id,
        name: user.name,
        email: user.email,
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ error: "Failed to create user" });
    }
  });
  
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: "7d" }
      );
      
      res.json({
        token,
        user: {
          user_id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Failed to login" });
    }
  });

  // ==================== TEMPLATE ROUTES ====================
  
  app.get("/api/templates", async (req, res) => {
    try {
      const templates = await storage.getTemplates();
      
      const templateList = templates.map(t => ({
        id: t.id,
        title: t.name,
        slug: t.slug,
        category: t.type,
        duration: t.duration,
        thumbnailUrl: t.thumbnailUrl,
        priceInr: Math.floor(parseFloat(t.price) * 100), // Convert rupees to paise
        tags: t.tags,
        orientation: t.orientation,
        isPremium: parseFloat(t.price) >= 2000, // Templates >= ₹2000 are premium
      }));
      
      res.json(templateList);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ error: "Failed to fetch templates" });
    }
  });

  app.get("/api/templates/:id", async (req, res) => {
    try {
      const template = await storage.getTemplateById(req.params.id);
      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }
      
      res.json({
        template_id: template.id,
        name: template.name,
        type: template.type,
        orientation: template.orientation,
        photo_option: template.photoOption,
        tags: template.tags,
        cover_image: template.coverImage,
        currency: template.currency,
        price: parseFloat(template.price),
        template_json: template.templateJson,
        created_by: template.createdBy,
      });
    } catch (error) {
      console.error("Error fetching template:", error);
      res.status(500).json({ error: "Failed to fetch template" });
    }
  });

  // ==================== INSTANCE ROUTES ====================
  
  app.post("/api/instances", async (req, res) => {
    try {
      const { template_id, user_id, template_json, currency, amount } = req.body;
      
      if (!template_id || !user_id || !template_json) {
        return res.status(400).json({ error: "template_id, user_id, and template_json are required" });
      }
      
      const customization = await storage.createCustomization({
        userId: user_id,
        templateId: template_id,
        templateJson: template_json,
        currency: currency || "INR",
        amount: amount || "0",
        status: "draft",
      });
      
      res.json({
        instance_id: customization.id,
        status: customization.status,
      });
    } catch (error) {
      console.error("Error creating instance:", error);
      res.status(500).json({ error: "Failed to create instance" });
    }
  });
  
  app.put("/api/instances/:id", async (req, res) => {
    try {
      const { template_json } = req.body;
      
      if (!template_json) {
        return res.status(400).json({ error: "template_json is required" });
      }
      
      const updated = await storage.updateCustomization(req.params.id, {
        templateJson: template_json,
      });
      
      if (!updated) {
        return res.status(404).json({ error: "Instance not found" });
      }
      
      res.json({
        instance_id: updated.id,
        status: updated.status,
      });
    } catch (error) {
      console.error("Error updating instance:", error);
      res.status(500).json({ error: "Failed to update instance" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
