import { Test } from "@nestjs/testing";
import { Reflector } from "@nestjs/core";
import { ExecutionContext } from "@nestjs/common";
import { createMock } from "@golevelup/nestjs-testing";
import { RedisHandlerService } from "../redis-handler/redis-handler.service";
import { RolesGuard } from "./roles.guard";

describe("RolesGuard", () => {
  let guard: RolesGuard;
  let redisHandlerService: RedisHandlerService;

  beforeEach(async () => {
    guard = new RolesGuard(RedisHandlerService, new Reflector());

    const mockRedisHandlerService = {
      getValue: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        {
          provide: RedisHandlerService,
          useValue: mockRedisHandlerService,
        },
      ],
    }).compile();

    redisHandlerService = module.get<RedisHandlerService>(RedisHandlerService);
  });

  it("should be defined", () => {
    expect(guard).toBeDefined();
  });

  describe("if user does not exist in database", () => {
    it("should throw an error", () => {
      const context = createMock<ExecutionContext>();

      const errMessage = "fds";
      const throwError = () => {
        throw new Error(errMessage);
      };

      const redisHandlerGetValueSpy = jest
        .spyOn(redisHandlerService, "getValue")
        .mockImplementation(throwError);

      try {
        guard.canActivate(context);
      } catch (err) {
        expect(err.message).toEqual(errMessage);
      } finally {
        expect(redisHandlerGetValueSpy).toHaveBeenCalled;
      }
    });
  });
});
