import { ChannelType } from "@prisma/client";
import { z } from "zod";

export const createEditChannelValidator = z.object({
  channelName: z
    .string()
    .min(1, {
      message: "Channel name must be at least 1 character long",
    })
    .max(15, {
      message: "Channel name must be less than 15 characters long",
    })
    .refine((name) => name.toLowerCase() !== "general", {
      message: "This is a reserved channel name. Please choose another.",
    }),
  channelType: z.nativeEnum(ChannelType),
});

export type TCreateEditChannelValidator = z.infer<
  typeof createEditChannelValidator
>;
