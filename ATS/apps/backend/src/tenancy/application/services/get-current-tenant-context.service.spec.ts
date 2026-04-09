import { GetCurrentTenantContextService } from "./get-current-tenant-context.service";
import { TenantContextService } from "../tenant-context.service";

describe("GetCurrentTenantContextService", () => {
  it("returns tenantId from context", () => {
    const tenantContext = {
      getTenantIdOrThrow: jest.fn().mockReturnValue("tenant-uuid-1")
    } as unknown as TenantContextService;

    const service = new GetCurrentTenantContextService(tenantContext);
    expect(service.query()).toEqual({ tenantId: "tenant-uuid-1" });
  });
});
