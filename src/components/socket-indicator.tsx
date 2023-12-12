"use client";

import { useSocket } from "@/components/providers/socket-provider";
import { Badge } from "@/components/ui/Badge";

export const SocketIndicator = () => {
  const { isConnected } = useSocket();

  if (!isConnected) {
    return (
      <Badge variant="outline" className="border-none bg-yellow-600 text-white">
        Connecting...
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="border-none bg-emerald-600 text-white">
      <span className="sm:hidden">Connected</span>
      <span className="hidden sm:inline">Live: Connected</span>
    </Badge>
  );
};
