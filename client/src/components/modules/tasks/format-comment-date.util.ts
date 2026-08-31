import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

// "hace 2 horas" style relative timestamp for comments.
export function formatCommentDate(createdAt: string): string {
  return formatDistanceToNow(new Date(createdAt), { addSuffix: true, locale: es });
}
