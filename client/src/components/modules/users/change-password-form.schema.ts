import { z } from "zod";
import { changePasswordSchema } from "@shared/schemas/user.schema";

// Same shared schema used by the request body (see change-password.api.ts),
// minus `refreshToken` (not user input — the form never touches it) plus a
// client-only confirmation field.
export const changePasswordFormSchema = changePasswordSchema
  .omit({ refreshToken: true })
  .extend({
    confirmNewPassword: z.string().min(1, "Confirmá tu nueva contraseña."),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmNewPassword"],
  });

export type ChangePasswordFormInput = z.infer<typeof changePasswordFormSchema>;
