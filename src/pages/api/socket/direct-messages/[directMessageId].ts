import { Role } from "@prisma/client";
import { NextApiRequest } from "next";

import { db } from "@/lib/db";
import { ChatInputValidator } from "@/lib/validators/chat-input";
import { currentProfilePages } from "@/lib/current-profile-pages";

import { TNextApiResponseServerIO } from "@/types/nextapi-response-server-io";

type TRequestQuery = {
  directMessageId: string;
  conversationId: string;
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

    const { directMessageId, conversationId } = req.query as TRequestQuery;

    if (!conversationId)
      return res.status(400).json({
        error: "Bad request",
      });

    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            memberOne: {
              profileId: profile.id,
            },
          },
          {
            memberTwo: {
              profileId: profile.id,
            },
          },
        ],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!conversation)
      return res.status(404).json({ error: "Conversation not found" });

    const member =
      conversation.memberOne.profileId === profile.id
        ? conversation.memberOne
        : conversation.memberTwo;

    if (!member)
      return res.status(401).json({
        error: "Unauthorized",
      });

    let directMessage = await db.directMessage.findFirst({
      where: {
        id: directMessageId,
        conversationId,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!directMessage || directMessage.deleted)
      return res.status(404).json({
        error: "Message not found",
      });

    const isMessageOwner = directMessage.memberId === member.id;
    const isAdmin = member.role === Role.ADMIN;
    const isModerator = member.role === Role.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify)
      return res.status(401).json({
        error: "Unauthorized",
      });

    if (req.method === "DELETE") {
      directMessage = await db.directMessage.update({
        where: {
          id: directMessageId,
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

      const { content } = ChatInputValidator.parse(req.body);

      directMessage = await db.directMessage.update({
        where: {
          id: directMessageId,
        },
        data: {
          content: content,
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

    const updateKey = `chat:${conversation.id}:messages:update`;
    res?.socket?.server?.io?.emit(updateKey, directMessage);

    return res.status(200).json(directMessage);
  } catch (error) {
    console.log("[MESSAGE_ID]", error);
    return res.status(500).json({ error: error });
  }
}
