import { UserButton as UserManagementButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center">
      This is a protected route.
      <UserManagementButton afterSignOutUrl="/sign-in" />
    </main>
  );
}
