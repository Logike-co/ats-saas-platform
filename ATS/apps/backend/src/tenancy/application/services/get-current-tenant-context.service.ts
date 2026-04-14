import { Injectable } from "@nestjs/common";
import { GetCurrentTenantContextUseCase } from "../ports/in/get-current-tenant-context.use-case";
import { TenantContextService } from "../tenant-context.service";

@Injectable()
export class GetCurrentTenantContextService implements GetCurrentTenantContextUseCase {
  constructor(private readonly tenantContext: TenantContextService) {}

  query(): { tenantId: string } {
    return { tenantId: this.tenantContext.getTenantIdOrThrow() };
  }
}
