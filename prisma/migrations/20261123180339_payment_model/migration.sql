-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "discount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemPayment" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "description" TEXT,
    "paymentId" TEXT NOT NULL,
    "procedureId" TEXT NOT NULL,

    CONSTRAINT "ItemPayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Payment_createdAt_idx" ON "Payment"("createdAt");

-- CreateIndex
CREATE INDEX "ItemPayment_paymentId_idx" ON "ItemPayment"("paymentId");

-- CreateIndex
CREATE INDEX "ItemPayment_procedureId_idx" ON "ItemPayment"("procedureId");

-- CreateIndex
CREATE UNIQUE INDEX "ItemPayment_paymentId_procedureId_key" ON "ItemPayment"("paymentId", "procedureId");

-- AddForeignKey
ALTER TABLE "ItemPayment" ADD CONSTRAINT "ItemPayment_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemPayment" ADD CONSTRAINT "ItemPayment_procedureId_fkey" FOREIGN KEY ("procedureId") REFERENCES "Procedure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
