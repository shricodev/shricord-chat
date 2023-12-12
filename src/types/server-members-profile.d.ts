import { Member, Profile, Server } from "@prisma/client";

export type TServerWithMembersWithProfile = Server & {
  members: (Member & { profile: Profile })[];
};
