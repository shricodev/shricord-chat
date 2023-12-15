"use client";

import { Fragment } from "react";

import { format } from "date-fns";
import { Member } from "@prisma/client";
import { Loader2, ServerCrash } from "lucide-react";

import { MESSAGE_DATE_FORMAT } from "@/config";

import { useChatQuery } from "@/hooks/use-chat-query";

import { TMessageWithMemberWithProfile } from "@/types/message-member-profile";

import { ChatItem } from "@/components/chat/chat-item";
import { ChatWelcome } from "@/components/chat/chat-welcome";

type ChatMessagesProps = {
  name: string;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  member: Member;
  paramValue: string;
  paramKey: "channelId" | "conversationId";
  type: "channel" | "conversation";
};

export const ChatMessages = ({
  name,
  chatId,
  apiUrl,
  socketQuery,
  socketUrl,
  member,
  paramKey,
  paramValue,
  type,
}: ChatMessagesProps) => {
  const queryKey = `chat:${chatId}`;
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      queryKey,
      apiUrl,
      paramKey,
      paramValue,
    });

  if (status === "loading") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <Loader2 className="my-4 h-7 w-7 animate-spin text-zinc-500" />
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Loading messages...
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <ServerCrash className="my-4 h-7 w-7 text-zinc-500" />
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          There was an error loading the messages... 👻
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto py-4">
      <div className="flex-1" />
      <ChatWelcome type={type} name={name} />
      <div className="mt-auto flex flex-col-reverse">
        {data?.pages?.map((group, i) => (
          <Fragment key={i}>
            {group.items.map((message: TMessageWithMemberWithProfile) => (
              <ChatItem
                key={message.id}
                currentMember={member}
                id={message.id}
                content={message.content}
                fileUrl={message.fileUrl}
                deleted={message.deleted}
                member={message.member}
                timestamp={format(
                  new Date(message.createdAt),
                  MESSAGE_DATE_FORMAT,
                )}
                isUpdated={message.updatedAt !== message.createdAt}
                socketUrl={socketUrl}
                socketQuery={socketQuery}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
};
