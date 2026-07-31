import { prisma, FieldTeam, Prisma } from "@vizagops/prisma";
export class FieldTeamRepository {
  async getAll(): Promise<FieldTeam[]> {
    return prisma.fieldTeam.findMany();
  }
  async findById(id: string): Promise<FieldTeam | null> {
    return prisma.fieldTeam.findUnique({ where: { id } });
  }
  async create(data: Prisma.FieldTeamCreateInput): Promise<FieldTeam> {
    return prisma.fieldTeam.create({ data });
  }
  async update(id: string, data: Prisma.FieldTeamUpdateInput): Promise<FieldTeam> {
    return prisma.fieldTeam.update({ where: { id }, data });
  }
}
