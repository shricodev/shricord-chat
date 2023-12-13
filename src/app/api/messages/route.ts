import { Message } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { INFINITE_SCROLLING_MESSAGES_BATCH } from "@/config";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";

export async function GET(req: NextRequest) {
  try {
    const profile = await currentProfile();
    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.nextUrl);

    const cursor = searchParams.get("cursor");
    const channelId = searchParams.get("channelId");

    if (!channelId) return new NextResponse("Bad request", { status: 400 });

    let messages: Message[] = [];
    if (cursor) {
      messages = await db.message.findMany({
        take: INFINITE_SCROLLING_MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      messages = await db.message.findMany({
        take: INFINITE_SCROLLING_MESSAGES_BATCH,
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    let nextCursor = null;
    if (messages.length === INFINITE_SCROLLING_MESSAGES_BATCH) {
      nextCursor = messages[messages.length - 1].id;
    }
    return NextResponse.json({
      items: messages,
      nextCursor,
    });
  } catch (error) {
    console.error("[MESSAGES_GET]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
