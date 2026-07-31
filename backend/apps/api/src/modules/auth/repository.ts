import { prisma, User, Prisma } from "@vizagops/prisma";
export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findFirst({ where: { email, deletedAt: null } });
  }
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data });
  }
}
