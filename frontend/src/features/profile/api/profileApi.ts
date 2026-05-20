import { apiClient } from "@/services/api";

export interface UserProfile {
  username: string;
  email: string;
  role: "USER" | "ADMIN";
  activeBorrows: number;
  maxBooksPerUser: number;
}

export interface UpdateProfilePayload {
  username?: string;
  email?: string;
}

export const profileApi = {
  getProfile: async (): Promise<UserProfile> => {
    const { data } = await apiClient.get<UserProfile>("/profile");
    return data;
  },

  updateProfile: async (payload: UpdateProfilePayload): Promise<UserProfile> => {
    const { data } = await apiClient.patch<UserProfile>("/profile", payload);
    return data;
  },
};
