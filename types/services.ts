import { ApiResponse, ChatMessageJson } from "@/types/chatTypes";

export interface IChatService {
  chat(props: {
    apiResponse: ApiResponse;
    userMessage: string;
    retries?: number;
    chatHistory: ChatMessageJson[];
    onStream?: (chunk: string) => void;
  }): Promise<string>;
}

export interface INormalizeService {
  normalize(props: {
    texto: string;
    retries?: number;
    configOption: number;
  }): Promise<string>;
}
