-- AlterEnum
ALTER TYPE "ChatMessageType" ADD VALUE 'MISSED_CALL';

-- AlterTable
ALTER TABLE "ChatMessage" ADD COLUMN     "duration" INTEGER;
