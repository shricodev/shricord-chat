"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/Command";
import { CommandGroup } from "cmdk";
import { useParams, useRouter } from "next/navigation";

type ServerSearchProps = {
  data: {
    label: string;
    type: "channel" | "member";
    data:
      | {
          icon: React.ReactNode;
          name: string;
          id: string;
        }[]
      | undefined;
  }[];
};

export const ServerSearch = ({ data }: ServerSearchProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const keyDown = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", keyDown);
    return () => document.removeEventListener("keydown", keyDown);
  }, []);

  const onClick = ({
    id,
    type,
  }: {
    id: string;
    type: "channel" | "member";
  }) => {
    setIsOpen(false);
    if (type === "member")
      return router.push(`/servers/${params?.serverId}/conversations/${id}`);

    if (type === "channel")
      return router.push(`/servers/${params?.serverId}/channels/${id}`);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="group flex w-full items-center gap-x-2 rounded-xl bg-zinc-300/40 px-2 py-2 transition hover:bg-zinc-700/10 dark:bg-transparent dark:hover:bg-zinc-700/50"
      >
        <Search className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
        <p className="text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300">
          Search Server...
        </p>
        <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">CTRL+K</span>
        </kbd>
      </button>
      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <CommandInput placeholder="Search channels and members..." />
        <CommandList>
          <CommandEmpty>No results found for your search. 👻</CommandEmpty>
          {data.map(({ label, type, data }) => {
            if (!data?.length) return null;
            return (
              <CommandGroup key={label} heading={label} className="my-2">
                {data?.map(({ id, icon, name }) => {
                  return (
                    <CommandItem
                      key={id}
                      onSelect={() => onClick({ id, type })}
                    >
                      {icon}
                      <span>{name}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
};
