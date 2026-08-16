import { Type, Static } from "@sinclair/typebox";

export const EmbeddingProviderSchema = Type.Union([
    Type.Literal("gemini"),
    Type.Literal("openai"),
    Type.Literal("local")
]);

export const EmbeddingDimensionsSchema = Type.Union([
    Type.Literal(768),
    Type.Literal(1536)
]);

export const EmbeddingResultSchema = Type.Object({
    embedding: Type.Array(Type.Number()),
    dimensions: EmbeddingDimensionsSchema,
    model: Type.String(),
    provider: EmbeddingProviderSchema
});

export const ProviderConfigSchema = Type.Object({
    apiKeySecretRef: Type.String(),
    embeddingModel: Type.String(),
    textModel: Type.String(),
    outputDim: EmbeddingDimensionsSchema,
    chatBotName: Type.String()
});

export type EmbeddingProvider = Static<typeof EmbeddingProviderSchema>;
export type EmbeddingDimensions = Static<typeof EmbeddingDimensionsSchema>;
export type EmbeddingResult = Static<typeof EmbeddingResultSchema>;
export type ProviderConfig = Static<typeof ProviderConfigSchema>;

export interface AIProvider {
    name: EmbeddingProvider;
    generateEmbedding(text: string): Promise<EmbeddingResult>;
    generateText?(prompt: string): Promise<string>;
}
