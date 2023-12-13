import { Member, Message, Profile } from "@prisma/client";

export type TMessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};
