import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "username must be atleast 2 characters long")
  .max(12, "username no more than 12 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters");

export const passwordValidation = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .max(20, "Passoword no more than 20 characters");

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid email address" }),
  password: passwordValidation
});
