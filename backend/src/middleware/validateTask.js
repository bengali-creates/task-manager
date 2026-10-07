import { z } from "zod";

const taskCreateSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be at most 100 characters")
    .trim(),
  description: z
    .string({ required_error: "Description is required" })
    .min(5, "Description must be at least 5 characters")
    .trim(),
  status: z.enum(["pending", "in_progress", "completed"]).optional().default("pending"),
  priority: z.enum(["low", "medium", "high"]).optional().default("medium"),
  dueDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Invalid due date format",
    }),
});

const taskUpdateSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be at most 100 characters")
    .trim()
    .optional(),
  description: z
    .string()
    .min(5, "Description must be at least 5 characters")
    .trim()
    .optional(),
  status: z.enum(["pending", "in_progress", "completed"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  dueDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Invalid due date format",
    }),
});

export const validateCreateTask = (req, res, next) => {
  const result = taskCreateSchema.safeParse(req.body);
  if (!result.success) {
    const formattedErrors = result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: formattedErrors,
    });
  }
  req.validatedBody = result.data;
  next();
};

export const validateUpdateTask = (req, res, next) => {
  const result = taskUpdateSchema.safeParse(req.body);
  if (!result.success) {
    const formattedErrors = result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: formattedErrors,
    });
  }
  req.validatedBody = result.data;
  next();
};
