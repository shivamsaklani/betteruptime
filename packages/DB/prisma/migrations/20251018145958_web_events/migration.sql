/*
  Warnings:

  - You are about to drop the column `duration` on the `WebEvents` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."WebEvents" DROP COLUMN "duration",
ADD COLUMN     "resolvedTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
