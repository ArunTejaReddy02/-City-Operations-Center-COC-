import { FieldTeamRepository } from "./repository";
import axios from "axios";
import { config } from "@vizagops/config";
export class FieldTeamService {
  constructor(private repo: FieldTeamRepository = new FieldTeamRepository()) {}
  async getAll() {
    return this.repo.getAll();
  }
  async create(payload: any, telemetry: any) {
    const team = await this.repo.create({
      name: payload.name,
      members: payload.members,
      currentLat: payload.currentLat,
      currentLng: payload.currentLng,
      availability: "AVAILABLE"
    });
    try {
      await axios.post(`${config.AUDIT_SERVICE_URL}/log`, {
        entity: "FieldTeam",
        entityId: team.id,
        action: "CREATE",
        performedBy: telemetry.userEmail,
        metadata: { name: team.name, members: team.members }
      }, { headers: { "x-request-id": telemetry.requestId } });
    } catch (auditErr) {
      console.error("Failed to write audit event for field team create");
    }
    return team;
  }
  async update(id: string, payload: any, telemetry: any) {
    const existing = await this.repo.findById(id);
    if (!existing) {
      const err: any = new Error("Field team not found");
      err.code = "TEAM_NOT_FOUND";
      err.status = 404;
      throw err;
    }
    const updated = await this.repo.update(id, payload);
    try {
      await axios.post(`${config.AUDIT_SERVICE_URL}/log`, {
        entity: "FieldTeam",
        entityId: updated.id,
        action: "UPDATE",
        performedBy: telemetry.userEmail,
        metadata: { availability: updated.availability }
      }, { headers: { "x-request-id": telemetry.requestId } });
    } catch (auditErr) {
      console.error("Failed to write audit event for field team update");
    }
    return updated;
  }
}
