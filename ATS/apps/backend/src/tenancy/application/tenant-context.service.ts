import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ClsService } from "nestjs-cls";

@Injectable()
export class TenantContextService {
  constructor(private readonly cls: ClsService) {}

  setTenantId(id: string): void {
    this.cls.set("tenantId", id);
  }

  getTenantId(): string | undefined {
    return this.cls.get("tenantId");
  }

  getTenantIdOrThrow(): string {
    const id = this.getTenantId();
    if (!id) {
      throw new InternalServerErrorException({
        code: "TENANT_CONTEXT_MISSING",
        message: "Tenant id was not set on the request context."
      });
    }
    return id;
  }
}
