import { redirect } from "next/navigation";
import { ChannelType } from "@prisma/client";
import { Hash, Mic, Video } from "lucide-react";

import { roleIconMapLeft } from "@/constants";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";

import { Separator } from "@/components/ui/Separator";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { ServerHeader } from "@/components/server/server-header";
import { ServerSearch } from "@/components/server/server-search";
import { ServerMember } from "@/components/server/server-member";
import { ServerSection } from "@/components/server/server-section";
import { ServerChannel } from "@/components/server/server-channel";

const iconMap = {
  [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
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
        icon: iconMap[channel.type],
      })),
    },
    {
      label: "Audio Channels",
      type: "channel" as const,
      data: audioChannels?.map((channel) => ({
        id: channel.id,
        name: channel.name,
        icon: iconMap[channel.type],
      })),
    },
    {
      label: "Video Channels",
      type: "channel" as const,
      data: videoChannels?.map((channel) => ({
        id: channel.id,
        name: channel.name,
        icon: iconMap[channel.type],
      })),
    },
    {
      label: "Members",
      type: "member" as const,
      data: members?.map((member) => ({
        id: member.id,
        name: member.profile.name,
        icon: roleIconMapLeft[member.role],
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
        <Separator className="my-2 rounded-md bg-zinc-200 dark:bg-zinc-700" />
        {!!textChannels?.length ? (
          <div className="mb-2">
            <ServerSection
              label="Text Channels"
              sectionType="channels"
              channelType={ChannelType.TEXT}
              role={userRole}
            />
            {textChannels.map((textChannel) => (
              <ServerChannel
                key={textChannel.id}
                server={server}
                channel={textChannel}
                role={userRole}
              />
            ))}
          </div>
        ) : null}
        {!!audioChannels?.length ? (
          <div className="mb-2">
            <ServerSection
              label="Audio Channels"
              sectionType="channels"
              channelType={ChannelType.AUDIO}
              role={userRole}
            />
            {audioChannels.map((audioChannel) => (
              <ServerChannel
                key={audioChannel.id}
                server={server}
                channel={audioChannel}
                role={userRole}
              />
            ))}
          </div>
        ) : null}
        {!!videoChannels?.length ? (
          <div className="mb-2">
            <ServerSection
              label="Video Channels"
              sectionType="channels"
              channelType={ChannelType.VIDEO}
              role={userRole}
            />
            {videoChannels.map((videoChannel) => (
              <ServerChannel
                key={videoChannel.id}
                server={server}
                channel={videoChannel}
                role={userRole}
              />
            ))}
          </div>
        ) : null}
        {!!members?.length ? (
          <div className="mb-2">
            <ServerSection
              label="Members"
              sectionType="members"
              role={userRole}
              server={server}
            />
            {members.map((member) => (
              <ServerMember key={member.id} member={member} server={server} />
            ))}
          </div>
        ) : null}
      </ScrollArea>
    </div>
  );
};
