import { GroqService } from "./services/groqService";
import { OpenAIService } from "./services/openaiService";
import { GeminiService } from "./services/geminiService";
import { IChatService } from "@/types/services";
import { ApiResponse, ChatMessageJson } from "@/types/chatTypes";

export type ChatProvider = "openai" | "gemini" | "groq";

const services: Record<ChatProvider, IChatService> = {
  openai: new OpenAIService(),
  gemini: new GeminiService(),
  groq: new GroqService(),
};

export async function chat(props: {
  provider?: ChatProvider;
  apiResponse: ApiResponse;
  userMessage: string;
  retries?: number;
  chatHistory: ChatMessageJson[];
  onStream?: (chunk: string) => void;
}): Promise<string> {
  const provider =
    props.provider ||
    (process.env.DEFAULT_CHAT_PROVIDER as ChatProvider) ||
    "openai";
  const service = services[provider];

  if (!service) {
    throw new Error(`Chat provider '${provider}' not found.`);
  }

  return service.chat(props);
}
