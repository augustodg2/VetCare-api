-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PAID', 'CANCELED', 'REFUNDED');

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "status" "PaymentStatus" NOT NULL DEFAULT 'PAID',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "Payment"("status");
