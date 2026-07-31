# Backend Implementation Plan: VizagOps Unify (Final MVP Architecture)

This document represents the finalized, approved architecture for Phase 1 of the backend MVP. It incorporates robust engineering practices—like strongly typed environments, repository patterns, request correlation, and security middleware—while maintaining a laser focus on the core hackathon deliverables.

## User Review Required

> [!IMPORTANT]
> Please review this final blueprint. Upon your approval (by clicking **Proceed**), the architecture will be frozen and Phase 1 execution will begin immediately.

## 1. Workspace & Language Standardization

The entire backend is built in **strict TypeScript** using npm workspaces. 

```text
backend/
├── apps/
│   ├── api          # Main gateway (externally exposed routes)
│   ├── audit        # Internal audit logging service
│   └── workers      # (Postponed)
├── packages/
│   ├── api          # Shared API helpers, global error handler, middleware
│   ├── prisma       # Shared Prisma client, schema, & Seed Scripts
│   ├── types        # Shared TypeScript types
│   ├── validation   # Shared Zod schemas (request validation)
│   ├── config       # Zod-validated environment config
│   └── logger       # Structured logging with request correlation
```

## 2. Shared Packages Enhancements

- **Environment (`packages/config`)**: Uses Zod to parse, validate, and export a strongly typed configuration object. Fails fast if variables are missing. No raw `process.env` usage elsewhere.
- **Global Error Handling (`packages/api`)**: Catches exceptions, logs stack traces internally, hides implementation details, and returns standardized JSON errors.
- **Validation Middleware (`packages/api`)**: Validates incoming requests against Zod schemas *before* the controller layer.

## 3. Domain-Based Module Organization

`apps/api` will use domain-driven modules:
```text
apps/api/src/modules/
    ├── complaints/
    ├── assignments/
    ├── field-teams/
    ├── health/
    └── audit/       # Read-only proxy to internal audit-svc
```

### Repository Interfaces
To improve separation of concerns, controllers/services will interact with the database via dedicated repository interfaces (e.g., `ComplaintRepository`), abstracting away raw Prisma calls.

## 4. Enhanced Models & Database

- **UUIDs** as primary keys. Explicit relations and indexes.
- **Complaint**: `citizenId`, `title`, `description`, `category`, `priority`, `status`, `latitude`, `longitude`, `source`, `attachments`, `createdAt`, `updatedAt`, `severity`, `ward`, `department`, `imageUrls`, `estimatedResolutionTime`, `resolutionNotes`.
- **AuditLog**: `entity`, `entityId`, `action`, `performedBy`, `timestamp`, `prevHash`, `entryHash`, `metadata`, `requestId`, `ipAddress`, `userAgent`, `service`, `version`.
- **Seed Script**: A database seeder will populate realistic demo data for Complaints, Field Teams, and Assignments.

## 5. Security & Request Management

- **API Versioning**: All routes mounted under `/api/v1` (e.g., `/api/v1/complaints`).
- **Basic Security**: Integration of Helmet, CORS, size limits, and rate limiting.
- **Request Correlation**: A unique `requestId` generated per request and propagated through logs, audit entries, errors, and response headers.
- **Internal Audit**: `POST /audit/log` is strictly internal. Only `GET /api/v1/audit/verify` and `GET /api/v1/audit/:id` are externally exposed.

## 6. Lightweight Docker Compose

To simplify local onboarding, the `backend/docker-compose.yml` will be updated to include **only** PostgreSQL and Adminer. Redis will be omitted until required by future phases.

## 7. Phase 1 Acceptance Criteria (Definition of Done)

Execution of Phase 1 will freeze when the following are achieved:
- [ ] TypeScript workspace builds successfully
- [ ] Prisma migrations execute successfully
- [ ] PostgreSQL connects successfully
- [ ] Complaint creation persists data
- [ ] Complaint creation automatically generates an audit entry
- [ ] Audit hash chain verifies successfully
- [ ] Health endpoints report service readiness
- [ ] Swagger documents every endpoint
- [ ] Seed script populates demo data
- [ ] Docker Compose starts the local development environment with a single command
