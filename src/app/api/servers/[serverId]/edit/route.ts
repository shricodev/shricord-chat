import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { editServerValidator } from "@/lib/validators/edit-server";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { serverId: string } },
) {
  try {
    const profile = await currentProfile();
    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const serverId = params.serverId;
    const body = await req.json();

    const { imageUrl, serverName } = editServerValidator.parse(body);

    // Filter the data to remove null values as both of them are optional fields.
    const data = Object.fromEntries(
      Object.entries({
        imageUrl,
        name: serverName,
      }).filter(([_, value]) => value !== null),
    );

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data,
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[EDIT_SERVER_PATCH]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
