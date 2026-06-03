-- AlterTable
ALTER TABLE "students" ADD COLUMN     "enrolled_by_id" TEXT;

-- CreateIndex
CREATE INDEX "students_enrolled_by_id_idx" ON "students"("enrolled_by_id");

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_enrolled_by_id_fkey" FOREIGN KEY ("enrolled_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
