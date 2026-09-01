import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export function formatCommentDate(createdAt: string): string {
  return formatDistanceToNow(new Date(createdAt), { addSuffix: true, locale: es });
}
