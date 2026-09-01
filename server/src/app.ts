import express from "express";
import helmet from "helmet";
import path from "path";
import { router } from "./routes";
import { errorHandlerMiddleware } from "./middlewares/error-handler.middleware";
import { authRateLimiter } from "./middlewares/rate-limit.middleware";

export function createApp() {
  const app = express();
  app.set("trust proxy", 1);

  app.use(
    helmet({
      contentSecurityPolicy: process.env.NODE_ENV === "production" ? undefined : false,
      crossOriginEmbedderPolicy: false,
    }),
  );

  app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

  app.use("/api/auth/login", authRateLimiter);
  app.use("/api/auth/register", authRateLimiter);
  app.use("/api/auth/forgot-password", authRateLimiter);
  app.use("/api/auth/reset-password", authRateLimiter);

  app.use(express.json({ limit: "5mb" }));
  app.use(express.urlencoded({ extended: false, limit: "5mb" }));

  app.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
      if (req.path.startsWith("/api")) {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.path} ${res.statusCode} in ${duration}ms`);
      }
    });
    next();
  });

  app.use("/api", router);

  app.use(errorHandlerMiddleware);

  return app;
}
