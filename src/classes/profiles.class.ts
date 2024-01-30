import AuthProvider from "./auth.class";
import DBProvider from "./database.class";

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
}
