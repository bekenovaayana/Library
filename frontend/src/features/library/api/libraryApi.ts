import { apiClient } from "@/services/api";

export interface LibraryPolicy {
  borrowDays: number;
  finePerDay: number;
  maxFine: number;
}

export const libraryApi = {
  getPolicy: async (): Promise<LibraryPolicy> => {
    const { data } = await apiClient.get<LibraryPolicy>("/library/policy", {
      silentError: true,
    });
    return {
      borrowDays: data.borrowDays,
      finePerDay: Number(data.finePerDay),
      maxFine: Number(data.maxFine),
    };
  },
};
