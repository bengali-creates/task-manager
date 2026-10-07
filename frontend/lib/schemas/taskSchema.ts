import { z } from "zod";

export const taskFormSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be under 100 characters")
    .trim(),
  description: z
    .string()
    .min(5, "Description must be at least 5 characters")
    .trim(),
  status: z.enum(["pending", "in_progress", "completed"]),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Please enter a valid date",
    }),
});

export type TaskFormData = z.infer<typeof taskFormSchema>;
