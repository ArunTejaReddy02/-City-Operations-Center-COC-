import { prisma, AuditLog, Prisma } from "@vizagops/prisma";
export class AuditRepository {
  async createLog(data: Prisma.AuditLogCreateInput): Promise<AuditLog> {
    return prisma.auditLog.create({ data });
  }
  async getLogById(id: string): Promise<AuditLog | null> {
    return prisma.auditLog.findUnique({ where: { id } });
  }
  async getLatestLog(): Promise<AuditLog | null> {
    return prisma.auditLog.findFirst({ orderBy: { timestamp: "desc" } });
  }
  async getAllLogsAscending(): Promise<AuditLog[]> {
    return prisma.auditLog.findMany({ orderBy: { timestamp: "asc" } });
  }
}
