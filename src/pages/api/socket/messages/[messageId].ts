import { Role } from "@prisma/client";
import { NextApiRequest } from "next";

import { db } from "@/lib/db";
import { ChatInputValidator } from "@/lib/validators/chat-input";
import { currentProfilePages } from "@/lib/current-profile-pages";

import { TNextApiResponseServerIO } from "@/types/nextapi-response-server-io";

type TRequestQuery = {
  messageId: string;
  serverId: string;
  channelId: string;
};

export default async function handler(
  req: NextApiRequest,
  res: TNextApiResponseServerIO,
) {
  if (req.method !== "DELETE" && req.method !== "PATCH") {
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

    const { messageId, serverId, channelId } = req.query as TRequestQuery;
    const { content } = ChatInputValidator.parse(req.body);

    if (!channelId || !serverId || !messageId)
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
        error: "Server not found",
      });

    const channel = await db.channel.findFirst({
      where: {
        id: channelId,
        serverId,
      },
    });

    if (!channel)
      return res.status(404).json({
        error: "Channel not found",
      });

    const member = server.members.find(
      (member) => member.profileId === profile.id,
    );

    if (!member)
      return res.status(401).json({
        error: "Unauthorized",
      });

    let message = await db.message.findFirst({
      where: {
        id: messageId,
        channelId,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!message || message.deleted)
      return res.status(404).json({
        error: "Message not found",
      });

    const isMessageOwner = message.memberId === member.id;
    const isAdmin = member.role === Role.ADMIN;
    const isModerator = member.role === Role.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify)
      return res.status(401).json({
        error: "Unauthorized",
      });

    if (req.method === "DELETE") {
      message = await db.message.update({
        where: {
          id: messageId,
        },
        data: {
          fileUrl: null,
          content: "This message has been deleted.",
          deleted: true,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    if (req.method === "PATCH") {
      if (!isMessageOwner) {
        return res.status(401).json({
          error: "Unauthorized",
        });
      }

      message = await db.message.update({
        where: {
          id: messageId,
        },
        data: {
          content,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    const updateKey = `chat:${channelId}:messages:update`;
    res?.socket?.server?.io?.emit(updateKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log("[MESSAGE_ID]", error);
    return res.status(500).json({ error: "Internal Error" });
  }
}
