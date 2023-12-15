import { redirect } from "next/navigation";
import type { Profile, Server } from "@prisma/client";

import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";

import { InitialCreateServerModal } from "@/components/modals/server/initial-create-server-modal";

export default async function SetupPage() {
  const profile: Profile = await initialProfile();
  const server: Server | null = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (server) return redirect(`/servers/${server.id}`);

  return <InitialCreateServerModal />;
}
