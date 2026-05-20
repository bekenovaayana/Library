import { z } from "zod";

export const bookFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must not exceed 200 characters"),
  author: z
    .string()
    .min(1, "Author is required")
    .max(100, "Author must not exceed 100 characters"),
  category: z
    .string()
    .min(1, "Category is required")
    .max(50, "Category must not exceed 50 characters"),
});

export type BookFormValues = z.infer<typeof bookFormSchema>;

export const bookFormDefaultValues: BookFormValues = {
  title: "",
  author: "",
  category: "",
};
