"use client";

import { Plus, Settings } from "lucide-react";
import { ChannelType, Role } from "@prisma/client";

import { useModal } from "@/hooks/use-modal-store";

import { TServerWithMembersWithProfile } from "@/types/server-members-profile";

import { ActionTooltip } from "@/components/action-tooltip";

type ServerSectionProps = {
  role?: Role;
  label: string;
  channelType?: ChannelType;
  sectionType: "channels" | "members";
  server?: TServerWithMembersWithProfile;
};

export const ServerSection = ({
  label,
  role,
  channelType,
  sectionType,
  server,
}: ServerSectionProps) => {
  const { onOpen } = useModal();
  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      {role !== Role.GUEST && sectionType === "channels" ? (
        <ActionTooltip label="Create Channel" side="top">
          <button
            onClick={() => onOpen("createChannel", { channelType })}
            className="text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
          >
            <Plus className="h-4 w-4" />
          </button>
        </ActionTooltip>
      ) : null}

      {role === Role.ADMIN && sectionType === "members" ? (
        <ActionTooltip label="Manage Members" side="top">
          <button
            onClick={() => onOpen("members", { server })}
            className="text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
          >
            <Settings className="h-4 w-4" />
          </button>
        </ActionTooltip>
      ) : null}
    </div>
  );
};
