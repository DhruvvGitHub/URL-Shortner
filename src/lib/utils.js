import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Utility function to generate short URLs
export function getShortUrl(shortCode) {
  return `${window.location.origin}/${shortCode}`;
}
