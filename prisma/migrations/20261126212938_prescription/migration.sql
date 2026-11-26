-- CreateTable
CREATE TABLE "Prescription" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "vetId" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Prescription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Prescription_vetId_idx" ON "Prescription"("vetId");

-- CreateIndex
CREATE INDEX "Prescription_petId_idx" ON "Prescription"("petId");

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_vetId_fkey" FOREIGN KEY ("vetId") REFERENCES "Vet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
