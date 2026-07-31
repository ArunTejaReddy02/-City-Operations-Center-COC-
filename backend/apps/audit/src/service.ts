import crypto from "crypto";
import { AuditRepository } from "./repository";

export class AuditService {
  constructor(private repo: AuditRepository = new AuditRepository()) {}

  private hashData(prevHash: string, data: any): string {
    const payload = prevHash + JSON.stringify(data);
    return crypto.createHash("sha256").update(payload).digest("hex");
  }

  async createLog(payload: any, telemetry: any) {
    const latest = await this.repo.getLatestLog();
    const prevHash = latest ? latest.entryHash : "GENESIS";
    const entryHash = this.hashData(prevHash, payload);

    return this.repo.createLog({
      entity: payload.entity,
      entityId: payload.entityId,
      action: payload.action,
      performedBy: payload.performedBy || "SYSTEM",
      prevHash,
      entryHash,
      metadata: payload.metadata || {},
      requestId: telemetry.requestId,
      ipAddress: telemetry.ipAddress,
      userAgent: telemetry.userAgent,
      service: telemetry.service || "audit",
      version: "1.0.0"
    });
  }

  async verifyChain() {
    const logs = await this.repo.getAllLogsAscending();
    if (logs.length === 0) return { chainValid: true, verifiedCount: 0 };

    let prevHash = "GENESIS";
    for (const log of logs) {
      if (log.prevHash !== prevHash) {
        return { chainValid: false, brokenRecord: log.id, expectedPrevHash: prevHash, actualPrevHash: log.prevHash, verificationTimestamp: new Date() };
      }
      
      const payload = {
        entity: log.entity,
        entityId: log.entityId,
        action: log.action,
        performedBy: log.performedBy,
        metadata: log.metadata
      };
      
      const calculatedHash = this.hashData(prevHash, payload);
      
      if (log.entryHash !== calculatedHash) {
        return { chainValid: false, brokenRecord: log.id, expectedHash: calculatedHash, actualHash: log.entryHash, verificationTimestamp: new Date() };
      }
      prevHash = log.entryHash;
    }
    
    return { chainValid: true, verifiedCount: logs.length, verificationTimestamp: new Date() };
  }

  async getLogById(id: string) {
    return this.repo.getLogById(id);
  }
}
