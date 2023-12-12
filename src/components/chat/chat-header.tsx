import { ChannelType } from "@prisma/client";
import { Hash, Mic, Video } from "lucide-react";

import { UserAvatar } from "@/components/user-avatar";
import { MobileToggle } from "@/components/mobile-toggle";
import { SocketIndicator } from "@/components/socket-indicator";

type ChatHeaderProps = {
  serverId: string;
  name: string;
  type: "channel" | "conversation";
  channelType?: ChannelType;
  imageUrl?: string;
};

export const ChatHeader = ({
  serverId,
  name,
  imageUrl,
  type,
  channelType,
}: ChatHeaderProps) => {
  return (
    <div className="text-md flex h-12 items-center border-b-2 border-neutral-200 px-3 font-semibold dark:border-neutral-800">
      <MobileToggle serverId={serverId} />
      {type === "channel" && channelType === "TEXT" ? (
        <Hash className="mr-2 h-5 w-5 text-zinc-500 dark:text-zinc-400" />
      ) : type === "channel" && channelType === "AUDIO" ? (
        <Mic className="mr-2 h-5 w-5 text-zinc-500 dark:text-zinc-400" />
      ) : type === "channel" && channelType === "VIDEO" ? (
        <Video className="mr-2 h-5 w-5 text-zinc-500 dark:text-zinc-400" />
      ) : (
        type === "conversation" &&
        imageUrl && (
          <UserAvatar
            classname="mr-2 h-8 w-8 md:h-8 md:w-8"
            source={imageUrl}
          />
        )
      )}
      <p className="text-md font-semibold text-black dark:text-white">{name}</p>
      <div className="ml-auto flex items-center">
        <SocketIndicator />
      </div>
    </div>
  );
};
