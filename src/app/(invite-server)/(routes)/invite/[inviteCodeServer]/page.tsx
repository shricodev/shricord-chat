import Error from "next/error";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { redirectToSignIn } from "@clerk/nextjs";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";

type InviteCodeServerProps = {
  params: {
    inviteCodeServer: string;
  };
};

const InviteCodeServer = async ({
  params: { inviteCodeServer },
}: InviteCodeServerProps) => {
  const profile = await currentProfile();
  if (!profile) return redirectToSignIn();
  if (!inviteCodeServer) return redirect("/");

  const isAlreadyMemberServer = await db.server.findFirst({
    where: {
      inviteCode: inviteCodeServer,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (isAlreadyMemberServer)
    return redirect(`/servers/${isAlreadyMemberServer.id}`);

  const server = await db.server.update({
    where: {
      inviteCode: inviteCodeServer,
    },
    data: {
      members: {
        create: [
          {
            profileId: profile.id,
            role: Role.GUEST,
          },
        ],
      },
    },
  });

  if (server) return redirect(`/servers/${server.id}`);

  return null;
};

export default InviteCodeServer;
