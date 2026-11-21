/*
  Warnings:

  - The values [VACCINE] on the enum `ProcedureType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProcedureType_new" AS ENUM ('CONSULTATION', 'RETURN', 'VACCINATION', 'SURGERY', 'EXAM');
ALTER TABLE "Appointment" ALTER COLUMN "type" TYPE "ProcedureType_new" USING ("type"::text::"ProcedureType_new");
ALTER TYPE "ProcedureType" RENAME TO "ProcedureType_old";
ALTER TYPE "ProcedureType_new" RENAME TO "ProcedureType";
DROP TYPE "public"."ProcedureType_old";
COMMIT;
