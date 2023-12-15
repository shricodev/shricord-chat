"use client";

import { useState } from "react";

import axios from "axios";
import qs from "query-string";
import { Role } from "@prisma/client";
import { useRouter } from "next/navigation";
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

import { roleIconMapRight } from "@/constants";

import { useModal } from "@/hooks/use-modal-store";

import { TServerWithMembersWithProfile } from "@/types/server-members-profile";

import { UserAvatar } from "@/components/user-avatar";
import { ScrollArea } from "@/components/ui/ScrollArea";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/Dialog";
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

export const ManageMembersModal = () => {
  const [loadingId, setLoadingId] = useState<string>("");
  const { type, isOpen, onClose, onOpen, data } = useModal();

  const router = useRouter();

  const isModalOpen = isOpen && type === "members";

  const { server } = data as {
    server: TServerWithMembersWithProfile;
  };

  const onRoleChange = async (memberId: string, role: Role) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server.id,
        },
      });
      const { data } = await axios.patch(url, { role });
      router.refresh();
      onOpen("members", { server: data });
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingId("");
    }
  };

  const onKick = async (memberId: string) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server.id,
        },
      });
      const { data } = await axios.delete(url);
      router.refresh();
      onOpen("members", { server: data });
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingId("");
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden bg-white text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {server?.members?.length > 1
              ? `${server?.members?.length} members on ${server?.name}`
              : `${server?.members?.length} member on ${server?.name}`}
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
                  {roleIconMapRight[member.role]}
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
                          <DropdownMenuSubContent className="ml-2">
                            <DropdownMenuItem
                              onClick={() => onRoleChange(member.id, "GUEST")}
                            >
                              <Shield className="mr-2 h-4 w-4" />
                              Guest
                              {member.role === "GUEST" ? (
                                <Check className="ml-auto h-4 w-4" />
                              ) : null}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                onRoleChange(member.id, "MODERATOR")
                              }
                            >
                              <ShieldCheck className="mr-2 h-4 w-4" />
                              Mod
                              {member.role === "MODERATOR" ? (
                                <Check className="ml-auto h-4 w-4" />
                              ) : null}
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onKick(member.id)}
                        className="font-semibold text-rose-500"
                      >
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
