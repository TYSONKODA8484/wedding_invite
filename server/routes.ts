import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  ObjectStorageService,
  ObjectNotFoundError,
} from "./objectStorage";
import {
  insertTemplateSchema,
  insertCustomizationSchema,
  insertCustomizationPageSchema,
  insertOrderSchema,
  insertPaymentSchema,
  insertAnalyticsEventSchema,
} from "@shared/schema";
import path from "path";
import fs from "fs/promises";

export async function registerRoutes(app: Express): Promise<Server> {
  // ==================== TEMPLATE ROUTES ====================
  
  app.get("/api/templates", async (req, res) => {
    try {
      const { category, culture, style } = req.query;
      const templates = await storage.getTemplates({
        category: category as string | undefined,
        culture: culture as string | undefined,
        style: style as string | undefined,
        isActive: true,
      });
      res.json(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ error: "Failed to fetch templates" });
    }
  });

  app.get("/api/templates/:slug", async (req, res) => {
    try {
      const template = await storage.getTemplateBySlug(req.params.slug);
      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }
      
      // Fetch template pages
      const pages = await storage.getTemplatePages(template.id);
      
      res.json({ ...template, pages });
    } catch (error) {
      console.error("Error fetching template:", error);
      res.status(500).json({ error: "Failed to fetch template" });
    }
  });

  app.get("/api/templates/:id/pages", async (req, res) => {
    try {
      const pages = await storage.getTemplatePages(req.params.id);
      res.json(pages);
    } catch (error) {
      console.error("Error fetching template pages:", error);
      res.status(500).json({ error: "Failed to fetch template pages" });
    }
  });

  // ==================== CUSTOMIZATION ROUTES ====================
  
  app.get("/api/customizations", async (req: any, res) => {
    try {
      const userId = "demo-user-1"; // Demo mode: no auth required
      const customizations = await storage.getUserCustomizations(userId);
      res.json(customizations);
    } catch (error) {
      console.error("Error fetching customizations:", error);
      res.status(500).json({ error: "Failed to fetch customizations" });
    }
  });

  app.get("/api/customizations/:id", async (req: any, res) => {
    try {
      const userId = "demo-user-1"; // Demo mode: no auth required
      const customization = await storage.getCustomizationById(req.params.id);
      
      if (!customization) {
        return res.status(404).json({ error: "Customization not found" });
      }
      
      // Verify ownership
      if (customization.userId !== userId) {
        return res.status(403).json({ error: "Forbidden" });
      }
      
      // Fetch customization pages
      const pages = await storage.getCustomizationPages(customization.id);
      
      res.json({ ...customization, pages });
    } catch (error) {
      console.error("Error fetching customization:", error);
      res.status(500).json({ error: "Failed to fetch customization" });
    }
  });

  app.post("/api/customizations", async (req: any, res) => {
    try {
      const userId = "demo-user-1"; // Demo mode: no auth required
      const validated = insertCustomizationSchema.parse({
        ...req.body,
        userId,
      });
      
      const customization = await storage.createCustomization(validated);
      res.status(201).json(customization);
    } catch (error) {
      console.error("Error creating customization:", error);
      res.status(400).json({ 
        error: "Invalid customization data",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.patch("/api/customizations/:id", async (req: any, res) => {
    try {
      const userId = "demo-user-1"; // Demo mode: no auth required
      const customization = await storage.getCustomizationById(req.params.id);
      
      if (!customization) {
        return res.status(404).json({ error: "Customization not found" });
      }
      
      // Verify ownership
      if (customization.userId !== userId) {
        return res.status(403).json({ error: "Forbidden" });
      }
      
      const updated = await storage.updateCustomization(req.params.id, req.body);
      res.json(updated);
    } catch (error) {
      console.error("Error updating customization:", error);
      res.status(500).json({ error: "Failed to update customization" });
    }
  });

  // ==================== CUSTOMIZATION PAGE ROUTES ====================
  
  app.post("/api/customizations/:id/pages", async (req: any, res) => {
    try {
      const userId = "demo-user-1"; // Demo mode: no auth required
      const customization = await storage.getCustomizationById(req.params.id);
      
      if (!customization) {
        return res.status(404).json({ error: "Customization not found" });
      }
      
      if (customization.userId !== userId) {
        return res.status(403).json({ error: "Forbidden" });
      }
      
      const validated = insertCustomizationPageSchema.parse({
        ...req.body,
        customizationId: req.params.id,
      });
      
      const page = await storage.createCustomizationPage(validated);
      res.status(201).json(page);
    } catch (error) {
      console.error("Error creating customization page:", error);
      res.status(400).json({ 
        error: "Invalid page data",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.patch("/api/customization-pages/:id", async (req: any, res) => {
    try {
      const updated = await storage.updateCustomizationPage(
        req.params.id,
        req.body.fieldValues
      );
      res.json(updated);
    } catch (error) {
      console.error("Error updating customization page:", error);
      res.status(500).json({ error: "Failed to update page" });
    }
  });

  // ==================== OBJECT STORAGE ROUTES ====================
  
  // Stock images serving (for demo/MVP - serves from attached_assets/stock_images)
  app.get("/stock-images/:filename", async (req, res) => {
    try {
      const rawFilename = req.params.filename;
      
      // SECURITY LAYER 1: Reject any filename containing % to prevent double-encoding attacks
      // This blocks payloads like %252e%252e%2F (decodes to ..%2F then to ../)
      if (rawFilename.includes("%")) {
        console.warn(`[SECURITY] Encoded characters detected in filename: ${rawFilename}`);
        return res.status(400).json({ error: "Invalid filename" });
      }
      
      // Decode URL-encoded filename
      const decodedFilename = decodeURIComponent(rawFilename);
      
      // SECURITY LAYER 2: Use path.basename to strip ALL directory components
      // This prevents all forms of path traversal (../, ..\, encoded variants)
      const safeFilename = path.basename(decodedFilename);
      
      // Verify basename didn't change the filename (would indicate path components)
      if (safeFilename !== decodedFilename) {
        console.warn(`[SECURITY] Path components detected: ${decodedFilename} -> ${safeFilename}`);
        return res.status(400).json({ error: "Invalid filename" });
      }
      
      // SECURITY LAYER 3: Whitelist allowed extensions
      const ext = path.extname(safeFilename).toLowerCase();
      const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
      if (!allowedExtensions.includes(ext)) {
        return res.status(400).json({ error: "Invalid file type" });
      }
      
      // Build safe file path
      const stockImagesDir = path.join(process.cwd(), "attached_assets", "stock_images");
      const imagePath = path.join(stockImagesDir, safeFilename);
      
      // SECURITY LAYER 4: Verify resolved path is within stock_images directory
      const resolvedPath = path.resolve(imagePath);
      const resolvedBaseDir = path.resolve(stockImagesDir) + path.sep;
      if (!resolvedPath.startsWith(resolvedBaseDir)) {
        console.warn(`[SECURITY] Path escape detected: ${resolvedPath} not in ${resolvedBaseDir}`);
        return res.status(403).json({ error: "Access denied" });
      }
      
      // Read the image file
      const imageBuffer = await fs.readFile(resolvedPath);
      
      // Set appropriate content type
      const contentType = ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" : 
                         ext === ".png" ? "image/png" :
                         ext === ".webp" ? "image/webp" : "image/jpeg";
      
      res.set("Content-Type", contentType);
      res.set("Cache-Control", "public, max-age=31536000"); // Cache for 1 year
      res.send(imageBuffer);
    } catch (error) {
      console.error("Error serving stock image:", error);
      res.status(404).json({ error: "Image not found" });
    }
  });
  
  // Public object serving (template thumbnails, demo videos)
  app.get("/public-objects/:filePath(*)", async (req, res) => {
    const filePath = req.params.filePath;
    const objectStorageService = new ObjectStorageService();
    try {
      const file = await objectStorageService.searchPublicObject(filePath);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }
      objectStorageService.downloadObject(file, res);
    } catch (error) {
      console.error("Error searching for public object:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Private object serving (user uploaded photos)
  app.get("/objects/:objectPath(*)", async (req: any, res) => {
    const userId = "demo-user-1"; // Demo mode: no auth required
    const objectStorageService = new ObjectStorageService();
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(
        req.path,
      );
      const canAccess = await objectStorageService.canAccessObjectEntity({
        objectFile,
        userId: userId,
      });
      if (!canAccess) {
        return res.sendStatus(401);
      }
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error checking object access:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  // Upload URL generation
  app.post("/api/objects/upload", async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    try {
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error generating upload URL:", error);
      res.status(500).json({ error: "Failed to generate upload URL" });
    }
  });

  // Image upload completion (set ACL)
  app.put("/api/images", async (req: any, res) => {
    if (!req.body.imageURL) {
      return res.status(400).json({ error: "imageURL is required" });
    }

    const userId = "demo-user-1"; // Demo mode: no auth required

    try {
      const objectStorageService = new ObjectStorageService();
      const objectPath = await objectStorageService.trySetObjectEntityAclPolicy(
        req.body.imageURL,
        {
          owner: userId,
          visibility: "private", // User uploaded photos are private
        },
      );

      res.status(200).json({
        objectPath: objectPath,
      });
    } catch (error) {
      console.error("Error setting image:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ==================== PREVIEW & ORDER ROUTES ====================
  
  // Request preview generation
  app.post("/api/customizations/:id/request-preview", async (req: any, res) => {
    try {
      const userId = "demo-user-1"; // Demo mode: no auth required
      const customization = await storage.getCustomizationById(req.params.id);
      
      if (!customization) {
        return res.status(404).json({ error: "Customization not found" });
      }
      
      if (customization.userId !== userId) {
        return res.status(403).json({ error: "Forbidden" });
      }
      
      // TODO: Integrate with external After Effects API for video rendering
      // For now, update status to preview_requested
      await storage.updateCustomization(req.params.id, {
        status: "preview_requested",
        previewRequestedAt: new Date(),
      });
      
      res.json({ 
        message: "Preview request submitted",
        status: "preview_requested"
      });
    } catch (error) {
      console.error("Error requesting preview:", error);
      res.status(500).json({ error: "Failed to request preview" });
    }
  });

  // Create order (before Razorpay payment)
  app.post("/api/orders", async (req: any, res) => {
    try {
      const userId = "demo-user-1"; // Demo mode: no auth required
      const validated = insertOrderSchema.parse({
        ...req.body,
        userId,
      });
      
      const order = await storage.createOrder(validated);
      
      // TODO: Create Razorpay order and return razorpay_order_id
      
      res.status(201).json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(400).json({ 
        error: "Invalid order data",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/orders", async (req: any, res) => {
    try {
      const userId = "demo-user-1"; // Demo mode: no auth required
      const orders = await storage.getUserOrders(userId);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  // ==================== PAYMENT ROUTES ====================
  
  // Verify Razorpay payment
  app.post("/api/payments/verify", async (req: any, res) => {
    try {
      const userId = "demo-user-1"; // Demo mode: no auth required
      
      // TODO: Verify Razorpay signature
      // TODO: Update order status to 'paid'
      // TODO: Update customization status to 'paid'
      // TODO: Trigger final video generation
      
      const validated = insertPaymentSchema.parse({
        ...req.body,
        userId,
      });
      
      const payment = await storage.createPayment(validated);
      res.status(201).json(payment);
    } catch (error) {
      console.error("Error verifying payment:", error);
      res.status(400).json({ 
        error: "Payment verification failed",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // ==================== DOWNLOAD ROUTES ====================
  
  app.post("/api/downloads", async (req: any, res) => {
    try {
      const userId = "demo-user-1"; // Demo mode: no auth required
      const { orderId } = req.body;
      
      // Check download limit (max 5 per order)
      const existingDownloads = await storage.getOrderDownloads(orderId);
      if (existingDownloads.length >= 5) {
        return res.status(403).json({ 
          error: "Download limit exceeded",
          message: "Maximum 5 downloads per order"
        });
      }
      
      // Verify order belongs to user
      const order = await storage.getOrderById(orderId);
      if (!order || order.userId !== userId || order.status !== 'paid') {
        return res.status(403).json({ error: "Forbidden" });
      }
      
      // TODO: Generate signed URL for final video (48h expiry)
      
      const download = await storage.createDownload({
        orderId,
        userId,
        customizationId: order.customizationId,
        signedUrl: "", // TODO: Generate actual signed URL
        urlExpiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      });
      
      res.status(201).json(download);
    } catch (error) {
      console.error("Error creating download:", error);
      res.status(500).json({ error: "Failed to create download" });
    }
  });

  app.get("/api/orders/:id/downloads", async (req: any, res) => {
    try {
      const userId = "demo-user-1"; // Demo mode: no auth required
      const order = await storage.getOrderById(req.params.id);
      
      if (!order || order.userId !== userId) {
        return res.status(403).json({ error: "Forbidden" });
      }
      
      const downloads = await storage.getOrderDownloads(req.params.id);
      res.json(downloads);
    } catch (error) {
      console.error("Error fetching downloads:", error);
      res.status(500).json({ error: "Failed to fetch downloads" });
    }
  });

  // ==================== ANALYTICS ROUTES ====================
  
  app.post("/api/analytics/track", async (req, res) => {
    try {
      const validated = insertAnalyticsEventSchema.parse(req.body);
      await storage.trackEvent(validated);
      res.status(201).json({ success: true });
    } catch (error) {
      console.error("Error tracking event:", error);
      res.status(400).json({ error: "Invalid event data" });
    }
  });

  // ==================== CONTACT ROUTE (Marketing Site) ====================
  
  app.post("/api/contact", async (req, res) => {
    try {
      const contact = await storage.createContact(req.body);
      res.status(201).json({ 
        success: true, 
        message: "Thank you for contacting us. We'll get back to you soon!",
        id: contact.id 
      });
    } catch (error) {
      console.error("Error creating contact:", error);
      res.status(400).json({ 
        error: "Invalid contact form data",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
