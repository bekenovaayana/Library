import { z } from "zod";
import { ru } from "@/shared/i18n";

const v = ru.validation;

export const bookFormSchema = z.object({
  title: z.string().min(1, v.titleRequired).max(200, v.titleMax200),
  author: z.string().min(1, v.authorRequired).max(100, v.authorMax100),
  category: z.string().min(1, v.categoryRequired).max(50, v.categoryMax50),
  coverUrl: z.string().url().optional().or(z.literal("")),
});

export type BookFormValues = z.infer<typeof bookFormSchema>;

export const bookFormDefaultValues: BookFormValues = {
  title: "",
  author: "",
  category: "",
  coverUrl: "",
};
