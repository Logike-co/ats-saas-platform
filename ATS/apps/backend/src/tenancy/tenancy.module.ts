import { Module } from "@nestjs/common";
import { GetTenantContextController } from "./api/get-tenant-context.controller";
import { GetCurrentTenantContextService } from "./application/services/get-current-tenant-context.service";
import { TenantContextService } from "./application/tenant-context.service";
import { TenantPrismaAdapter } from "./infrastructure/persistence/tenant.prisma-adapter";
import { ResolveDevTenantGuard } from "./guards/resolve-dev-tenant.guard";
import {
  FIND_TENANT_BY_ID_PORT,
  GET_CURRENT_TENANT_CONTEXT_USE_CASE
} from "./tenancy.constants";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [GetTenantContextController],
  providers: [
    TenantContextService,
    TenantPrismaAdapter,
    { provide: FIND_TENANT_BY_ID_PORT, useExisting: TenantPrismaAdapter },
    GetCurrentTenantContextService,
    {
      provide: GET_CURRENT_TENANT_CONTEXT_USE_CASE,
      useExisting: GetCurrentTenantContextService
    },
    ResolveDevTenantGuard
  ],
  exports: [TenantContextService, FIND_TENANT_BY_ID_PORT]
})
export class TenancyModule {}
