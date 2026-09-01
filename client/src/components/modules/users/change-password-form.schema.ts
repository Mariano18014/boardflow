import { z } from "zod";
import { changePasswordSchema } from "@shared/schemas/user.schema";

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
