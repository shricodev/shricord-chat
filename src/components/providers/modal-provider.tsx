"use client";

import { CreateServerModal } from "@/components/modals/create-server-modal";
import { useEffect, useState } from "react";
import { ServerInviteModal } from "@/components/modals/server-invite-modal";
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
      <ServerInviteModal />
      <ServerSettingsModal />
    </>
  );
};
