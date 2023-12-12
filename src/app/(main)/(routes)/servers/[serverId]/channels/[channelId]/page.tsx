import { redirect } from "next/navigation";
import { redirectToSignIn } from "@clerk/nextjs";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";

import { ChatHeader } from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";

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
      <div className="flex-1">future messages</div>
      <ChatInput
        name={channel.name}
        chatType="channel"
        query={{
          channelId: channel.id,
          serverId: channel.serverId,
        }}
        apiUrl="/api/socket/messages"
      />
    </div>
  );
};

export default ChannelIdPage;
