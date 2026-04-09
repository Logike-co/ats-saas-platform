import { Controller, Get, Inject, UseGuards } from "@nestjs/common";
import { GetCurrentTenantContextUseCase } from "../application/ports/in/get-current-tenant-context.use-case";
import { ResolveDevTenantGuard } from "../guards/resolve-dev-tenant.guard";
import { GET_CURRENT_TENANT_CONTEXT_USE_CASE } from "../tenancy.constants";

/**
 * US-002: demonstrates tenant in request context.
 * US-010: replace ResolveDevTenantGuard with JWT-based tenant resolution; access token should include claim `tenant_id` (UUID).
 */
@Controller("api/v1/tenancy")
@UseGuards(ResolveDevTenantGuard)
export class GetTenantContextController {
  constructor(
    @Inject(GET_CURRENT_TENANT_CONTEXT_USE_CASE)
    private readonly getCurrentTenantContext: GetCurrentTenantContextUseCase
  ) {}

  @Get("context")
  getTenantContext(): { tenantId: string } {
    return this.getCurrentTenantContext.query();
  }
}
