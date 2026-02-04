import { GroqService } from "./services/groqService";
import { OpenAIService } from "./services/openaiService";
import { GeminiService } from "./services/geminiService";
import { INormalizeService } from "@/types/services";

export type NormalizeProvider = "openai" | "gemini" | "groq";

const services: Record<NormalizeProvider, INormalizeService> = {
  openai: new OpenAIService(),
  gemini: new GeminiService(),
  groq: new GroqService(),
};

export async function normalizar(props: {
  provider?: NormalizeProvider;
  texto: string;
  retries?: number;
  configOption: number;
}): Promise<string> {
  const provider =
    props.provider ||
    (process.env.DEFAULT_NORMALIZE_PROVIDER as NormalizeProvider) ||
    "gemini";
  const service = services[provider];

  if (!service) {
    throw new Error(`Normalize provider '${provider}' not found.`);
  }

  return service.normalize(props);
}
