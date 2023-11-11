import { ZodError } from "zod";
import { v4 as uuidv4 } from "uuid";
import { ChannelType, Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { createServerValidator } from "@/lib/validators/create-server";

export async function POST(req: NextRequest) {
  try {
    const profile = await currentProfile();
    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const { imageUrl, serverName } = createServerValidator.parse(body);

    const server = await db.server.create({
      data: {
        profileId: profile.id,
        name: serverName,
        imageUrl,
        inviteCode: uuidv4(),
        channels: {
          create: [
            {
              name: "general",
              profileId: profile.id,
              type: ChannelType.TEXT,
            },
          ],
        },
        members: {
          create: [
            {
              profileId: profile.id,
              role: Role.ADMIN,
            },
          ],
        },
      },
    });
    return NextResponse.json(server);
  } catch (error) {
    console.error("[SERVERS_POST]", error);
    if (error instanceof ZodError) {
      return new NextResponse(
        "Bad Request. There was a problem with your request.",
        { status: 422 }
      );
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
