import { RerankProvider } from "../../modules/retrieval/rerank.schema.js";
import { CohereProvider } from "./providers/cohere.provider.js";

export function createRerankProvider(provider: "cohere", apiKey?: string, model?: string | null): RerankProvider {
    switch (provider) {
        case "cohere":
            return new CohereProvider(apiKey, model);
        default:
            throw new Error(`Unsupported rerank provider: ${provider}`);
    }
}
