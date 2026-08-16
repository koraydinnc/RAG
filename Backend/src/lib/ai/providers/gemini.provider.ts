import { GoogleGenAI } from '@google/genai'
import { BaseAIProvider } from '../ai.base-provider.js'
import { getSecretValue } from '../../../plugins/secret-manager.plugin.js'

export class GeminiProvider extends BaseAIProvider {
    name = 'gemini' as const
    private client: GoogleGenAI | null = null

    private async getClient(): Promise<GoogleGenAI> {
        if (!this.client) {
            const apiKey = await getSecretValue(this.config.apiKeySecretRef)
            this.client = new GoogleGenAI({ apiKey })
        }
        return this.client
    }

    protected async callEmbeddingAPI(text: string): Promise<number[]> {
        const client = await this.getClient()
        const response = await client.models.embedContent({
            model: this.config.embeddingModel,
            contents: [text],
            config: { outputDimensionality: this.config.outputDim },
        })
        return response.embeddings?.[0]?.values ?? []
    }

    protected async callTextAPI(prompt: string): Promise<string> {
        const client = await this.getClient()
        const response = await client.models.generateContent({
            model: this.config.textModel,
            contents: prompt,
            config: {
                systemInstruction: `Sen ${this.config.chatBotName} adında bir yapay zeka asistanısın.`
            }
        })
        return response.text ?? ''
    }
}