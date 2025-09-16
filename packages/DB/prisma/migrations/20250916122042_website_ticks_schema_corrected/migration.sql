-- AlterTable
ALTER TABLE "Region" ADD COLUMN     "user_id" TEXT;

-- AddForeignKey
ALTER TABLE "Region" ADD CONSTRAINT "Region_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
