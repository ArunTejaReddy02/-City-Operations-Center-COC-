import { prisma, SensorEvent, Prisma } from "@vizagops/prisma";

export class SensorEventRepository {
  async create(data: Prisma.SensorEventCreateInput): Promise<SensorEvent> {
    return prisma.sensorEvent.create({ data });
  }

  async getAll(): Promise<SensorEvent[]> {
    return prisma.sensorEvent.findMany({
      orderBy: { timestamp: "desc" },
      take: 100 // Cap at 100 events
    });
  }
}
