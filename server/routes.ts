import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import * as bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Client } from "@replit/object-storage";
import { adminAuth } from "./firebase-admin";

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
      
      if (phone) {
        const existingPhoneUser = await storage.getUserByPhone(phone);
        if (existingPhoneUser) {
          return res.status(400).json({ error: "User with this phone number already exists" });
        }
      }
      
      const passwordHash = await bcrypt.hash(password, 10);
      
      const user = await storage.createUser({
        name,
        email,
        phone: phone || null,
        passwordHash,
      });
      
      // Generate JWT token for the new user
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: "7d" }
      );
      
      res.status(201).json({
        token,
        user: {
          id: user.id,
          user_id: user.id,
          name: user.name,
          email: user.email,
        },
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
      
      // Check if user has a password (Google auth users don't have passwords)
      if (!user.passwordHash) {
        return res.status(401).json({ error: "This account uses Google Sign-In. Please sign in with Google." });
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
          id: user.id,
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

  // Google Authentication Route
  app.post("/api/auth/google", async (req, res) => {
    try {
      const { idToken } = req.body;
      
      if (!idToken) {
        return res.status(400).json({ error: "ID token is required" });
      }
      
      // Verify the Firebase ID token
      const decodedToken = await adminAuth.verifyIdToken(idToken);
      const { email, name, picture } = decodedToken;
      
      if (!email) {
        return res.status(400).json({ error: "Email not provided by Google" });
      }
      
      // Check if user exists
      let user = await storage.getUserByEmail(email);
      
      if (!user) {
        // Create new user with Google auth (empty password hash)
        // The login route has a guard to prevent password login for Google users
        user = await storage.createUser({
          name: name || email.split('@')[0],
          email,
          phone: null,
          passwordHash: '', // Google auth users don't have password
        });
      }
      // Note: Existing users keep their profile data unchanged
      // TODO: Add updateUser method to storage interface to sync Google profile data
      
      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: "7d" }
      );
      
      res.json({
        token,
        user: {
          id: user.id,
          user_id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error: any) {
      console.error("Google auth error:", error);
      
      // Handle specific Firebase errors
      if (error.code === 'auth/id-token-expired') {
        return res.status(401).json({ error: "Google token expired. Please sign in again." });
      }
      if (error.code === 'auth/argument-error') {
        return res.status(400).json({ error: "Invalid Google token" });
      }
      
      res.status(500).json({ error: "Failed to authenticate with Google" });
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

  // Alias for /api/auth/me to support frontend calling /api/auth/user
  app.get("/api/auth/user", authMiddleware, async (req: any, res) => {
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

  app.post("/api/projects", authMiddleware, async (req: any, res) => {
    try {
      const userId = req.user.userId;
      const { templateId, customization } = req.body;
      
      if (!templateId || !customization) {
        return res.status(400).json({ error: "Template ID and customization are required" });
      }
      
      const project = await storage.createProject({
        userId,
        templateId,
        customization,
        status: "draft",
      });
      
      res.status(201).json(project);
    } catch (error) {
      console.error("Create project error:", error);
      res.status(500).json({ error: "Failed to create project" });
    }
  });

  app.put("/api/projects/:id", authMiddleware, async (req: any, res) => {
    try {
      const userId = req.user.userId;
      const { id } = req.params;
      const updates = req.body;
      
      const existingProject = await storage.getProjectById(id);
      if (!existingProject) {
        return res.status(404).json({ error: "Project not found" });
      }
      
      if (existingProject.userId !== userId) {
        return res.status(403).json({ error: "Not authorized to update this project" });
      }
      
      const updatedProject = await storage.updateProject(id, updates);
      
      res.json(updatedProject);
    } catch (error) {
      console.error("Update project error:", error);
      res.status(500).json({ error: "Failed to update project" });
    }
  });

  app.get("/api/projects/:id", authMiddleware, async (req: any, res) => {
    try {
      const userId = req.user.userId;
      const { id } = req.params;
      
      const project = await storage.getProjectById(id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      
      if (project.userId !== userId) {
        return res.status(403).json({ error: "Not authorized to view this project" });
      }
      
      res.json(project);
    } catch (error) {
      console.error("Get project error:", error);
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  // ==================== TEMPLATE ROUTES ====================
  
  app.get("/api/templates", async (req, res) => {
    try {
      const templates = await storage.getTemplates();
      
      const templateList = templates.map(t => ({
        id: t.id,
        title: t.templateName,
        slug: t.slug,
        category: t.templateType,
        duration: t.durationSec,
        thumbnailUrl: t.thumbnailUrl,
        priceInr: Math.floor(parseFloat(t.price) * 100), // Convert rupees to paise
        tags: t.templateTags,
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
        templateName: template.templateName,
        name: template.templateName, // Add name alias for compatibility
        slug: template.slug,
        templateType: template.templateType,
        category: template.templateType, // Add category alias for compatibility
        orientation: template.orientation,
        photoOption: template.photoOption,
        templateTags: template.templateTags,
        tags: template.templateTags, // Alias
        thumbnailUrl: template.thumbnailUrl,
        previewVideoUrl: template.previewVideoUrl,
        demoVideoUrl: template.previewVideoUrl, // Use previewVideoUrl
        durationSec: template.durationSec,
        duration: template.durationSec, // Alias
        currency: template.currency,
        price: template.price,
        priceInr: Math.floor(parseFloat(template.price) * 100), // Price in paise for compatibility
        isPremium: priceInr >= 2000,
        description: `Create beautiful ${template.templateName} with customizable pages and send via WhatsApp`,
        country: "india", // Default country
        culture: "hindu", // Default culture from tags
        style: "traditional", // Default style
        pageCount: pages.length,
        templateJson: template.templateJson,
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
      
      // TODO: Remove - deprecated endpoint
      return res.status(410).json({ 
        error: "This endpoint is deprecated. Please use /api/projects instead."
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
      
      // TODO: Remove - deprecated endpoint
      return res.status(410).json({ 
        error: "This endpoint is deprecated. Please use /api/projects/:id instead."
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
