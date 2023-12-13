import { Role } from "@prisma/client";
import { Shield, ShieldAlert, ShieldCheck } from "lucide-react";

export const roleIconMapLeft = {
  [Role.GUEST]: <Shield className="mr-2 h-4 w-4 text-zinc-500" />,
  [Role.MODERATOR]: <ShieldCheck className="mr-2 h-4 w-4 text-indigo-500" />,
  [Role.ADMIN]: <ShieldAlert className="mr-2 h-4 w-4 text-rose-500" />,
};

export const roleIconMapRight = {
  [Role.GUEST]: <Shield className="ml-2 h-4 w-4 text-zinc-500" />,
  [Role.MODERATOR]: <ShieldCheck className="ml-2 h-4 w-4 text-indigo-500" />,
  [Role.ADMIN]: <ShieldAlert className="ml-2 h-4 w-4 text-rose-500" />,
};
