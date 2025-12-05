import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import * as bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Client } from "@replit/object-storage";
import { adminAuth } from "./firebase-admin";
import { renderProject, renderPagePreview } from "./render-service";

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
        authProvider: "password",
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
      const { uid: googleId, email, name, picture } = decodedToken;
      
      if (!email) {
        return res.status(400).json({ error: "Email not provided by Google" });
      }
      
      // First, check if user exists by Google ID
      let user = await storage.getUserByGoogleId(googleId);
      
      if (!user) {
        // Check if user exists by email (account linking)
        const existingUser = await storage.getUserByEmail(email);
        
        if (existingUser) {
          // Existing user signing in with Google for the first time
          // Link their Google account by updating their record
          const updatedUser = await storage.updateUser(existingUser.id, {
            googleId,
            authProvider: "google",
          });
          user = updatedUser!;
        } else {
          // New user - create account with Google auth
          user = await storage.createUser({
            name: name || email.split('@')[0],
            email,
            phone: null,
            passwordHash: null,
            googleId,
            authProvider: "google",
          });
        }
      }
      
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
      
      // Batch fetch all music IDs in a single query (fixes N+1 problem)
      const musicIds = projects
        .map((p: any) => p.selectedMusicId)
        .filter((id: string | null): id is string => id !== null);
      
      const musicTracks = musicIds.length > 0 
        ? await storage.getMusicByIds(musicIds) 
        : [];
      
      // Create a lookup map for O(1) access
      const musicMap = new Map(musicTracks.map(m => [m.id, m]));
      
      // Enrich projects with music information using the map
      const enrichedProjects = projects.map((project: any) => {
        const selectedMusic = project.selectedMusicId 
          ? musicMap.get(project.selectedMusicId) 
          : null;
        
        return {
          ...project,
          selectedMusic: selectedMusic ? {
            id: selectedMusic.id,
            name: selectedMusic.name,
            url: selectedMusic.url,
            duration: selectedMusic.duration,
            category: selectedMusic.category,
          } : null,
        };
      });
      
      res.json(enrichedProjects);
    } catch (error) {
      console.error("Get user projects error:", error);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.post("/api/projects", authMiddleware, async (req: any, res) => {
    try {
      const userId = req.user.userId;
      const { templateId, customization, selectedMusicId, customMusicUrl, status } = req.body;
      
      if (!templateId || !customization) {
        return res.status(400).json({ error: "Template ID and customization are required" });
      }
      
      // Get template to check for default music and type
      const template = await storage.getTemplateById(templateId);
      
      // Determine music to use:
      // 1. If customMusicUrl provided, use it (user uploaded custom music)
      // 2. If selectedMusicId provided, use it (user selected stock music)
      // 3. Otherwise, use template's default music
      let finalSelectedMusicId = selectedMusicId || null;
      let finalCustomMusicUrl = customMusicUrl || null;
      
      // If no music specified by user and template has default, use template default
      if (!selectedMusicId && !customMusicUrl && template?.defaultMusicId) {
        finalSelectedMusicId = template.defaultMusicId;
      }
      
      // Create the initial project
      let project = await storage.createProject({
        userId,
        templateId,
        customization,
        status: status || "draft",
        selectedMusicId: finalSelectedMusicId,
        customMusicUrl: finalCustomMusicUrl,
      });
      
      // If status is preview_requested, run the dummy render service
      if (status === "preview_requested" && template) {
        const renderResult = await renderProject(project.id, template.templateType);
        project = await storage.updateProject(project.id, {
          previewUrl: renderResult.previewUrl,
          finalUrl: renderResult.finalUrl,
          status: "completed",
        }) || project;
      }
      
      // Increment template generation count for popularity tracking
      await storage.incrementTemplateGeneration(templateId);
      
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
      
      // First apply the updates
      let updatedProject = await storage.updateProject(id, updates);
      
      // If status changed to preview_requested, run the dummy render service
      if (updates.status === "preview_requested" && updatedProject) {
        const template = await storage.getTemplateById(existingProject.templateId);
        if (template) {
          const renderResult = await renderProject(id, template.templateType);
          updatedProject = await storage.updateProject(id, {
            previewUrl: renderResult.previewUrl,
            finalUrl: renderResult.finalUrl,
            status: "completed",
          }) || updatedProject;
        }
      }
      
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
      
      // Fetch music information if project has selectedMusicId
      let selectedMusic = null;
      if ((project as any).selectedMusicId) {
        selectedMusic = await storage.getMusicById((project as any).selectedMusicId);
      }
      
      res.json({
        ...project,
        selectedMusic: selectedMusic ? {
          id: selectedMusic.id,
          name: selectedMusic.name,
          url: selectedMusic.url,
          duration: selectedMusic.duration,
          category: selectedMusic.category,
        } : null,
      });
    } catch (error) {
      console.error("Get project error:", error);
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  // Delete a project (only allowed for unpaid/generated templates)
  app.delete("/api/projects/:id", authMiddleware, async (req: any, res) => {
    try {
      const userId = req.user.userId;
      const { id } = req.params;
      
      const project = await storage.getProjectById(id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      
      if (project.userId !== userId) {
        return res.status(403).json({ error: "Not authorized to delete this project" });
      }
      
      // Only allow deleting unpaid projects
      if (project.paidAt) {
        return res.status(400).json({ error: "Cannot delete paid templates" });
      }
      
      await storage.deleteProject(id);
      
      res.json({ success: true, message: "Project deleted successfully" });
    } catch (error) {
      console.error("Delete project error:", error);
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  // Render a single page preview with customizations
  // No auth required - preview is available to all users (shows watermarked dummy images)
  // Data is NOT saved to database - only returned for client-side display
  // Preview URLs are saved to project only when Generate is clicked (via saveProjectMutation)
  app.post("/api/preview/page", async (req: any, res) => {
    try {
      const { projectId, templateId, pageId, previewIndex, customization } = req.body;
      
      if (!pageId) {
        return res.status(400).json({ error: "pageId is required" });
      }
      
      // Render the page preview (cycles through dummy images for now)
      const currentIndex = previewIndex || 0;
      const result = await renderPagePreview(projectId || templateId, pageId, currentIndex);
      
      // Return preview URL - client will store in state and save to project only on Generate
      res.json({
        success: true,
        previewUrl: result.previewUrl,
        nextIndex: result.nextIndex,
        pageId,
      });
    } catch (error) {
      console.error("Page preview error:", error);
      res.status(500).json({ error: "Failed to generate page preview" });
    }
  });

  // Backfill endpoint to populate NULL previewUrl/finalUrl for existing projects
  app.post("/api/admin/backfill-project-urls", async (req, res) => {
    try {
      const allProjects = await storage.getAllProjects();
      let updatedCount = 0;
      
      for (const project of allProjects) {
        // Only update projects that have NULL URLs
        if (!project.previewUrl || !project.finalUrl) {
          const template = await storage.getTemplateById(project.templateId);
          if (template) {
            const renderResult = await renderProject(project.id, template.templateType);
            await storage.updateProject(project.id, {
              previewUrl: renderResult.previewUrl,
              finalUrl: renderResult.finalUrl,
            });
            updatedCount++;
          }
        }
      }
      
      res.json({ 
        success: true, 
        message: `Backfilled ${updatedCount} projects with preview/final URLs`,
        totalProjects: allProjects.length,
        updatedCount
      });
    } catch (error) {
      console.error("Backfill error:", error);
      res.status(500).json({ error: "Failed to backfill project URLs" });
    }
  });

  // ==================== TEMPLATE ROUTES ====================
  
  app.get("/api/templates", async (req, res) => {
    try {
      const { 
        category, 
        subcategory, 
        region,
        type, 
        orientation, 
        photo,
        sort,
        offset,
        limit
      } = req.query;
      
      const allTemplates = await storage.getTemplates();
      
      // Apply filters
      let filteredTemplates = allTemplates;
      
      // Filter by category (wedding/birthday/anniversary etc.)
      if (category) {
        filteredTemplates = filteredTemplates.filter(t => t.category === category);
      }
      
      // Filter by subcategory
      if (subcategory) {
        filteredTemplates = filteredTemplates.filter(t => t.subcategory === subcategory);
      }
      
      // Filter by region (india/uae/saudi/gulf/south_asia)
      if (region) {
        filteredTemplates = filteredTemplates.filter(t => t.region === region);
      }
      
      // Filter by type (video/card)
      if (type) {
        filteredTemplates = filteredTemplates.filter(t => t.templateType === type);
      }
      
      // Filter by orientation (portrait/landscape)
      if (orientation) {
        filteredTemplates = filteredTemplates.filter(t => t.orientation === orientation);
      }
      
      // Filter by photo option (with_photo/without_photo)
      if (photo) {
        filteredTemplates = filteredTemplates.filter(t => t.photoOption === photo);
      }
      
      // Apply sorting - default to newest if no sort specified
      if (sort === 'popular') {
        filteredTemplates.sort((a, b) => (b.popularityScore || 0) - (a.popularityScore || 0));
      } else if (sort === 'price_low') {
        filteredTemplates.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      } else if (sort === 'price_high') {
        filteredTemplates.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      } else {
        // Default: newest first (by createdAt descending)
        filteredTemplates.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
      }
      
      // Get total count before pagination
      const total = filteredTemplates.length;
      
      // Apply pagination
      const offsetNum = offset ? parseInt(offset as string, 10) : 0;
      const limitNum = limit ? parseInt(limit as string, 10) : 25;
      const paginatedTemplates = filteredTemplates.slice(offsetNum, offsetNum + limitNum);
      
      const templateList = paginatedTemplates.map(t => {
        const templateJson = typeof t.templateJson === 'string' 
          ? JSON.parse(t.templateJson) 
          : t.templateJson;
        const pageCount = templateJson?.pages?.length || 1;
        
        return {
          id: t.id,
          title: t.templateName,
          templateName: t.templateName,
          slug: t.slug,
          templateType: t.templateType,
          category: t.category,
          subcategory: t.subcategory,
          duration: t.durationSec,
          durationSec: t.durationSec,
          thumbnailUrl: t.thumbnailUrl,
          previewVideoUrl: t.previewVideoUrl,
          demoVideoUrl: t.previewVideoUrl,
          price: Math.floor(parseFloat(t.price) * 100),
          priceInr: Math.floor(parseFloat(t.price) * 100),
          tags: t.templateTags,
          orientation: t.orientation,
          photoOption: t.photoOption,
          isPremium: parseFloat(t.price) >= 2000,
          popularityScore: t.popularityScore || 0,
          pageCount: pageCount,
          templateJson: templateJson,
        };
      });
      
      // Return paginated response with metadata
      res.json({
        templates: templateList,
        pagination: {
          total,
          offset: offsetNum,
          limit: limitNum,
          hasMore: offsetNum + limitNum < total,
        }
      });
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
      
      // Fetch default music if template is a video
      let defaultMusic = null;
      if (template.templateType === 'video' && (template as any).defaultMusicId) {
        defaultMusic = await storage.getMusicById((template as any).defaultMusicId);
      }
      
      res.json({
        id: template.id,
        templateName: template.templateName,
        name: template.templateName, // Add name alias for compatibility
        slug: template.slug,
        templateType: template.templateType,
        category: template.category, // wedding or birthday
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
        defaultMusicId: (template as any).defaultMusicId,
        defaultMusic: defaultMusic ? {
          id: defaultMusic.id,
          name: defaultMusic.name,
          url: defaultMusic.url,
          duration: defaultMusic.duration,
          category: defaultMusic.category,
        } : null,
      });
    } catch (error) {
      console.error("Error fetching template:", error);
      res.status(500).json({ error: "Failed to fetch template" });
    }
  });

  // ==================== MUSIC ROUTES ====================
  
  app.get("/api/music", async (req, res) => {
    try {
      const { category } = req.query;
      const musicList = await storage.getMusicLibrary(category as string | undefined);
      
      res.json({
        music: musicList.map(m => ({
          id: m.id,
          name: m.name,
          url: m.url,
          duration: m.duration,
          category: m.category,
        }))
      });
    } catch (error) {
      console.error("Error fetching music:", error);
      res.status(500).json({ error: "Failed to fetch music library" });
    }
  });

  app.get("/api/music/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const track = await storage.getMusicById(id);
      
      if (!track) {
        return res.status(404).json({ error: "Music track not found" });
      }
      
      res.json({
        id: track.id,
        name: track.name,
        url: track.url,
        duration: track.duration,
        category: track.category,
      });
    } catch (error) {
      console.error("Error fetching music track:", error);
      res.status(500).json({ error: "Failed to fetch music track" });
    }
  });

  // Upload custom music for a project
  app.post("/api/projects/:projectId/music/upload", authMiddleware, async (req: any, res) => {
    try {
      const userId = req.user.userId;
      const { projectId } = req.params;
      
      // Verify project belongs to user
      const project = await storage.getProjectById(projectId);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      if (project.userId !== userId) {
        return res.status(403).json({ error: "Not authorized" });
      }
      
      // Expect base64 encoded audio data and filename
      const { audioData, filename, mimeType } = req.body;
      
      if (!audioData) {
        return res.status(400).json({ error: "Audio data is required" });
      }
      
      // Validate mime type
      const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'];
      if (mimeType && !allowedTypes.includes(mimeType)) {
        return res.status(400).json({ error: "Invalid audio format. Allowed: MP3, WAV, OGG" });
      }
      
      // Decode base64 data
      const audioBuffer = Buffer.from(audioData, 'base64');
      
      // Validate file size (max 10MB)
      if (audioBuffer.length > 10 * 1024 * 1024) {
        return res.status(400).json({ error: "File too large. Max 10MB allowed." });
      }
      
      // Create object storage client
      const objectStorage = new Client();
      
      // Generate unique filename with timestamp
      const timestamp = Date.now();
      const safeFilename = filename?.replace(/[^a-zA-Z0-9.-]/g, '_') || 'custom_music.mp3';
      const storagePath = `user_music/${userId}/${projectId}_${timestamp}_${safeFilename}`;
      
      // Upload to object storage
      await objectStorage.uploadFromBytes(storagePath, audioBuffer);
      
      // Get the public URL
      const musicUrl = `/api/media/user_music/${userId}/${projectId}_${timestamp}_${safeFilename}`;
      
      // Update project with custom music URL
      await storage.updateProject(projectId, {
        customMusicUrl: musicUrl,
        selectedMusicId: null, // Clear stock music selection when custom is uploaded
      });
      
      res.json({
        success: true,
        musicUrl,
        filename: safeFilename,
      });
    } catch (error) {
      console.error("Error uploading custom music:", error);
      res.status(500).json({ error: "Failed to upload music" });
    }
  });

  // ==================== INSTANCE ROUTES (Deprecated) ====================
  
  app.post("/api/instances", async (_req, res) => {
    return res.status(410).json({ 
      error: "This endpoint is deprecated. Please use /api/projects instead."
    });
  });
  
  app.put("/api/instances/:id", async (_req, res) => {
    return res.status(410).json({ 
      error: "This endpoint is deprecated. Please use /api/projects/:id instead."
    });
  });

  // ==================== PAYMENT ROUTES ====================
  
  app.post("/api/payment/create-order", authMiddleware, async (req: any, res) => {
    try {
      const { projectId } = req.body;
      const userId = req.user.userId;
      
      if (!projectId) {
        return res.status(400).json({ error: "Project ID is required" });
      }
      
      // Get project details
      const project = await storage.getProjectById(projectId);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      
      // Verify project belongs to user
      if (project.userId !== userId) {
        return res.status(403).json({ error: "Not authorized to access this project" });
      }
      
      // Check if project is already paid
      if (project.paidAt) {
        return res.status(400).json({ error: "Project already paid for" });
      }
      
      // Get template details for pricing
      const template = await storage.getTemplateById(project.templateId);
      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }
      
      // Create order in database
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;
      const order = await storage.createOrder({
        orderNumber,
        userId,
        projectId,
        templateId: template.id,
        amount: template.price,
        currency: template.currency,
        status: "pending",
        paymentProvider: "razorpay",
      });
      
      // Create Razorpay order
      const { createRazorpayOrder } = await import("./razorpay");
      const rzpOrder = await createRazorpayOrder(
        parseFloat(template.price),
        template.currency,
        orderNumber
      );
      
      // Update order with Razorpay order ID
      await storage.updateOrder(order.id, {
        providerOrderId: rzpOrder.id,
      });
      
      res.json({
        orderId: order.id,
        razorpayOrderId: rzpOrder.id,
        amount: template.price,
        currency: template.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ error: "Failed to create payment order" });
    }
  });
  
  app.post("/api/payment/verify", authMiddleware, async (req: any, res) => {
    try {
      const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
      const userId = req.user.userId;
      
      if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        return res.status(400).json({ error: "Missing required payment details" });
      }
      
      // Get order
      const order = await storage.getOrderById(orderId);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      
      // Verify order belongs to user
      if (order.userId !== userId) {
        return res.status(403).json({ error: "Not authorized" });
      }
      
      // Verify payment signature
      const { verifyRazorpaySignature } = await import("./razorpay");
      const isValid = verifyRazorpaySignature(
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature
      );
      
      if (!isValid) {
        return res.status(400).json({ error: "Invalid payment signature" });
      }
      
      // Update order status to paid
      await storage.updateOrder(orderId, {
        status: "paid",
      });
      
      // Update project as paid
      await storage.updateProject(order.projectId, {
        paidAt: new Date(),
        status: "completed",
      });
      
      // Create payment record
      await storage.createPayment({
        orderId,
        provider: "razorpay",
        status: "success",
        amount: order.amount,
        currency: order.currency,
        payload: {
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature,
        },
      });
      
      // Create user template record (purchase record)
      await storage.createUserTemplate({
        userId,
        projectId: order.projectId,
        purchaseAmount: order.amount,
        razorpayOrderId,
        razorpayPaymentId,
      });
      
      // Increment template purchase count for popularity tracking
      await storage.incrementTemplatePurchase(order.templateId);
      
      // Get the updated project with download URL
      const updatedProject = await storage.getProjectById(order.projectId);
      const template = await storage.getTemplateById(order.templateId);
      
      res.json({
        success: true,
        message: "Payment verified successfully",
        projectId: order.projectId,
        downloadUrl: updatedProject?.finalUrl || updatedProject?.previewUrl || template?.previewVideoUrl || null,
        templateName: template?.templateName || "Video",
      });
    } catch (error) {
      console.error("Error verifying payment:", error);
      res.status(500).json({ error: "Failed to verify payment" });
    }
  });

  // ==================== MEDIA SERVING ENDPOINT ====================
  
  // Helper function to get content type from filename
  const getContentType = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
      'mp4': 'video/mp4',
      'webm': 'video/webm',
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'mp3': 'audio/mpeg',
      'wav': 'audio/wav',
      'm4a': 'audio/mp4',
      'aac': 'audio/aac',
      'ogg': 'audio/ogg',
    };
    return mimeTypes[ext || ''] || 'application/octet-stream';
  };
  
  // Serve user-uploaded custom music files
  app.get("/api/media/user_music/:userId/:filename", async (req, res) => {
    try {
      const { userId, filename } = req.params;
      const client = new Client();
      const fileKey = `user_music/${userId}/${filename}`;
      
      const contentType = getContentType(filename);
      
      res.set({
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000',
        'Accept-Ranges': 'bytes',
      });
      
      const stream = client.downloadAsStream(fileKey);
      
      stream.on('error', (error) => {
        console.error("Stream error for user music", fileKey, ":", error);
        if (!res.headersSent) {
          res.status(404).json({ error: "File not found" });
        }
      });
      
      stream.pipe(res);
      
    } catch (error) {
      console.error("Error serving user music file:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Failed to serve music file" });
      }
    }
  });
  
  // Handle generated files in subdirectory (e.g., Ind/generated/video_final.mp4)
  app.get("/api/media/Ind/generated/:filename", async (req, res) => {
    try {
      const { filename } = req.params;
      const client = new Client();
      const fileKey = `Ind/generated/${filename}`;
      
      const contentType = getContentType(filename);
      
      res.set({
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000',
        'Accept-Ranges': 'bytes',
      });
      
      const stream = client.downloadAsStream(fileKey);
      
      stream.on('error', (error) => {
        console.error("Stream error for generated file", fileKey, ":", error);
        if (!res.headersSent) {
          res.status(404).json({ error: "File not found" });
        }
      });
      
      stream.pipe(res);
      
    } catch (error) {
      console.error("Error serving generated file:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Failed to serve generated file" });
      }
    }
  });
  
  // Handle preview images in subdirectory (e.g., Ind/preview/ed_p1.png)
  app.get("/api/media/Ind/preview/:filename", async (req, res) => {
    try {
      const { filename } = req.params;
      const client = new Client();
      const fileKey = `Ind/preview/${filename}`;
      
      const contentType = getContentType(filename);
      
      res.set({
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000',
        'Accept-Ranges': 'bytes',
      });
      
      const stream = client.downloadAsStream(fileKey);
      
      stream.on('error', (error) => {
        console.error("Stream error for preview file", fileKey, ":", error);
        if (!res.headersSent) {
          res.status(404).json({ error: "File not found" });
        }
      });
      
      stream.pipe(res);
      
    } catch (error) {
      console.error("Error serving preview file:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Failed to serve preview file" });
      }
    }
  });
  
  // Handle media files in subdirectories (e.g., Ind/music/filename.mp3)
  app.get("/api/media/Ind/music/:filename", async (req, res) => {
    try {
      const { filename } = req.params;
      const client = new Client();
      const fileKey = `Ind/music/${filename}`;
      
      const contentType = getContentType(filename);
      
      res.set({
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000',
        'Accept-Ranges': 'bytes',
      });
      
      const stream = client.downloadAsStream(fileKey);
      
      stream.on('error', (error) => {
        console.error("Stream error for", fileKey, ":", error);
        if (!res.headersSent) {
          res.status(404).json({ error: "File not found" });
        }
      });
      
      stream.pipe(res);
      
    } catch (error) {
      console.error("Error serving music file:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Failed to serve music file" });
      }
    }
  });
  
  app.get("/api/media/Ind/:filename", async (req, res) => {
    try {
      const { filename } = req.params;
      
      // Create Object Storage client (uses default bucket)
      const client = new Client();
      const fileKey = `Ind/${filename}`;
      
      const contentType = getContentType(filename);
      
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

  // ==================== SITEMAP ====================
  app.get("/sitemap.xml", async (req, res) => {
    try {
      const baseUrl = "https://weddinginvite.ai";
      const today = new Date().toISOString().split('T')[0];
      
      // Static pages with priority and change frequency
      const staticPages = [
        { url: "/", priority: "1.0", changefreq: "weekly" },
        { url: "/templates", priority: "0.9", changefreq: "daily" },
        { url: "/templates/wedding", priority: "0.9", changefreq: "daily" },
        { url: "/templates/birthday", priority: "0.9", changefreq: "daily" },
        { url: "/how-it-works", priority: "0.8", changefreq: "monthly" },
        { url: "/pricing", priority: "0.8", changefreq: "monthly" },
        { url: "/contact", priority: "0.7", changefreq: "monthly" },
        { url: "/blog", priority: "0.8", changefreq: "weekly" },
        { url: "/about", priority: "0.7", changefreq: "monthly" },
        { url: "/culture", priority: "0.8", changefreq: "monthly" },
        // Regional landing pages
        { url: "/india", priority: "0.9", changefreq: "weekly" },
        { url: "/uae", priority: "0.9", changefreq: "weekly" },
        { url: "/saudi-arabia", priority: "0.9", changefreq: "weekly" },
        // Category landing pages
        { url: "/wedding-invitation-video", priority: "0.9", changefreq: "weekly" },
        { url: "/birthday-invitation-video", priority: "0.9", changefreq: "weekly" },
        { url: "/wedding-invitation-card", priority: "0.9", changefreq: "weekly" },
        { url: "/birthday-invitation-card", priority: "0.9", changefreq: "weekly" },
        // Regional + Category pages
        { url: "/india/wedding-invitation-video", priority: "0.85", changefreq: "weekly" },
        { url: "/india/birthday-invitation-video", priority: "0.85", changefreq: "weekly" },
        { url: "/india/wedding-invitation-card", priority: "0.85", changefreq: "weekly" },
        { url: "/india/birthday-invitation-card", priority: "0.85", changefreq: "weekly" },
        { url: "/uae/wedding-invitation-video", priority: "0.85", changefreq: "weekly" },
        { url: "/uae/birthday-invitation-video", priority: "0.85", changefreq: "weekly" },
        { url: "/uae/wedding-invitation-card", priority: "0.85", changefreq: "weekly" },
        { url: "/uae/birthday-invitation-card", priority: "0.85", changefreq: "weekly" },
        { url: "/saudi-arabia/wedding-invitation-video", priority: "0.85", changefreq: "weekly" },
        { url: "/saudi-arabia/birthday-invitation-video", priority: "0.85", changefreq: "weekly" },
        { url: "/saudi-arabia/wedding-invitation-card", priority: "0.85", changefreq: "weekly" },
        { url: "/saudi-arabia/birthday-invitation-card", priority: "0.85", changefreq: "weekly" },
      ];
      
      // Culture pages
      const culturePages = [
        "indian-wedding-video-invitation",
        "punjabi", "tamil", "telugu", "gujarati", "bengali",
        "muslim-nikah", "christian",
        "arabic-wedding-video-uae-saudi",
        "nigerian-traditional-wedding-video",
        "quinceanera-video-invitation",
        "chinese-tea-ceremony-video",
        "korean-pyebaek-video",
        "filipino-debut-video",
        "jewish-bar-bat-mitzvah-video-invitation"
      ].map(slug => ({ url: `/culture/${slug}`, priority: "0.75", changefreq: "monthly" }));
      
      // Fetch templates
      const templates = await storage.getTemplates();
      const templatePages = templates.map(t => ({
        url: `/template/${t.slug}`,
        priority: "0.7",
        changefreq: "weekly"
      }));
      
      // Hardcoded article slugs (matching frontend)
      const articleSlugs = [
        "wedding-video-invitation-trends-2024",
        "traditional-indian-wedding-planning-guide",
        "create-cinematic-wedding-videos-budget",
        "arabic-wedding-traditions-complete-guide",
        "ai-revolutionizing-wedding-invitations",
        "nigerian-wedding-customs-guide"
      ];
      const articlePages = articleSlugs.map(slug => ({
        url: `/blog/${slug}`,
        priority: "0.6",
        changefreq: "monthly"
      }));
      
      // Combine all pages
      const allPages = [...staticPages, ...culturePages, ...templatePages, ...articlePages];
      
      // Generate XML
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
      
      res.set('Content-Type', 'application/xml');
      res.send(xml);
    } catch (error) {
      console.error("Error generating sitemap:", error);
      res.status(500).send("Error generating sitemap");
    }
  });

  // robots.txt
  app.get("/robots.txt", (req, res) => {
    const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://weddinginvite.ai/sitemap.xml

# Block admin and API routes
Disallow: /api/
Disallow: /admin/
Disallow: /auth/
Disallow: /my-templates
Disallow: /project/
Disallow: /editor/
`;
    res.set('Content-Type', 'text/plain');
    res.send(robotsTxt);
  });

  const httpServer = createServer(app);

  return httpServer;
}
