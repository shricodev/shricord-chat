import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { createEditServerValidator } from "@/lib/validators/create-edit-server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { serverId: string } },
) {
  try {
    const profile = await currentProfile();
    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const serverId = params.serverId;
    const body = await req.json();

    const { imageUrl, serverName } = createEditServerValidator.parse(body);

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        imageUrl,
        name: serverName,
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[EDIT_SERVER_PATCH]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
