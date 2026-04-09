import { Test, TestingModule } from "@nestjs/testing";
import { HealthController } from "./health.controller";

describe("HealthController", () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController]
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it("returns liveness payload with apiVersion v1 and ISO-8601 timestamp", () => {
    const body = controller.check() as {
      status: string;
      service: string;
      apiVersion: string;
      timestamp: string;
    };

    expect(body).toMatchObject({
      status: "ok",
      service: "backend",
      apiVersion: "v1"
    });
    expect(body.timestamp).toBeDefined();
    expect(Number.isNaN(Date.parse(body.timestamp))).toBe(false);
  });
});
