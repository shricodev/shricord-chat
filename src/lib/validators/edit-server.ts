import { z } from "zod";

export const editServerValidator = z.object({
  serverName: z
    .string()
    .min(1, {
      message: "Server name must be at least 1 character long",
    })
    .max(30, {
      message: "Server name must be less than 30 characters long",
    })
    .nullable(),
  imageUrl: z
    .string()
    .url()
    .min(1, {
      message: "Server image is required",
    })
    .nullable(),
});

export type TEditServerValidator = z.infer<typeof editServerValidator>;
