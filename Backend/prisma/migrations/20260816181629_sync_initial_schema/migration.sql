/*
Warnings:

- A unique constraint covering the columns `[documentChunkId]` on the table `Embedding1536` will be added. If there are existing duplicate values, this will fail.
- A unique constraint covering the columns `[documentChunkId]` on the table `Embedding768` will be added. If there are existing duplicate values, this will fail.
- A unique constraint covering the columns `[slug]` on the table `Tenant` will be added. If there are existing duplicate values, this will fail.

*/

DROP INDEX IF EXISTS "Embedding1536_documentChunkId_idx";

DROP INDEX IF EXISTS "Embedding768_documentChunkId_idx";

-- AlterTable
ALTER TABLE "Tenant"
ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "slug" TEXT NOT NULL,
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Embedding1536_documentChunkId_key" ON "Embedding1536" ("documentChunkId");

-- CreateIndex
CREATE UNIQUE INDEX "Embedding768_documentChunkId_key" ON "Embedding768" ("documentChunkId");

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_slug_key" ON "Tenant" ("slug");