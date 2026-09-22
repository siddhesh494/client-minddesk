import { apiClient } from "./client";
import type { TokenResponse } from "../types";

export const authApi = {
  register: (payload: { name: string; email: string; password: string }) =>
    apiClient.post("/api/register", payload),
  login: (payload: { email: string; password: string }) =>
    apiClient.post<TokenResponse>("/api/login", payload),
  verify: () => apiClient.get<{ authenticated: boolean }>("/api/verifyJWTToken"),
};
