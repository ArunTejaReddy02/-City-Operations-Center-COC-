import { prisma, Complaint, Prisma } from "@vizagops/prisma";

export class ComplaintRepository {
  async create(data: Prisma.ComplaintCreateInput): Promise<Complaint> {
    return prisma.complaint.create({ data });
  }

  async getAll(): Promise<Complaint[]> {
    return prisma.complaint.findMany({
      orderBy: { createdAt: "desc" }
    });
  }

  async findById(id: string): Promise<Complaint | null> {
    return prisma.complaint.findUnique({ where: { id } });
  }

  async findByCitizenId(citizenId: string): Promise<Complaint[]> {
    return prisma.complaint.findMany({
      where: { citizenId },
      orderBy: { createdAt: "desc" }
    });
  }
}
