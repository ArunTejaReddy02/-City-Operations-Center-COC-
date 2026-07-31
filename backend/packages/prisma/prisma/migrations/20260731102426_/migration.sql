/*
  Warnings:

  - You are about to drop the column `assignedBy` on the `assignments` table. All the data in the column will be lost.
  - The `status` column on the `assignments` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `availability` column on the `field_teams` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'WARD_OFFICER', 'FIELD_AGENT', 'CITIZEN');

-- CreateEnum
CREATE TYPE "AssignmentStatus" AS ENUM ('PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "FieldTeamStatus" AS ENUM ('AVAILABLE', 'BUSY', 'OFFLINE');

-- AlterTable
ALTER TABLE "assignments" DROP COLUMN "assignedBy",
ADD COLUMN     "assignedById" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "AssignmentStatus" NOT NULL DEFAULT 'ASSIGNED';

-- AlterTable
ALTER TABLE "field_teams" DROP COLUMN "availability",
ADD COLUMN     "availability" "FieldTeamStatus" NOT NULL DEFAULT 'AVAILABLE';

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'CITIZEN',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
