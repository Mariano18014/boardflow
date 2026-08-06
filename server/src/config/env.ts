import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(5007),
  DATABASE_URL: z.string().min(1, "DATABASE_URL must be set"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET must be set"),
  JWT_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("30d"),
  APP_URL: z.string().default("http://localhost:5007"),
  MAIL_HOST: z.string().optional(),
  MAIL_PORT: z.coerce.number().default(587),
  MAIL_USERNAME: z.string().optional(),
  MAIL_PASSWORD: z.string().optional(),
  MAIL_FROM_NAME: z.string().default("BoardFlow"),
  MAIL_FROM_ADDRESS: z.string().default("no-reply@boardflow.local"),
});

export const env = envSchema.parse(process.env);
