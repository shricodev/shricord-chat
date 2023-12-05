import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { createEditChannelValidator } from "@/lib/validators/create-edit-channel";
import { ZodError } from "zod";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { channelId: string } },
) {
  try {
    const profile = await currentProfile();
    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.nextUrl);
    const serverId = searchParams.get("serverId");

    if (!params.channelId || !serverId)
      return new NextResponse("Bad Request", { status: 400 });

    const channelToDelete = await db.channel.findUnique({
      where: {
        id: params.channelId,
      },
    });

    await db.server.update({
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
          delete: {
            id: params.channelId,
            name: {
              not: "general",
              // No channels with name "general" can be deleted.
              mode: "insensitive",
            },
          },
        },
      },
    });

    return NextResponse.json(channelToDelete);
  } catch (error) {
    console.log("[CHANNEL_ID_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { channelId: string } },
) {
  try {
    const profile = await currentProfile();
    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.nextUrl);
    const serverId = searchParams.get("serverId");

    if (!serverId || !params.channelId)
      return new NextResponse("Bad Request", { status: 400 });

    const body = await req.json();
    const { channelName, channelType } = createEditChannelValidator.parse(body);

    const channelToEdit = await db.channel.findUnique({
      where: {
        id: params.channelId,
      },
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
          update: {
            where: {
              id: params.channelId,
            },
            data: {
              name: channelName,
              type: channelType,
            },
          },
        },
      },
    });
    return NextResponse.json(channelToEdit);
  } catch (error) {
    console.log("[CHANNEL_ID_EDIT]", error);
    if (error instanceof ZodError) {
      return new NextResponse(
        "Bad Request. There was a problem with your request.",
        { status: 422 },
      );
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
