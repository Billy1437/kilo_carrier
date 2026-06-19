import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .max(280)
  .optional()
  .transform((v) => (v ? v : undefined));

export const tripSchema = z.object({
  carrierName: z.string().trim().min(2, "Name is required").max(80),
  direction: z.enum(["YGN_TO_BKK", "BKK_TO_YGN"]),
  travelDate: z
    .string()
    .min(1, "Pick a travel date")
    .refine((v) => {
      const d = new Date(v);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return !Number.isNaN(d.getTime()) && d >= today;
    }, "Travel date must be today or later"),
  availableKg: z.coerce
    .number({ message: "Enter the kilograms" })
    .min(1, "Minimum 1 kg")
    .max(50, "Maximum 50 kg"),
  pricePerKg: z.coerce.number().min(0).max(1_000_000).optional(),
  itemRestrictions: optionalText,
  telegram: z.string().trim().min(2, "Telegram is required").max(64),
  facebook: optionalText,
  viber: optionalText,
  whatsapp: optionalText,
  notes: optionalText,
});

export type TripInput = z.infer<typeof tripSchema>;
