import AuthProvider from "./auth.class";
import DBProvider, { DBProfile } from "./database.class";

export default class ProfileProvider {
  private authProvider: AuthProvider;
  private dbProvider: DBProvider;

  constructor(accessToken: string) {
    this.authProvider = new AuthProvider(accessToken);
    this.dbProvider = new DBProvider();
  }

  async getProfile() {
    const authProfile = await this.authProvider.getProfile();
    const dbProfile = await this.dbProvider.getProfile(
      authProfile.id?.toString() || ""
    );

    const profile = {
      ...authProfile,
      ...dbProfile,
    };

    return profile;
  }

  async setProfile(profile: DBProfile) {
    const authProfile = await this.authProvider.getProfile();

    if (!authProfile.id) {
      throw new Error("Missing user ID");
    }

    await this.dbProvider.setProfile(authProfile.id.toString(), profile);
  }
}
