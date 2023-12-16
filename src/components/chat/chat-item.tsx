"use client";

import { useEffect, useState } from "react";

import axios from "axios";
import qs from "query-string";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { Edit, File, Trash } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Member, Profile, Role } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";

import { roleIconMapRight } from "@/constants";

import { useModal } from "@/hooks/use-modal-store";

import { cn } from "@/lib/utils";
import { ChatInputValidator, TChatInput } from "@/lib/validators/chat-input";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { UserAvatar } from "@/components/user-avatar";
import { ActionTooltip } from "@/components/action-tooltip";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/Form";

type ChatItemProps = {
  id: string;
  member: Member & {
    profile: Profile;
  };
  content: string;
  fileUrl: string | null;
  timestamp: string;
  deleted: boolean;
  isUpdated: boolean;
  currentMember: Member;
  socketUrl: string;
  socketQuery: Record<string, string>;
};

export const ChatItem = ({
  id,
  member,
  content,
  fileUrl,
  timestamp,
  deleted,
  isUpdated,
  currentMember,
  socketQuery,
  socketUrl,
}: ChatItemProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const fileType = fileUrl?.split(".").pop();

  const { onOpen } = useModal();
  const router = useRouter();
  const params = useParams();

  const isAdmin = currentMember.role === Role.ADMIN;
  const isModerator = currentMember.role === Role.MODERATOR;
  const isOwner = currentMember.id === member.id;
  const canDeleteMessage = !deleted && (isAdmin || isOwner || isModerator);
  const canEditMessage = !deleted && isOwner && !fileUrl;
  const isPDF = fileType === "pdf" && fileUrl;
  const isImage = !isPDF && fileUrl;

  const form = useForm<TChatInput>({
    resolver: zodResolver(ChatInputValidator),
    defaultValues: {
      content,
    },
  });

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    form.reset({
      content,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsEditing(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const onMemberClick = () => {
    if (member.id === currentMember.id) return;
    router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
  };

  const onSubmit = async (values: TChatInput) => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      });

      await axios.patch(url, values);
      form.reset();
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="group relative flex w-full items-center p-4 transition hover:bg-black/5">
      <div className="group flex w-full items-start gap-x-2">
        <div
          onClick={onMemberClick}
          className="cursor-pointer transition hover:drop-shadow-md"
        >
          <UserAvatar source={member.profile.imageUrl} />
        </div>
        <div className="flex w-full flex-col">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p
                onClick={onMemberClick}
                className="cursor-pointer text-sm font-semibold hover:underline"
              >
                {member.profile.name}
              </p>
              <ActionTooltip label={member.role}>
                {roleIconMapRight[member.role]}
              </ActionTooltip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {timestamp}
            </span>
          </div>
          {isImage ? (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative mt-2 flex aspect-square h-48 w-48 items-center overflow-hidden rounded-md border bg-secondary"
            >
              <Image
                src={fileUrl}
                alt={content}
                fill
                className="object-cover"
              />
            </a>
          ) : null}
          {isPDF ? (
            <div className="relative mt-2 flex items-center rounded-md border bg-background/10 p-2">
              <File className="h-10 w-10 shrink-0 fill-indigo-200 stroke-indigo-400" />
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 overflow-hidden text-ellipsis text-sm text-indigo-500 hover:underline dark:text-indigo-400"
              >
                PDF file
              </a>
            </div>
          ) : null}
          {!fileUrl && !isEditing ? (
            <p
              className={cn(
                "text-sm text-zinc-600 dark:text-zinc-300",
                deleted &&
                  "mt-1 text-xs italic text-zinc-500 dark:text-zinc-400",
              )}
            >
              {content}
              {isUpdated && !deleted ? (
                <span className="mx-2 text-[10px] text-zinc-500 dark:text-zinc-400">
                  (edited)
                </span>
              ) : null}
            </p>
          ) : null}
          {!fileUrl && isEditing ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex w-full items-center gap-x-2 pt-2"
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            placeholder="Edited Message..."
                            disabled={isLoading}
                            {...field}
                            className="border-0 border-none bg-zinc-200/90 p-2 text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-700/75 dark:text-zinc-200"
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button size="sm" variant="primary" disabled={isLoading}>
                  Save
                </Button>
              </form>
              <span className="mt-1 text-[12px] text-zinc-400">
                Press Esc to cancel, Enter to save
              </span>
            </Form>
          ) : null}
        </div>
      </div>
      {canDeleteMessage ? (
        <div className="absolute -top-2 right-5 hidden items-center gap-x-2 rounded-sm border bg-white p-1 group-hover:flex dark:bg-zinc-800">
          {canEditMessage ? (
            <ActionTooltip label="Edit">
              <Edit
                onClick={() => setIsEditing(true)}
                className="ml-auto h-4 w-4 cursor-pointer text-zinc-500 transition hover:text-zinc-600 dark:hover:text-zinc-300"
              />
            </ActionTooltip>
          ) : null}
          <ActionTooltip label="Delete">
            <Trash
              onClick={() =>
                onOpen("deleteMessage", {
                  apiUrl: `${socketUrl}/${id}`,
                  query: socketQuery,
                })
              }
              className="ml-auto h-4 w-4 cursor-pointer text-zinc-500 transition hover:text-zinc-600 dark:hover:text-zinc-300"
            />
          </ActionTooltip>
        </div>
      ) : null}
    </div>
  );
};
