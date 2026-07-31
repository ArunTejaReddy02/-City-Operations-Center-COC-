import { SensorEventRepository } from "./repository";

export class SensorEventService {
  constructor(private repo: SensorEventRepository = new SensorEventRepository()) {}

  async createEvent(payload: any) {
    return this.repo.create({
      type: payload.type,
      severity: payload.severity || "MEDIUM",
      latitude: payload.latitude,
      longitude: payload.longitude,
      metadata: payload.metadata ? payload.metadata : undefined
    });
  }

  async getAllEvents() {
    return this.repo.getAll();
  }
}
