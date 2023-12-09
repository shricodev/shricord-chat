import { Menu } from "lucide-react";

import { Button } from "@/components/ui/Button";
import NavSidebar from "@/components/navigation/nav-sidebar";
import { ServerSidebar } from "@/components/server/server-sidebar";
import { SheetContent, Sheet, SheetTrigger } from "@/components/ui/Sheet";

export const MobileToggle = ({ serverId }: { serverId: string }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" hideClose className="flex gap-0 p-0">
        <div className="w-[72px]">
          <NavSidebar />
        </div>
        <ServerSidebar serverId={serverId} />
      </SheetContent>
    </Sheet>
  );
};
