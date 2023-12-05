import { redirect } from "next/navigation";
import { redirectToSignIn } from "@clerk/nextjs";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";

type ServerIdPageProps = {
  params: {
    serverId: string;
  };
};

const ServerIDPage = async ({ params }: ServerIdPageProps) => {
  const profile = await currentProfile();
  if (!profile) return redirectToSignIn();

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      channels: {
        where: {
          name: "general",
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
  if (!server) return redirect("/");

  const generalChannel = server?.channels[0];
  if (!generalChannel) return null;

  return redirect(`/servers/${params.serverId}/channels/${generalChannel?.id}`);
};

export default ServerIDPage;
