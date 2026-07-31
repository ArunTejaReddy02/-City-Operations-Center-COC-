import { prisma, Assignment } from "@vizagops/prisma";
export class AssignmentRepository {
  async findById(id: string): Promise<Assignment | null> {
    return prisma.assignment.findUnique({ where: { id } });
  }
}
