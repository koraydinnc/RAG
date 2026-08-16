import { Type, Static } from "@sinclair/typebox";

export const RerankChunkSchema = Type.Object({
    chunkId: Type.String(),
    content: Type.String()
});

export const RerankQuerySchema = Type.Object({
    chunks: Type.Array(RerankChunkSchema),
    query: Type.String()
});

export const RerankResultSchema = Type.Object({
    chunkId: Type.String(),
    content: Type.String(),
    score: Type.Number()
});

export type RerankChunk = Static<typeof RerankChunkSchema>;
export type RerankQuery = Static<typeof RerankQuerySchema>;
export type RerankResult = Static<typeof RerankResultSchema>;

export interface RerankProvider {
    name: string;
    rerank(query: RerankQuery): Promise<RerankResult[]>;
}
