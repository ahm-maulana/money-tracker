import z from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(100),
    email: z.email(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Password confirmation is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Password don't match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
