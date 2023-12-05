"use client";

import { cn } from "@/lib/utils";
import { Channel, ChannelType, Role, Server } from "@prisma/client";
import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ActionTooltip } from "@/components/action-tooltip";
import { useModal } from "@/hooks/use-modal-store";

type ServerChannelProps = {
  channel: Channel;
  role?: Role;
  server: Server;
};

const IconMap = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.VIDEO]: Video,
};

export const ServerChannel = ({
  channel,
  server,
  role,
}: ServerChannelProps) => {
  const router = useRouter();
  const params = useParams();

  const { onOpen } = useModal();

  const Icon = IconMap[channel.type];
  return (
    <button
      onClick={() => {}}
      className={cn(
        "group mb-1 line-clamp-1 flex w-full items-center gap-x-2 rounded-md p-[0.4rem] font-semibold transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50",
        params?.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700",
      )}
    >
      <Icon className="h-5 w-5 flex-shrink-0 text-zinc-500 dark:text-zinc-400" />
      <p
        className={cn(
          "line-clamp-1 text-xs font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300",
          params?.channelId === channel.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white",
        )}
      >
        {channel.name}
      </p>
      {channel.name.toLowerCase() !== "general" && role !== Role.GUEST ? (
        <div className="ml-auto flex items-center gap-x-2">
          <ActionTooltip label="Edit">
            <Edit
              onClick={() => onOpen("editChannel", { server, channel })}
              className="hidden h-4 w-4 text-zinc-500 transition hover:text-zinc-600 group-hover:block dark:text-zinc-400 dark:hover:text-zinc-300"
            />
          </ActionTooltip>
          <ActionTooltip label="Delete">
            <Trash
              onClick={() => onOpen("deleteChannel", { server, channel })}
              className="hidden h-4 w-4 text-zinc-500 transition hover:text-zinc-600 group-hover:block dark:text-zinc-400 dark:hover:text-zinc-300"
            />
          </ActionTooltip>
        </div>
      ) : null}
      {channel.name.toLowerCase() === "general" ? (
        <Lock className="ml-auto hidden h-4 w-4 cursor-not-allowed text-zinc-500 transition hover:text-zinc-600 group-hover:block dark:text-zinc-400 dark:hover:text-zinc-300" />
      ) : null}
    </button>
  );
};
