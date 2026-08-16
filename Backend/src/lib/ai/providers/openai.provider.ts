import OpenAI from 'openai'
import { BaseAIProvider } from '../ai.base-provider.js'
import { getSecretValue } from '../../../plugins/secret-manager.plugin.js'

export class OpenAIProvider extends BaseAIProvider {
    name = 'openai' as const
    private client: OpenAI | null = null

    private async getClient(): Promise<OpenAI> {
        if (!this.client) {
            const apiKey = await getSecretValue(this.config.apiKeySecretRef)
            this.client = new OpenAI({ apiKey })
        }
        return this.client
    }

    protected async callEmbeddingAPI(text: string): Promise<number[]> {
        const client = await this.getClient()
        const response = await client.embeddings.create({
            model: this.config.embeddingModel,
            input: text,
            dimensions: this.config.outputDim,
        })
        return response.data[0]?.embedding ?? []
    }

    protected async callTextAPI(prompt: string): Promise<string> {
        const client = await this.getClient()
        const response = await client.chat.completions.create({
            model: this.config.textModel,
            messages: [
                { role: 'system', content: `Sen ${this.config.chatBotName} adında bir yapay zeka asistanısın.` },
                { role: 'user', content: prompt }
            ],
        })
        return response.choices[0]?.message?.content ?? ''
    }
}