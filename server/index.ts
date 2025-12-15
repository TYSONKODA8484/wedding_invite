// server/index.ts
import dotenv from "dotenv";
dotenv.config();

import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { storage } from "./storage";

const app = express();

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    limit: "15mb", // Allow up to 15MB files (base64 encoded adds ~33%)
    verify: (req, _res, buf) => {
      (req as any).rawBody = buf;
    },
  })
);
app.use(express.urlencoded({ extended: false, limit: "15mb" }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    // @ts-ignore
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // setup vite only in development and after setting up routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  const port = parseInt(process.env.PORT || "5000", 10);
  const host = "0.0.0.0";

  // Build listen options conditionally (avoid reusePort on Windows)
  const listenOptions: any = { port, host };
  if (process.platform !== "win32") {
    // reusePort is POSIX-only (Linux, macOS). Avoid on Windows.
    listenOptions.reusePort = true;
  }

  // Start server
  server.listen(listenOptions, () => {
    log(`serving on port ${port}`);

    // Start scheduled cleanup job for old unpaid templates
    const CLEANUP_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 hours
    const DAYS_TO_KEEP = 30;

    const runCleanup = async () => {
      try {
        const deletedCount = await storage.deleteOldUnpaidProjects(DAYS_TO_KEEP);
        if (deletedCount > 0) {
          log(`[Cleanup] Deleted ${deletedCount} unpaid projects older than ${DAYS_TO_KEEP} days`);
        }
      } catch (error) {
        console.error("[Cleanup] Error during scheduled cleanup:", error);
      }
    };

    // Run cleanup once on startup (after a short delay)
    setTimeout(runCleanup, 5000);

    // Then run every 24 hours
    setInterval(runCleanup, CLEANUP_INTERVAL_MS);

    log(`[Cleanup] Scheduled job: delete unpaid projects older than ${DAYS_TO_KEEP} days (runs daily)`);
  });
})();
