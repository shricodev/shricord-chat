import { ChannelType } from "@prisma/client";
import { z } from "zod";

export const createChannelValidator = z.object({
  channelName: z
    .string()
    .min(1, {
      message: "Channel name must be at least 1 character long",
    })
    .max(50, {
      message: "Channel name must be less than 50 characters long",
    })
    .refine((name) => name !== "general", {
      message: "Channel name cannot be 'general'",
    }),
  channelType: z.nativeEnum(ChannelType),
});

export type TCreateChannelValidator = z.infer<typeof createChannelValidator>;
