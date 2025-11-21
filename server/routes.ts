import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import * as bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Client } from "@replit/object-storage";

const JWT_SECRET = process.env.SESSION_SECRET || "your-secret-key-change-in-production";

const authMiddleware = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

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

  app.get("/api/auth/me", authMiddleware, async (req: any, res) => {
    try {
      const user = await storage.getUserById(req.user.userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json({
        user_id: user.id,
        name: user.name,
        email: user.email,
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ error: "Failed to get user" });
    }
  });

  // ==================== PROJECT ROUTES ====================
  
  app.get("/api/projects/mine", authMiddleware, async (req: any, res) => {
    try {
      const userId = req.user.userId;
      const projects = await storage.getUserProjects(userId);
      
      res.json(projects);
    } catch (error) {
      console.error("Get user projects error:", error);
      res.status(500).json({ error: "Failed to fetch projects" });
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

  app.get("/api/templates/:slugOrId", async (req, res) => {
    try {
      const { slugOrId } = req.params;
      
      // Try to find by slug first, then by ID
      let template = await storage.getTemplateBySlug(slugOrId);
      if (!template) {
        template = await storage.getTemplateById(slugOrId);
      }
      
      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }
      
      // Parse template_json to get pages
      const templateJson = typeof template.templateJson === 'string' 
        ? JSON.parse(template.templateJson) 
        : template.templateJson;
      
      const pages = (templateJson?.pages || []).map((page: any) => ({
        id: page.page_id,
        pageNumber: page.page_number,
        pageName: page.page_name || `Page ${page.page_number}`,
        thumbnailUrl: page.media?.find((m: any) => m.position === 'background')?.url || template.thumbnailUrl,
        editableFields: (page.fields || []).map((field: any) => ({
          id: field.field_id,
          type: field.type,
          label: field.label,
          defaultValue: field.value,
          maxLength: field.type === 'text' ? 100 : 500,
          ae_layer: field.ae_layer
        })),
        media: page.media || []
      }));
      
      const priceInr = parseFloat(template.price);
      
      res.json({
        id: template.id,
        name: template.name,
        title: template.name, // Add title alias for TemplateDetail compatibility
        slug: template.slug,
        type: template.type,
        category: template.type, // Add category alias for TemplateDetail compatibility
        orientation: template.orientation,
        photoOption: template.photoOption,
        tags: template.tags,
        coverImage: template.coverImage,
        thumbnailUrl: template.thumbnailUrl,
        demoVideoUrl: template.coverImage, // Use coverImage which contains video URL
        duration: template.duration,
        currency: template.currency,
        price: priceInr,
        priceInr: Math.floor(priceInr * 100), // Price in paise for compatibility
        isPremium: priceInr >= 2000,
        description: `Create beautiful ${template.name} with customizable pages and send via WhatsApp`,
        country: "india", // Default country
        culture: "hindu", // Default culture from tags
        style: "traditional", // Default style
        pageCount: pages.length,
        templateJson: template.templateJson,
        createdBy: template.createdBy,
        pages: pages, // Add pages array for editor
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

  // ==================== MEDIA SERVING ENDPOINT ====================
  
  app.get("/api/media/Ind/:filename", async (req, res) => {
    try {
      const { filename } = req.params;
      
      // Create Object Storage client (uses default bucket)
      const client = new Client();
      const fileKey = `Ind/${filename}`;
      
      // Set appropriate content type based on file extension
      const contentType = filename.endsWith('.mp4') 
        ? 'video/mp4' 
        : filename.endsWith('.png') 
          ? 'image/png' 
          : 'application/octet-stream';
      
      // Set headers for video/image streaming
      res.set({
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000',
        'Accept-Ranges': 'bytes',
      });
      
      // Stream the file
      const stream = client.downloadAsStream(fileKey);
      
      stream.on('error', (error) => {
        console.error("Stream error for", filename, ":", error);
        if (!res.headersSent) {
          res.status(404).json({ error: "File not found" });
        }
      });
      
      stream.pipe(res);
      
    } catch (error) {
      console.error("Error serving media file:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Failed to serve media file" });
      }
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
