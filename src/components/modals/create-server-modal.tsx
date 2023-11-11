"use client";

import { useEffect, useState } from "react";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import FileUpload from "@/components/file-upload";
import {
  FormField,
  FormControl,
  Form,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/Form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/Dialog";
import axios from "axios";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  serverName: z
    .string()
    .min(1, {
      message: "Server name must be at least 1 character long",
    })
    .max(30, {
      message: "Server name must be less than 30 characters long",
    }),
  imageUrl: z.string().url().min(1, {
    message: "Server image is required",
  }),
});

const CreateServerModal = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serverName: "",
      imageUrl: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data } = await axios.post("/api/servers", values);
      form.reset();
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Dialog open>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-center text-2xl font-bold">
            Create your first server!
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Give your new server a name, description and an icon. You can always
            change it later!
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="serverImage"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="serverName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Server Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-100 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Server name..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button disabled={isLoading} variant="primary">
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateServerModal;
