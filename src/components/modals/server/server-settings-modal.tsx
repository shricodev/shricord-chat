"use client";

import { useEffect } from "react";

import axios from "axios";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { useModal } from "@/hooks/use-modal-store";

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

export const ServerSettingsModal = () => {
  const router = useRouter();
  const { type, isOpen, onClose, data } = useModal();

  const isModalOpen = isOpen && type === "editServer";

  const { server } = data;

  const form = useForm({
    resolver: zodResolver(createEditServerValidator),
    defaultValues: {
      serverName: "",
      imageUrl: "",
    },
  });

  useEffect(() => {
    if (server) {
      form.setValue("serverName", server.name);
      form.setValue("imageUrl", server.imageUrl);
    }
  }, [server, form]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: TCreateEditServerValidator) => {
    try {
      await axios.patch(`/api/servers/${server?.id}/edit`, values);
      form.reset();
      router.refresh();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">
            Edit your server!
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            You can change your server name and icon here!
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
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
