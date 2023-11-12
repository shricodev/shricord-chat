import { z } from "zod";

export const createServerValidator = z.object({
  serverName: z
    .string()
    .min(1, {
      message: "Server name must be at least 1 character long",
    })
    .max(30, {
      message: "Server name must be less than 30 characters long",
    }),
  imageUrl: z.string().url().min(1, {
    message: "Server image is required",
  }),
});

export type TCreateServerValidator = z.infer<typeof createServerValidator>;
