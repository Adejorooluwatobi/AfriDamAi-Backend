-- CreateEnum
CREATE TYPE "ChatMessageType" AS ENUM ('TEXT', 'IMAGE', 'VIDEO', 'AUDIO', 'SYSTEM');

-- AlterTable
ALTER TABLE "ChatMessage" ADD COLUMN     "attachmentUrl" TEXT,
ADD COLUMN     "fileSize" INTEGER,
ADD COLUMN     "mimeType" TEXT,
ADD COLUMN     "type" "ChatMessageType" NOT NULL DEFAULT 'TEXT',
ALTER COLUMN "message" DROP NOT NULL;
