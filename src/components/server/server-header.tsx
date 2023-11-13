"use client";

import { ServerWithMembersWithProfile } from "@/types/server-members-profile";
import { Role } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import {
  ChevronDown,
  LogOut,
  Plus,
  Settings2,
  Trash2,
  UserPlus,
  Users2,
} from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

type ServerHeaderProps = {
  server: ServerWithMembersWithProfile;
  role?: Role;
};

export const ServerHeader = ({ server, role }: ServerHeaderProps) => {
  const isAdmin = role && role === Role.ADMIN;
  const isModerator = isAdmin || role === Role.MODERATOR;

  const { onOpen } = useModal();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="focus-outline-none">
        <button className="text-md flex h-12 w-full items-center border-b-2 border-neutral-200 px-3 font-semibold transition hover:bg-zinc-700/10 dark:border-neutral-800 dark:hover:bg-zinc-700/50">
          {server.name}
          <ChevronDown className="ml-auto h-5 w-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 space-y-[2px] text-xs font-medium text-black dark:text-neutral-400">
        {isModerator ? (
          <DropdownMenuItem
            onClick={() => onOpen("invite", { server })}
            className="pointer px-3 py-2 text-sm text-indigo-600 dark:text-indigo-400"
          >
            Invite People
            <UserPlus className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
        ) : null}
        {isAdmin ? (
          <DropdownMenuItem className="pointer px-3 py-2 text-sm">
            Server Settings
            <Settings2 className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
        ) : null}
        {isAdmin ? (
          <DropdownMenuItem className="pointer px-3 py-2 text-sm">
            Manage Members
            <Users2 className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
        ) : null}
        {isModerator ? (
          <DropdownMenuItem className="pointer px-3 py-2 text-sm">
            Create Channel
            <Plus className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
        ) : null}
        {isModerator ? <DropdownMenuSeparator /> : null}
        {isAdmin ? (
          <DropdownMenuItem className="pointer px-3 py-2 text-sm text-rose-500">
            Delete Server
            <Trash2 className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
        ) : null}
        {!isAdmin ? (
          <DropdownMenuItem className="pointer px-3 py-2 text-sm text-rose-500">
            Leave Server
            <LogOut className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
