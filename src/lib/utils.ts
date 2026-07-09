import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} دقیقه`;
  return `${h} ساعت${m > 0 ? ` و ${m} دقیقه` : ""}`;
}

export function getScoreColor(score: number, max = 10): string {
  const pct = (score / max) * 100;
  if (pct >= 75) return "text-cyan-400";
  if (pct >= 50) return "text-cyan-400";
  return "text-red-400";
}

export function getRTColor(score: number): string {
  if (score >= 75) return "text-red-500";
  return "text-cyan-500";
}

export function getMetacriticColor(score: number): string {
  if (score >= 75) return "bg-cyan-600";
  if (score >= 50) return "bg-cyan-500";
  return "bg-red-600";
}

export function formatYear(year: number): string {
  return year.toString();
}

export function persianNumber(n: number): string {
  return n.toLocaleString("fa-IR");
}
