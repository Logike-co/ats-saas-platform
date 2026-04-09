import { Controller, Get } from "@nestjs/common";

@Controller("api/v1/health")
export class HealthController {
  @Get()
  check() {
    return {
      status: "ok",
      service: "backend",
      apiVersion: "v1",
      timestamp: new Date().toISOString()
    };
  }
}
