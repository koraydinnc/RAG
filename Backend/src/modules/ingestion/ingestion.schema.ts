import { Type, Static } from "@sinclair/typebox";

export const IngestionTypeSchema = Type.Union([
    Type.Literal("upload"),
    Type.Literal("webhook")
]);



export const IngestionJobDataSchema = Type.Object({
    tenantId: Type.String({ format: 'uuid' }),
    chatbotId: Type.String({ format: 'uuid' }),
    type: IngestionTypeSchema,
    chunkIds: Type.Array(Type.String({ format: 'uuid' }), { minItems: 1 })
});

export type IngestionType = Static<typeof IngestionTypeSchema>;
export type IngestionJobData = Static<typeof IngestionJobDataSchema>;
