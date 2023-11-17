"use client";

import { Avatar, AvatarImage } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";

type UserAvatarProps = {
  classname?: string;
  source?: string;
};

export const UserAvatar = ({ classname, source }: UserAvatarProps) => {
  return (
    <Avatar className={cn("h-7 w-7 md:h-10 md:w-10", classname)}>
      <AvatarImage src={source} />
    </Avatar>
  );
};
