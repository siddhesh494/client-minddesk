export type BusinessStatus = "indexing" | "active" | "failed";

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export interface TokenResponse {
  access_token: string;
  token_type: "bearer" | string;
}

export interface Business {
  uuid: string;
  name: string;
  editor_content?: string | Record<string, unknown>;
  plain_text?: string;
  system_prompt?: string;
  active_version: number;
  active_namespace?: string;
  chunk_count: number;
  status: BusinessStatus;
  created_at: string;
  updated_at: string;
}

export interface IndexResponse {
  success: boolean;
  uuid: string;
  version: number;
  chunk_count: number;
  namespace?: string;
  status?: BusinessStatus;
  message: string;
}

export interface ChatResponse {
  success: boolean;
  uuid: string;
  thread_id: string;
  answer: string;
}

export interface PublicBusiness {
  success: boolean;
  uuid: string;
  name: string;
  status: BusinessStatus;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}
