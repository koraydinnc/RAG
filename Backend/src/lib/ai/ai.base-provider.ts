import { AIProvider, EmbeddingResult, ProviderConfig } from "./ai.schema.js"

export abstract class BaseAIProvider implements AIProvider {
    abstract name: 'gemini' | 'openai' | 'local'
    protected config: ProviderConfig

    constructor(config: ProviderConfig) {
        this.config = config
    }

    protected abstract callEmbeddingAPI(text: string): Promise<number[]>
    protected abstract callTextAPI(prompt: string): Promise<string>

    async generateEmbedding(text: string): Promise<EmbeddingResult> {
        const embedding = await this.callEmbeddingAPI(text)

        if (!embedding || embedding.length === 0) {
            throw new Error(
                `${this.name} embedding üretemedi: boş yanıt döndü (model: ${this.config.embeddingModel})`
            )
        }

        return {
            embedding,
            dimensions: this.config.outputDim,
            model: this.config.embeddingModel,
            provider: this.name,
        }
    }

    async generateText(prompt: string): Promise<string> {
        return this.callTextAPI(prompt)
    }
}
