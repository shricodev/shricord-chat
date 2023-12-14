import { z } from "zod";
import { NextApiRequest } from "next";

import { db } from "@/lib/db";
import { currentProfilePages } from "@/lib/current-profile-pages";

import { TNextApiResponseServerIO } from "@/types/nextapi-response-server-io";

type TQueryParams = {
  serverId: string;
  channelId: string;
};

export default async function handler(
  req: NextApiRequest,
  res: TNextApiResponseServerIO,
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const profile = await currentProfilePages(req);
    if (!profile)
      return res.status(401).json({
        error: "Unauthorized",
      });

    const { content, fileUrl } = z
      .object({
        content: z.string().min(1),
        fileUrl: z.string().optional(),
      })
      .parse(req.body);

    const { channelId, serverId } = req.query as TQueryParams;

    if (!channelId || !serverId)
      return res.status(400).json({
        error: "Bad request",
      });

    const server = await db.server.findFirst({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    });

    if (!server)
      return res.status(404).json({
        message: "Server not found",
      });

    const channel = await db.channel.findFirst({
      where: {
        id: channelId,
        serverId: serverId,
      },
    });

    if (!channel)
      return res.status(404).json({
        message: "Channel not found",
      });

    const member = server.members.find(
      (member) => member.profileId === profile.id,
    );

    if (!member)
      return res.status(401).json({
        message: "Unauthorized",
      });

    const message = await db.message.create({
      data: {
        content,
        fileUrl,
        channelId,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    const channelKey = `chat:${channelId}:messages`;

    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log("[MESSAGES_POST]", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Bad request",
      });
    }
    return res.status(500).json({
      message: error,
    });
  }
}
