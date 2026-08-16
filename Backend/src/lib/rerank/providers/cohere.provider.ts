import { CohereClient } from "cohere-ai";
import { RerankProvider, RerankQuery, RerankResult } from "../../../modules/retrieval/rerank.schema.js";

export class CohereProvider implements RerankProvider {
    name = "cohere";
    private client: CohereClient;
    private model: string;

    constructor(apiKey?: string, model?: string | null) {
        if (!apiKey) {
            throw new Error("Cohere API key bulunamadı.");
        }
        this.client = new CohereClient({
            token: apiKey,
        });
        this.model = model || 'rerank-v4.0-fast';
    }

    async rerank(query: RerankQuery): Promise<RerankResult[]> {
        if (!query.chunks || query.chunks.length === 0) {
            return [];
        }

        const documents = query.chunks.map((chunk) => ({ text: chunk.content }));

        const response = await this.client.rerank({
            model: this.model,
            query: query.query,
            documents: documents,
        });

        return response.results.map((result) => {
            const originalChunk = query.chunks[result.index];
            return {
                chunkId: originalChunk.chunkId,
                content: originalChunk.content,
                score: result.relevanceScore,
            };
        });
    }
}