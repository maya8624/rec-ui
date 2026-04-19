import { z } from "zod";

export type AuthUser = {
  userId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
};

export type AuthResponse = AuthUser;

export type ErrorResponse = {
  code: number;
  name: string;
  message: string;
};

export const registerSchema = z
  .object({
    firstName: z.string().max(100, "First name must be 100 characters or fewer").optional(),
    lastName: z.string().max(100, "Last name must be 100 characters or fewer").optional(),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
