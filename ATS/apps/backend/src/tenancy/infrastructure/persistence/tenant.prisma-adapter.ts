import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { FindTenantByIdPort } from "../../application/ports/out/find-tenant-by-id.port";

@Injectable()
export class TenantPrismaAdapter implements FindTenantByIdPort {
  constructor(private readonly prisma: PrismaService) {}

  async findActiveById(id: string): Promise<{ id: string } | null> {
    return this.prisma.tenant.findFirst({
      where: { id, deletedAt: null },
      select: { id: true }
    });
  }
}
