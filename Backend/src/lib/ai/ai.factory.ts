import { AIProvider, ProviderConfig } from "./ai.schema.js";
import { GeminiProvider } from "./providers/gemini.provider.js";
import { OpenAIProvider } from "./providers/openai.provider.js";

export function AIFactory(config: ProviderConfig, provider: 'gemini' | 'openai' | 'local'): AIProvider {
    switch (provider) {
        case 'gemini':
            return new GeminiProvider(config);
        case 'openai':
            return new OpenAIProvider(config);
    }
    throw new Error(`Not Yet Supported Provider :${provider}`)
}
