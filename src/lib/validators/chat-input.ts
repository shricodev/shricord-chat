import { z } from "zod";

export const ChatInputValidator = z.object({
  content: z.string().min(1),
});

export type TChatInput = z.infer<typeof ChatInputValidator>;
