import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

export function setFieldErrorsOnForm<T extends FieldValues>(
  fieldErrors: Record<string, string[] | undefined>,
  form: UseFormReturn<T>,
) {
  for (const [field, messages] of Object.entries(fieldErrors)) {
    if (!messages || messages.length === 0) continue;
    form.setError(field as Path<T>, { message: messages[0] });
  }
}
