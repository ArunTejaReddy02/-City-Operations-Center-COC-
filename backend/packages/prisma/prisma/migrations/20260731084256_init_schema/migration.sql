-- CreateTable
CREATE TABLE "complaints" (
    "id" TEXT NOT NULL,
    "citizenId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "priority" TEXT,
    "severity" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "ward" TEXT,
    "department" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "source" TEXT,
    "imageUrls" TEXT[],
    "estimatedResolutionTime" TIMESTAMP(3),
    "resolutionNotes" TEXT,
    "attachments" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "complaints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sensor_events" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "metadata" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sensor_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "field_teams" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "members" TEXT[],
    "currentLat" DOUBLE PRECISION,
    "currentLng" DOUBLE PRECISION,
    "availability" TEXT NOT NULL DEFAULT 'AVAILABLE',

    CONSTRAINT "field_teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assignments" (
    "id" TEXT NOT NULL,
    "complaintId" TEXT NOT NULL,
    "fieldTeamId" TEXT NOT NULL,
    "assignedBy" TEXT,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'ASSIGNED',
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "performedBy" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "prevHash" TEXT NOT NULL,
    "entryHash" TEXT NOT NULL,
    "metadata" JSONB,
    "requestId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "service" TEXT,
    "version" TEXT,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "complaints_status_idx" ON "complaints"("status");

-- CreateIndex
CREATE INDEX "complaints_priority_idx" ON "complaints"("priority");

-- CreateIndex
CREATE INDEX "complaints_category_idx" ON "complaints"("category");

-- CreateIndex
CREATE INDEX "complaints_createdAt_idx" ON "complaints"("createdAt");

-- CreateIndex
CREATE INDEX "assignments_fieldTeamId_idx" ON "assignments"("fieldTeamId");

-- CreateIndex
CREATE INDEX "audit_logs_timestamp_idx" ON "audit_logs"("timestamp");

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_complaintId_fkey" FOREIGN KEY ("complaintId") REFERENCES "complaints"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_fieldTeamId_fkey" FOREIGN KEY ("fieldTeamId") REFERENCES "field_teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
