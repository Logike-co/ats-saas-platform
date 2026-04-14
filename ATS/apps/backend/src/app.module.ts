import { Module } from "@nestjs/common";
import { ClsModule } from "nestjs-cls";
import { HealthController } from "./health.controller";
import { PrismaModule } from "./prisma/prisma.module";
import { TenancyModule } from "./tenancy/tenancy.module";

@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true }
    }),
    PrismaModule,
    TenancyModule
  ],
  controllers: [HealthController]
})
export class AppModule {}
