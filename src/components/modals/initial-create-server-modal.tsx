"use client";

import { useEffect, useState } from "react";

import axios from "axios";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  TCreateEditServerValidator,
  createEditServerValidator,
} from "@/lib/validators/create-edit-server";

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

export const InitialCreateServerModal = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(createEditServerValidator),
    defaultValues: {
      serverName: "",
      imageUrl: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: TCreateEditServerValidator) => {
    try {
      await axios.post("/api/servers", values);
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
      <DialogContent
        hideClose
        className="overflow-hidden bg-white p-0 text-black"
      >
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">
            Create your first server!
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Give your new server a name, and an icon. You can always change it
            later!
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="serverName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase text-zinc-500 dark:text-secondary/70">
                      Server Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="border-0 bg-zinc-100 text-black focus-visible:ring-0 focus-visible:ring-offset-0"
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
