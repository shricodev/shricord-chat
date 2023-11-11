import { z } from "zod";

export const createServerValidator = z.object({
  serverName: z.string().min(1).max(30),
  imageUrl: z.string().url(),
});

export type TCreateServerValidator = z.infer<typeof createServerValidator>;
