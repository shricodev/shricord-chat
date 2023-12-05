"use client";

import { useEffect, useState } from "react";

import { LeaveServerModal } from "@/components/modals/leave-server-modal";
import { EditChannelModal } from "@/components/modals/edit-channel-modal";
import { CreateServerModal } from "@/components/modals/create-server-modal";
import { ServerInviteModal } from "@/components/modals/server-invite-modal";
import { DeleteServerModal } from "@/components/modals/delete-server-modal";
import { ManageMembersModal } from "@/components/modals/manage-members-modal";
import { CreateChannelModal } from "@/components/modals/create-channel-modal";
import { DeleteChannelModal } from "@/components/modals/delete-channel-modal";
import { ServerSettingsModal } from "@/components/modals/server-settings-modal";

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
    </>
  );
};
