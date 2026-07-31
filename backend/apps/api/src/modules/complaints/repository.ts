import { prisma, Complaint, Prisma } from "@vizagops/prisma";
export class ComplaintRepository {
  async create(data: Prisma.ComplaintCreateInput): Promise<Complaint> {
    return prisma.complaint.create({ data });
  }
}
