"use client";

import { useEffect, useState } from "react";

import { MessageFileModal } from "@/components/modals/attachment/message-file-modal";

import { LeaveServerModal } from "@/components/modals/server/leave-server-modal";
import { EditChannelModal } from "@/components/modals/channel/edit-channel-modal";
import { CreateServerModal } from "@/components/modals/server/create-server-modal";
import { ServerInviteModal } from "@/components/modals/server/server-invite-modal";
import { DeleteServerModal } from "@/components/modals/server/delete-server-modal";
import { ManageMembersModal } from "@/components/modals/member/manage-members-modal";
import { CreateChannelModal } from "@/components/modals/channel/create-channel-modal";
import { DeleteChannelModal } from "@/components/modals/channel/delete-channel-modal";
import { ServerSettingsModal } from "@/components/modals/server/server-settings-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <CreateServerModal />
      <ServerSettingsModal />
      <CreateChannelModal />
      <ServerInviteModal />
      <ManageMembersModal />
      <LeaveServerModal />
      <DeleteServerModal />
      <DeleteChannelModal />
      <EditChannelModal />
      <MessageFileModal />
    </>
  );
};
