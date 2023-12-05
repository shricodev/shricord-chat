import { z } from "zod";

export const createEditServerValidator = z.object({
  serverName: z
    .string()
    .min(1, {
      message: "Server name must be at least 1 character long",
    })
    .max(20, {
      message: "Server name must be less than 20 characters long",
    }),
  imageUrl: z.string().url().min(1, {
    message: "Server image is required",
  }),
});

export type TCreateEditServerValidator = z.infer<
  typeof createEditServerValidator
>;
