"use client";

import { CreateServerModal } from "@/components/modals/create-server-modal";
import { useEffect, useState } from "react";
import { ServerInviteModal } from "@/components/modals/server-invite-modal";
import { ServerSettingsModal } from "@/components/modals/server-settings-modal";
import { ManageMembersModal } from "@/components/modals/manage-members-modal";
import { CreateChannelModal } from "@/components/modals/create-channel-modal";

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
    </>
  );
};