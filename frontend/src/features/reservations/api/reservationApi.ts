import { apiClient } from "@/services/api";

export interface Reservation {
  id: number;
  bookId: number;
  bookTitle: string;
  coverUrl?: string | null;
  queuePosition: number;
  createdAt: string;
}

export const reservationApi = {
  getMyReservations: async (): Promise<Reservation[]> => {
    const { data } = await apiClient.get<Reservation[]>("/reservations/my");
    return data;
  },

  reserve: async (bookId: number): Promise<Reservation> => {
    const { data } = await apiClient.post<Reservation>(`/reservations/${bookId}`);
    return data;
  },

  cancel: async (bookId: number): Promise<void> => {
    await apiClient.delete(`/reservations/${bookId}`);
  },
};
