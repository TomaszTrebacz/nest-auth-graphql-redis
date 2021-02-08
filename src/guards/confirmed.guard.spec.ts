import { Test } from "@nestjs/testing";
import { Reflector } from "@nestjs/core";
import { ExecutionContext } from "@nestjs/common";
import { createMock } from "@golevelup/nestjs-testing";
import { RedisHandlerService } from "../redis-handler/redis-handler.service";
import { ConfirmedGuard } from "./confirmed.guard";

describe("ConfirmedGuard", () => {
  let guard: ConfirmedGuard;
  let redisHandlerService: RedisHandlerService;

  beforeEach(async () => {
    guard = new ConfirmedGuard(RedisHandlerService, new Reflector());

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

  describe("if user is confirmed", () => {
    it("should return true", () => {
      const context = createMock<ExecutionContext>();

      const redisHandlerGetValueSpy = jest
        .spyOn(redisHandlerService, "getValue")
        .mockResolvedValue("true");

      expect(redisHandlerGetValueSpy).toHaveBeenCalled;
      expect(guard.canActivate(context)).toBeTruthy();
    });
  });
  describe("otherwise", () => {
    it("should throw an error", () => {
      const context = createMock<ExecutionContext>();

      const redisHandlerGetValueSpy = jest
        .spyOn(redisHandlerService, "getValue")
        .mockResolvedValue("false");

      try {
        guard.canActivate(context);
      } catch (err) {
        expect(err.message).toEqual(
          "User is not confirmed. Please confirm accout"
        );
      } finally {
        expect(redisHandlerGetValueSpy).toHaveBeenCalled;
      }
    });
  });
});
