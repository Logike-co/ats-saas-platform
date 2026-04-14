import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable
} from "@nestjs/common";
import { Request } from "express";
import { FindTenantByIdPort } from "../application/ports/out/find-tenant-by-id.port";
import { TenantContextService } from "../application/tenant-context.service";
import { FIND_TENANT_BY_ID_PORT } from "../tenancy.constants";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isDevTenantHeaderAllowed(): boolean {
  return (
    process.env.NODE_ENV === "development" || process.env.TENANT_DEV_HEADER === "true"
  );
}

@Injectable()
export class ResolveDevTenantGuard implements CanActivate {
  constructor(
    @Inject(FIND_TENANT_BY_ID_PORT)
    private readonly findTenantById: FindTenantByIdPort,
    private readonly tenantContext: TenantContextService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (!isDevTenantHeaderAllowed()) {
      throw new ForbiddenException({
        code: "TENANT_RESOLUTION_UNAVAILABLE",
        message:
          "Tenant must be resolved from a verified JWT (US-010). Dev header resolution is disabled in this environment."
      });
    }

    const req = context.switchToHttp().getRequest<Request>();
    const raw = req.headers["x-tenant-id"];
    const headerValue = Array.isArray(raw) ? raw[0] : raw;

    if (!headerValue?.trim()) {
      throw new BadRequestException({
        code: "TENANT_REQUIRED",
        message: "X-Tenant-Id header is required."
      });
    }

    const id = headerValue.trim();
    if (!UUID_REGEX.test(id)) {
      throw new BadRequestException({
        code: "TENANT_INVALID",
        message: "X-Tenant-Id must be a valid UUID."
      });
    }

    const tenant = await this.findTenantById.findActiveById(id);
    if (!tenant) {
      throw new BadRequestException({
        code: "TENANT_INVALID",
        message: "Tenant not found or inactive."
      });
    }

    this.tenantContext.setTenantId(tenant.id);
    return true;
  }
}
