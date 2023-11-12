import { redirect } from "next/navigation";
import { UserButton as UserManagementButton } from "@clerk/nextjs";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";

import { Separator } from "@/components/ui/Separator";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { ThemeToggle } from "@/components/theme-toggle";
import NavAction from "@/components/navigation/nav-action";
import { NavItem } from "@/components/navigation/nav-item";
import { dark } from "@clerk/themes";

const NavSidebar = async () => {
  const profile = await currentProfile();
  if (!profile) return redirect("/");

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  return (
    <div className="flex h-full w-full flex-col items-center space-y-4 py-3 text-primary dark:bg-[#1e1f22]">
      <NavAction />
      <Separator className="mx-auto h-[2px] w-10 rounded-md bg-zinc-300 dark:bg-zinc-700" />
      <ScrollArea className="w-full flex-1">
        {servers.map((server) => (
          <div key={server.id} className="mb-4">
            <NavItem
              serverName={server.name}
              imageUrl={server.imageUrl}
              id={server.id}
            />
          </div>
        ))}
      </ScrollArea>
      <Separator className="mx-auto h-[2px] w-10 rounded-md bg-zinc-300 dark:bg-zinc-700" />
      <div className="mt-auto flex flex-col items-center gap-y-4 pb-3">
        <ThemeToggle />
        <UserManagementButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "h-[40px] w-[40px]",
            },
          }}
        />
      </div>
    </div>
  );
};

export default NavSidebar;
