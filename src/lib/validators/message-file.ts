import { z } from "zod";

export const messageFileValidator = z.object({
  fileUrl: z.string().url().min(1, {
    message: "An attachment is required",
  }),
});

export type TMessageFile = z.infer<typeof messageFileValidator>;
