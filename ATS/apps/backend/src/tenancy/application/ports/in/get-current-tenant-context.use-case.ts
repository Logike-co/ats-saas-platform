export interface GetCurrentTenantContextUseCase {
  query(): { tenantId: string };
}
