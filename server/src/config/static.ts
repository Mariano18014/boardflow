import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(
    express.static(distPath, {
      setHeaders: (res, filePath) => {
        const normalized = filePath.replace(/\\/g, "/");

        if (
          normalized.endsWith("/index.html") ||
          normalized.endsWith("/service-worker.js") ||
          normalized.endsWith("/service-worker.mjs") ||
          normalized.endsWith("/manifest.webmanifest")
        ) {
          res.setHeader("Cache-Control", "no-store");
          return;
        }

        if (normalized.includes("/assets/")) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
          return;
        }

        res.setHeader("Cache-Control", "no-store");
      },
    }),
  );

  app.use((_req, res) => {
    res.setHeader("Cache-Control", "no-store");
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
