import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(fullName: string): string {
  const words = fullName.trim().split(/\s+/)
  const firstInitial = words[0]?.[0] ?? ""
  const lastInitial = words.length > 1 ? words[words.length - 1][0] : ""
  return (firstInitial + lastInitial).toUpperCase()
}
