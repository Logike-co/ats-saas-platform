import { BadRequestException, ForbiddenException } from "@nestjs/common";
import { ExecutionContext } from "@nestjs/common";
import { FindTenantByIdPort } from "../application/ports/out/find-tenant-by-id.port";
import { TenantContextService } from "../application/tenant-context.service";
import { ResolveDevTenantGuard } from "./resolve-dev-tenant.guard";

const SEED_ID = "00000000-0000-4000-8000-000000000001";

function mockContext(headers: Record<string, string | string[] | undefined>): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ headers })
    })
  } as ExecutionContext;
}

describe("ResolveDevTenantGuard", () => {
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
    delete process.env.TENANT_DEV_HEADER;
  });

  it("rejects when dev resolution is disabled", async () => {
    process.env.NODE_ENV = "production";
    delete process.env.TENANT_DEV_HEADER;

    const guard = new ResolveDevTenantGuard(
      { findActiveById: jest.fn() },
      { setTenantId: jest.fn() } as unknown as TenantContextService
    );

    await expect(guard.canActivate(mockContext({}))).rejects.toBeInstanceOf(
      ForbiddenException
    );
  });

  it("requires X-Tenant-Id in dev", async () => {
    process.env.NODE_ENV = "development";

    const guard = new ResolveDevTenantGuard(
      { findActiveById: jest.fn() },
      { setTenantId: jest.fn() } as unknown as TenantContextService
    );

    await expect(guard.canActivate(mockContext({}))).rejects.toBeInstanceOf(
      BadRequestException
    );
  });

  it("rejects invalid UUID", async () => {
    process.env.NODE_ENV = "development";

    const guard = new ResolveDevTenantGuard(
      { findActiveById: jest.fn() },
      { setTenantId: jest.fn() } as unknown as TenantContextService
    );

    await expect(
      guard.canActivate(mockContext({ "x-tenant-id": "not-a-uuid" }))
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("rejects unknown tenant", async () => {
    process.env.NODE_ENV = "development";
    const find: FindTenantByIdPort = {
      findActiveById: jest.fn().mockResolvedValue(null)
    };

    const guard = new ResolveDevTenantGuard(
      find,
      { setTenantId: jest.fn() } as unknown as TenantContextService
    );

    await expect(
      guard.canActivate(mockContext({ "x-tenant-id": SEED_ID }))
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("sets context and allows when tenant exists", async () => {
    process.env.NODE_ENV = "development";
    const find: FindTenantByIdPort = {
      findActiveById: jest.fn().mockResolvedValue({ id: SEED_ID })
    };
    const setTenantId = jest.fn();
    const tenantContext = { setTenantId } as unknown as TenantContextService;

    const guard = new ResolveDevTenantGuard(find, tenantContext);

    await expect(
      guard.canActivate(mockContext({ "x-tenant-id": SEED_ID }))
    ).resolves.toBe(true);

    expect(setTenantId).toHaveBeenCalledWith(SEED_ID);
  });

  it("enables via TENANT_DEV_HEADER in production-like env", async () => {
    process.env.NODE_ENV = "production";
    process.env.TENANT_DEV_HEADER = "true";

    const find: FindTenantByIdPort = {
      findActiveById: jest.fn().mockResolvedValue({ id: SEED_ID })
    };
    const setTenantId = jest.fn();
    const guard = new ResolveDevTenantGuard(
      find,
      { setTenantId } as unknown as TenantContextService
    );

    await expect(
      guard.canActivate(mockContext({ "x-tenant-id": SEED_ID }))
    ).resolves.toBe(true);
  });
});
