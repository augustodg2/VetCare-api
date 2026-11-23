-- CreateTable
CREATE TABLE "Procedure" (
    "id" TEXT NOT NULL,
    "type" "ProcedureType" NOT NULL,
    "notes" TEXT NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL,
    "petId" TEXT NOT NULL,
    "vetId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Procedure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcedureNote" (
    "id" TEXT NOT NULL,
    "procedureId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProcedureNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Procedure_type_idx" ON "Procedure"("type");

-- CreateIndex
CREATE INDEX "Procedure_petId_idx" ON "Procedure"("petId");

-- CreateIndex
CREATE INDEX "Procedure_vetId_idx" ON "Procedure"("vetId");

-- CreateIndex
CREATE INDEX "Procedure_dateTime_idx" ON "Procedure"("dateTime");

-- CreateIndex
CREATE INDEX "ProcedureNote_procedureId_createdAt_idx" ON "ProcedureNote"("procedureId", "createdAt");

-- AddForeignKey
ALTER TABLE "Procedure" ADD CONSTRAINT "Procedure_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Procedure" ADD CONSTRAINT "Procedure_vetId_fkey" FOREIGN KEY ("vetId") REFERENCES "Vet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcedureNote" ADD CONSTRAINT "ProcedureNote_procedureId_fkey" FOREIGN KEY ("procedureId") REFERENCES "Procedure"("id") ON DELETE CASCADE ON UPDATE CASCADE;
