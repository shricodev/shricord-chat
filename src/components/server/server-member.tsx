"use client";

import { cn } from "@/lib/utils";
import { Member, Profile, Role, Server } from "@prisma/client";
import { Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { UserAvatar } from "../user-avatar";

type ServerSearchProps = {
  member: Member & { profile: Profile };
  server: Server;
};

const RoleIconMap = {
  [Role.GUEST]: <Shield className="ml-2 h-4 w-4 text-zinc-500" />,
  [Role.MODERATOR]: <ShieldCheck className="ml-2 h-4 w-4 text-indigo-500" />,
  [Role.ADMIN]: <ShieldAlert className="ml-2 h-4 w-4 text-rose-500" />,
};

export const ServerMember = ({ member, server }: ServerSearchProps) => {
  const params = useParams();
  const router = useRouter();

  const Icon = RoleIconMap[member.role];

  const onClick = () => {
    router.push(`/servers/${server.id}/conversations/${member.id}`);
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "group mb-1 flex w-full items-center gap-x-2 rounded-md px-2 py-2 transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50",
        params?.memberId === member.id && "bg-zinc-700/10 dark:bg-zinc-700",
      )}
    >
      <UserAvatar
        source={member.profile.imageUrl}
        classname="h-8 w-8 md:h-8 md:w-8"
      />
      <p
        className={cn(
          "text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300",
          params?.memberId === member.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white",
        )}
      >
        {member.profile.name}
      </p>
    </button>
  );
};
