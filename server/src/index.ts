import { createServer } from "http";
import { env } from "./config/env";
import { createApp } from "./app";

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

const app = createApp();
const httpServer = createServer(app);

(async () => {
  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (env.NODE_ENV === "production") {
    const { serveStatic } = await import("./config/static");
    serveStatic(app);
  } else {
    const { setupVite } = await import("./config/vite");
    await setupVite(httpServer, app);
  }

  httpServer.listen(env.PORT, "0.0.0.0", () => {
    log(`serving on port ${env.PORT}`);
  });
})();
