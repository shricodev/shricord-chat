"use client";

import { Fragment, useRef, ElementRef } from "react";

import { format } from "date-fns";
import { Member } from "@prisma/client";
import { Loader2, ServerCrash } from "lucide-react";

import { MESSAGE_DATE_FORMAT } from "@/config";

import { useChatQuery } from "@/hooks/use-chat-query";

import { TMessageWithMemberWithProfile } from "@/types/message-member-profile";

import { ChatItem } from "@/components/chat/chat-item";
import { ChatWelcome } from "@/components/chat/chat-welcome";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { useChatScroll } from "@/hooks/use-chat-scroll";

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

  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;

  const chatRef = useRef<ElementRef<"div">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);

  useChatSocket({
    queryKey,
    addKey,
    updateKey,
  });
  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages?.[0]?.items?.length ?? 0,
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
    <div ref={chatRef} className="flex flex-1 flex-col overflow-y-auto py-4">
      {!hasNextPage ? <div className="flex-1" /> : null}
      {!hasNextPage ? <ChatWelcome type={type} name={name} /> : null}
      {hasNextPage ? (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="my-4 h-6 w-6 animate-spin text-zinc-500" />
          ) : (
            <button
              onClick={() => fetchNextPage()}
              className="my-4 rounded-md bg-zinc-100 p-2 text-xs text-zinc-500 transition hover:text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
            >
              Load Previos messages
            </button>
          )}
        </div>
      ) : null}
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
      <div ref={bottomRef} />
    </div>
  );
};
