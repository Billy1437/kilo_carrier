import type { Direction } from "@prisma/client";

export const DIRECTIONS: { value: Direction; label: string; short: string }[] = [
  { value: "YGN_TO_BKK", label: "Yangon → Bangkok", short: "YGN → BKK" },
  { value: "BKK_TO_YGN", label: "Bangkok → Yangon", short: "BKK → YGN" },
];

export function directionLabel(d: Direction): string {
  return DIRECTIONS.find((x) => x.value === d)?.label ?? d;
}

export function directionShort(d: Direction): string {
  return DIRECTIONS.find((x) => x.value === d)?.short ?? d;
}

/** Travel date -> expiry at end of that day (local-ish UTC end-of-day). */
export function expiryFromTravelDate(travelDate: Date): Date {
  const d = new Date(travelDate);
  d.setUTCHours(23, 59, 59, 999);
  return d;
}

export function formatDate(d: Date): string {
  return new Date(d).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Build contact deep links. Returns null when the field is empty. */
export function telegramLink(handle?: string | null): string | null {
  if (!handle) return null;
  return `https://t.me/${handle.trim().replace(/^@/, "")}`;
}

export function whatsappLink(num?: string | null): string | null {
  if (!num) return null;
  const digits = num.replace(/[^\d]/g, "");
  return digits ? `https://wa.me/${digits}` : null;
}

export function viberLink(num?: string | null): string | null {
  if (!num) return null;
  const digits = num.replace(/[^\d]/g, "");
  return digits ? `viber://chat?number=${digits}` : null;
}

export function facebookLink(url?: string | null): string | null {
  if (!url) return null;
  const v = url.trim();
  if (!v) return null;
  return v.startsWith("http") ? v : `https://${v}`;
}
