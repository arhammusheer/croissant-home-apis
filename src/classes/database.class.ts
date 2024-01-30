import { PrismaClient } from "@prisma/client";

interface DBProfile {
  theme: "light" | "dark";
  notifications: boolean;
}

export default class DBProvider {
  private prisma = new PrismaClient();

  async getProfile(user_id: string): Promise<DBProfile> {
    const profile = await this.prisma.profile.findUnique({
      where: {
        id: user_id,
      },
    });

    if (profile) {
      return profile;
    }

    // Default profile
    return {
      theme: "light",
      notifications: true,
    };
  }

  async setProfile(user_id: string, profile: DBProfile): Promise<void> {
    await this.prisma.profile.upsert({
      where: {
        id: user_id,
      },
      update: profile,
      create: {
        id: user_id,
        ...profile,
      },
    });
  }
}
