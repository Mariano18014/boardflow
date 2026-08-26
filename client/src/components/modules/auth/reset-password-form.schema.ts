import { z } from "zod";
import { resetPasswordSchema } from "@shared/schemas/password-reset-token.schema";

export const resetPasswordFormSchema = resetPasswordSchema
  .extend({
    confirmPassword: z.string().min(1, "Confirmá tu nueva contraseña."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormInput = z.infer<typeof resetPasswordFormSchema>;
