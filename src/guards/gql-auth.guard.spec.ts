import { Reflector } from "@nestjs/core";
import { GqlAuthGuard } from "./gql-auth.guard";
import { RedisHandlerService } from "../redis-handler/redis-handler.service";

describe("GqlAuthGuard", () => {
  let guard: GqlAuthGuard;

  beforeEach(async () => {
    guard = new GqlAuthGuard(RedisHandlerService, new Reflector());
  });

  it("should be defined", () => {
    expect(guard).toBeDefined();
  });
  const user = "someUser";
  const payload = {
    body: "somePayload",
    message: "dassd",
  };

  describe("if user is provided in context", () => {
    it("should return an user", () => {
      expect(guard.handleRequest(null, user, payload)).toEqual(user);
    });
  });
  describe("otherwise", () => {
    it("should throw the error", () => {
      const errMessage = "Some error from @nestjs/jwt!";

      try {
        guard.handleRequest(errMessage, undefined, payload);
      } catch (err) {
        expect(err).toEqual(errMessage);
      }
    });
  });
});
