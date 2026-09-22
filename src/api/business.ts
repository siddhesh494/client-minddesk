import { apiClient } from "./client";
import type { Business, IndexResponse, PublicBusiness } from "../types";

export const businessApi = {
  list: () => apiClient.get<{ success: boolean; items: Business[] }>("/api/businesses"),
  get: (uuid: string) => apiClient.get<Business>(`/api/businesses/${uuid}`),
  getPublic: (uuid: string) => apiClient.get<PublicBusiness>(`/api/public/businesses/${uuid}`),
  create: (payload: { name: string; text: string; editor_content?: string; system_prompt?: string }) =>
    apiClient.post<IndexResponse>("/api/index", payload),
  update: (payload: {
    uuid: string;
    text: string;
    name?: string;
    editor_content?: string;
    system_prompt?: string;
  }) => apiClient.post<IndexResponse>("/api/index/update", payload),
};
