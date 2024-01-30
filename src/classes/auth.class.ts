import axios from "axios";
import { KINDE_BUSINESS_NAME } from "../utils/constants";

export interface UserProfile {
  id?: string;
  sub?: string;
  provided_id?: string | null;
  name?: string;
  given_name?: string;
  family_name?: string;
  updated_at?: Number;
  email?: string;
  picture?: string;
}

export default class AuthProvider {
  private businessName: string = KINDE_BUSINESS_NAME;
  private accessToken: string;
  private baseUrl: string;

  constructor(accessToken: string) {
    this.baseUrl = `https://${this.businessName}.kinde.com`;
    this.accessToken = accessToken;
  }

  // Getters
  async getProfile(): Promise<UserProfile> {
    // Axios request to get profile
    const url = `${this.baseUrl}/oauth2/user_profile`;
    const headers = {
      Authorization: `Bearer ${this.accessToken}`,
    };

    const data = await axios
      .get(url, { headers })
      .then((res) => res.data)
      .catch((err) => {
        throw new Error("Bad Access Token");
      });

    return data;
  }
}
