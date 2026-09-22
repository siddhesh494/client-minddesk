import { apiClient } from "./client";
import type { ChatResponse } from "../types";

export const chatApi = {
  send: (payload: { uuid: string; user_phone_number: string; user_query: string }) =>
    apiClient.post<ChatResponse>("/api/chat", payload),
};
