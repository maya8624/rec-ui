export type UserRole = "buyer" | "seller" | "agent";

export type Message = {
    role: "user" | "assistant";
    content: string;
}

export interface ChatRequest {
    Message: string;
    PropertyId: number | null;
    SessionId: string | null;
}

export interface ChatResponse {
    answer: string;
    sessionId?: string;
}