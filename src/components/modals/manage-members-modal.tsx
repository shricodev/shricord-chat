"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/Dialog";
import { useModal } from "@/hooks/use-modal-store";
import { ServerWithMembersWithProfile } from "@/types/server-members-profile";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { UserAvatar } from "@/components/user-avatar";
import {
  Check,
  Loader2,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
  UserX2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/DropdownMenu";
import { useState } from "react";

const roleIconMap = {
  GUEST: <Shield className="ml-2 h-4 w-4 text-zinc-500" />,
  MODERATOR: <ShieldCheck className="ml-2 h-4 w-4 text-indigo-500" />,
  ADMIN: <ShieldAlert className="ml-2 h-4 w-4 text-rose-500" />,
};

export const ManageMembersModal = () => {
  const [loadingId, setLoadingId] = useState<string>("");
  const { type, isOpen, onClose, onOpen, data } = useModal();

  const isModalOpen = isOpen && type === "members";

  const { server } = data as {
    server: ServerWithMembersWithProfile;
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden bg-white text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {server?.members?.length} members on {server?.name}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {server?.members?.map((member) => (
            <div
              key={member.id}
              className="mb-6 flex items-center gap-x-2 rounded-xl bg-zinc-100 p-4"
            >
              <UserAvatar source={member.profile.imageUrl} />
              <div className="flex flex-col gap-y-1">
                <div className="flex items-center text-xs font-semibold">
                  {member.profile.name}
                  {roleIconMap[member.role]}
                </div>
                <p className="text-xs text-zinc-500">{member.profile.email}</p>
              </div>
              {server.profileId !== member.profileId ? (
                <div className="ml-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      {loadingId === member.id ? (
                        <Loader2 className="ml-auto h-4 w-4 animate-spin text-zinc-500" />
                      ) : (
                        <MoreVertical className="h-4 w-4 text-zinc-500" />
                      )}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="left">
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="flex items-center">
                          <ShieldQuestion className="mr-2 h-4 w-4" />
                          <span>Change Role</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent className="ml-1">
                            <DropdownMenuItem>
                              <Shield className="mr-2 h-4 w-4" />
                              Guest
                              {member.role === "GUEST" ? (
                                <Check className="ml-auto h-4 w-4" />
                              ) : null}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <ShieldCheck className="mr-2 h-4 w-4" />
                              Moderator
                              {member.role === "MODERATOR" ? (
                                <Check className="ml-auto h-4 w-4" />
                              ) : null}
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="font-semibold text-rose-500">
                        <UserX2 className="mr-2 h-4 w-4" />
                        Kick
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : null}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
