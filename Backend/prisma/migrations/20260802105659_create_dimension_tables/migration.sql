/*
  Warnings:

  - You are about to drop the column `embedding` on the `DocumentChunk` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DocumentChunk" DROP COLUMN "embedding";

-- CreateTable
CREATE TABLE "Embedding768" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "chatbotId" TEXT NOT NULL,
    "documentChunkId" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "embedding" vector(768) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Embedding768_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Embedding1536" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "chatbotId" TEXT NOT NULL,
    "documentChunkId" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "embedding" vector(1536) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Embedding1536_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Embedding768_tenantId_idx" ON "Embedding768"("tenantId");

-- CreateIndex
CREATE INDEX "Embedding768_chatbotId_idx" ON "Embedding768"("chatbotId");

-- CreateIndex
CREATE INDEX "Embedding768_documentChunkId_idx" ON "Embedding768"("documentChunkId");

-- CreateIndex
CREATE INDEX "Embedding1536_tenantId_idx" ON "Embedding1536"("tenantId");

-- CreateIndex
CREATE INDEX "Embedding1536_chatbotId_idx" ON "Embedding1536"("chatbotId");

-- CreateIndex
CREATE INDEX "Embedding1536_documentChunkId_idx" ON "Embedding1536"("documentChunkId");

-- CreateIndex
CREATE INDEX "DocumentChunk_chatbotId_idx" ON "DocumentChunk"("chatbotId");

-- AddForeignKey
ALTER TABLE "Embedding768" ADD CONSTRAINT "Embedding768_documentChunkId_fkey" FOREIGN KEY ("documentChunkId") REFERENCES "DocumentChunk"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Embedding1536" ADD CONSTRAINT "Embedding1536_documentChunkId_fkey" FOREIGN KEY ("documentChunkId") REFERENCES "DocumentChunk"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create HNSW Indexes
CREATE INDEX IF NOT EXISTS "Embedding768_embedding_hnsw_idx" ON "Embedding768" USING hnsw (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS "Embedding1536_embedding_hnsw_idx" ON "Embedding1536" USING hnsw (embedding vector_cosine_ops);

