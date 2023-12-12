"use client";

import axios from "axios";
import { useForm } from "react-hook-form";
import { Plus, Smile } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import qs from "query-string";

import { ChatInputValidator, TChatInput } from "@/lib/validators/chat-input";

import { Input } from "@/components/ui/Input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/Form";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";

type ChatInputProps = {
  apiUrl: string;
  query: Record<string, any>;
  name: string;
  chatType: "channel" | "conversation";
};

const ChatInput = ({ apiUrl, query, name, chatType }: ChatInputProps) => {
  const { onOpen } = useModal();
  const form = useForm<TChatInput>({
    defaultValues: {
      content: "",
    },
    resolver: zodResolver(ChatInputValidator),
  });

  const router = useRouter();
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: TChatInput) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      });
      await axios.post(url, values);
      form.reset();
      router.refresh();
    } catch (error) {
      console.log("the error is caused here...");
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6">
                  <button
                    type="button"
                    onClick={() => onOpen("messageFile", { apiUrl, query })}
                    className="absolute left-8 top-7 flex h-[24px] w-[24px] items-center justify-center rounded-full bg-zinc-500 p-1 transition hover:bg-zinc-600 dark:bg-zinc-400 dark:hover:bg-zinc-300"
                  >
                    <Plus className="text-white dark:text-[#313338]" />
                  </button>
                  <Input
                    disabled={isLoading}
                    placeholder={`Message ${
                      chatType === "conversation" ? name : "channel " + name
                    }`}
                    {...field}
                    className="border-0 border-none bg-zinc-200/70 px-14 py-6 text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-700/75 dark:text-zinc-200"
                  />
                  <div className="absolute right-8 top-7">
                    <Smile className="cursor-pointer" />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default ChatInput;
