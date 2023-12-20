import { redirect } from "next/navigation";
import { redirectToSignIn } from "@clerk/nextjs";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";

import ChatInput from "@/components/chat/chat-input";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChannelType } from "@prisma/client";
import { MediaRoom } from "@/components/media-room";

type ChannelIdPageProps = {
  params: {
    serverId: string;
    channelId: string;
  };
};

const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
  const profile = await currentProfile();
  if (!profile) return redirectToSignIn();

  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId,
    },
  });

  const member = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
  });

  if (!channel || !member) return redirect("/");

  return (
    <div className="flex h-full flex-col bg-white dark:bg-[#313338]">
      <ChatHeader
        serverId={params.serverId}
        name={channel.name}
        channelType={channel.type}
        type="channel"
      />
      {channel.type === ChannelType.TEXT ? (
        <>
          <ChatMessages
            name={channel.name}
            type="channel"
            member={member}
            socketUrl="/api/socket/messages"
            apiUrl="/api/messages"
            chatId={channel.id}
            socketQuery={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
            paramKey="channelId"
            paramValue={channel.id}
          />
          <ChatInput
            name={channel.name}
            chatType="channel"
            query={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
            apiUrl="/api/socket/messages"
          />
        </>
      ) : null}
      {channel.type === ChannelType.AUDIO ? (
        <MediaRoom chatId={channel.id} video={false} audio={true} />
      ) : null}
      {channel.type === ChannelType.VIDEO ? (
        <MediaRoom chatId={channel.id} video={true} audio={true} />
      ) : null}
    </div>
  );
};

export default ChannelIdPage;
