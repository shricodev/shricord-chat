import { redirect } from "next/navigation";
import { ChannelType, Role } from "@prisma/client";
import {
  Hash,
  Mic,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Video,
} from "lucide-react";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";

import { ScrollArea } from "@/components/ui/ScrollArea";
import { ServerHeader } from "@/components/server/server-header";
import { ServerSearch } from "@/components/server/server-search";

const IconMap = {
  [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
};

const roleIconMap = {
  [Role.GUEST]: <Shield className="mr-2 h-4 w-4 text-zinc-500" />,
  [Role.MODERATOR]: <ShieldCheck className="mr-2 h-4 w-4 text-indigo-500" />,
  [Role.ADMIN]: <ShieldAlert className="mr-2 h-4 w-4 text-rose-500" />,
};

export const ServerSidebar = async ({ serverId }: { serverId: string }) => {
  const profile = await currentProfile();
  if (!profile) return redirect("/");

  const server = await db.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });

  if (!server) return redirect("/");

  const textChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.TEXT,
  );

  const audioChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO,
  );

  const videoChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO,
  );

  const members = server.members.filter(
    (member) => member.profileId !== profile.id,
  );

  const userRole = server.members.find(
    (member) => member.profileId === profile.id,
  )?.role;

  const searchData = [
    {
      label: "Text Channels",
      type: "channel" as const,
      data: textChannels?.map((channel) => ({
        id: channel.id,
        name: channel.name,
        icon: IconMap[channel.type],
      })),
    },
    {
      label: "Audio Channels",
      type: "channel" as const,
      data: audioChannels?.map((channel) => ({
        id: channel.id,
        name: channel.name,
        icon: IconMap[channel.type],
      })),
    },
    {
      label: "Video Channels",
      type: "channel" as const,
      data: videoChannels?.map((channel) => ({
        id: channel.id,
        name: channel.name,
        icon: IconMap[channel.type],
      })),
    },
    {
      label: "Members",
      type: "member" as const,
      data: members?.map((member) => ({
        id: member.profile.id,
        name: member.profile.name,
        icon: roleIconMap[member.role],
      })),
    },
  ];

  return (
    <div className="flex h-full w-full flex-col bg-[#f2f3f5] text-primary dark:bg-[#2b2d31]">
      <ServerHeader server={server} role={userRole} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch data={searchData} />
        </div>
      </ScrollArea>
    </div>
  );
};
