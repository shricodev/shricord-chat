"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

type ActionTooltipProps = {
  children: React.ReactNode;
  label: string;
  side?: "left" | "top" | "right" | "bottom";
  align?: "start" | "center" | "end";
} & HTMLAttributes<HTMLDivElement>;

export const ActionTooltip = ({
  label,
  children,
  className,
  align,
  side,
}: ActionTooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={50}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} align={align}>
          <p className={cn("text-sm font-semibold capitalize", className)}>
            {label.toLowerCase()}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
