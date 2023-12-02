import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { createChannelValidator } from "@/lib/validators/create-channel";

export async function POST(req: NextRequest) {
  try {
    const profile = await currentProfile();
    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.nextUrl);
    const serverId = searchParams.get("serverId");

    if (!serverId) return new NextResponse("Bad Request", { status: 400 });

    const body = await req.json();
    const { channelName, channelType } = createChannelValidator.parse(body);

    if (channelName === "general")
      return new NextResponse("Channel name cannot be 'general'", {
        status: 400,
      });

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [Role.ADMIN, Role.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          create: {
            profileId: profile.id,
            name: channelName,
            type: channelType,
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[CHANNEL_POST_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
