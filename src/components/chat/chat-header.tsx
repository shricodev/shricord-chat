import { Hash } from "lucide-react";
import { MobileToggle } from "@/components/mobile-toggle";

type ChatHeaderProps = {
  serverId: string;
  name: string;
  type: "channel" | "conversation";
  imageUrl?: string;
};

export const ChatHeader = ({
  serverId,
  name,
  imageUrl,
  type,
}: ChatHeaderProps) => {
  return (
    <div className="text-md flex h-12 items-center border-b-2 border-neutral-200 px-3 font-semibold dark:border-neutral-800">
      <MobileToggle serverId={serverId} />
      {type === "channel" ? (
        <Hash className="mr-2 h-5 w-5 text-zinc-500 dark:text-zinc-400" />
      ) : null}
      <p className="text-md font-semibold text-black dark:text-white">{name}</p>
    </div>
  );
};
