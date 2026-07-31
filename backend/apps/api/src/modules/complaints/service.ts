import { ComplaintRepository } from "./repository";
import axios from "axios";
import { config } from "@vizagops/config";

export class ComplaintService {
  constructor(private repo: ComplaintRepository = new ComplaintRepository()) {}

  async processComplaint(payload: any, telemetry: any) {
    const normalized = {
      ...payload,
      title: payload.title.trim(),
      source: payload.source || "WEB_API"
    };

    if (!normalized.category) {
      if (normalized.title.toLowerCase().includes("pothole") || normalized.description?.toLowerCase().includes("road")) {
        normalized.category = "INFRASTRUCTURE";
      } else {
        normalized.category = "GENERAL";
      }
    }

    if (!normalized.priority) {
      normalized.priority = normalized.category === "INFRASTRUCTURE" ? "HIGH" : "MEDIUM";
    }

    const complaint = await this.repo.create(normalized);

    try {
      await axios.post(`${config.AUDIT_SERVICE_URL}/log`, {
        entity: "Complaint",
        entityId: complaint.id,
        action: "CREATED",
        performedBy: complaint.citizenId || "SYSTEM",
        service: "api-gateway"
      }, {
        headers: { "x-request-id": telemetry.requestId }
      });
    } catch (err) {
      console.error("Failed to audit complaint creation");
    }

    return complaint;
  }

  async getAllComplaints() {
    return this.repo.getAll();
  }

  async getComplaintsByCitizen(citizenId: string) {
    return this.repo.findByCitizenId(citizenId);
  }
}
