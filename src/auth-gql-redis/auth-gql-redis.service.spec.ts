import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { JwtPayload } from "src/interfaces";
import { RedisHandlerService } from "../redis-handler/redis-handler.service";
import { AuthGqlRedisService } from "./auth-gql-redis.service";

describe("AuthGqlRedisService", () => {
  let authService: AuthGqlRedisService;
  let jwtService: JwtService;
  let redisHandlerService: RedisHandlerService;

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const mockRedisHandlerService = {
    userExists: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthGqlRedisService,
        JwtService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: RedisHandlerService,
          useValue: mockRedisHandlerService,
        },
      ],
    }).compile();

    authService = module.get<AuthGqlRedisService>(AuthGqlRedisService);
    jwtService = module.get<JwtService>(JwtService);
    redisHandlerService = module.get<RedisHandlerService>(RedisHandlerService);
  });

  it("should be defined", () => {
    expect(authService).toBeDefined();
  });

  const fakePayload: JwtPayload = {
    id: "9d2150dd-22dd-43eb-ad7d-d52d44fac3c8",
    iat: 1516239022,
    exp: 1516239022,
  };

  describe("validateJWT", () => {
    describe("if user exists in database", () => {
      it("should return true", async () => {
        const redisHandlerUserExistsSpy = jest
          .spyOn(redisHandlerService, "userExists")
          .mockResolvedValue(true);

        expect(await authService.validateJWT(fakePayload));
        expect(redisHandlerUserExistsSpy).toHaveBeenCalledWith(fakePayload.id);
      });
    });
    describe("otherwise", () => {
      it("should throw an error", async () => {
        const redisHandlerUserExistsSpy = jest
          .spyOn(redisHandlerService, "userExists")
          .mockResolvedValue(false);

        try {
          await authService.validateJWT(fakePayload);
        } catch (err) {
          expect(err.message).toEqual("Unauthorized");
        } finally {
          expect(redisHandlerUserExistsSpy).toHaveBeenCalledWith(
            fakePayload.id
          );
        }
      });
    });
  });

  describe("createDefaultJWT", () => {
    const fakeJWT = "eyJhbGciOiJdWIiO[...]";
    const id = "fakeId";

    describe("if successfully created", () => {
      it("should return the JWT", async () => {
        const jwtServiceSignSpy = jest
          .spyOn(jwtService, "sign")
          .mockReturnValue(fakeJWT);

        expect(await authService.createDefaultJWT(id)).toEqual(fakeJWT);
        expect(jwtServiceSignSpy).toHaveBeenCalledWith({ id });
      });
    });
    describe("otherwise", () => {
      const errMessage = "Some error from @nestjs/jwt!";
      const throwError = () => {
        throw new Error(errMessage);
      };

      it("should throw an error", async () => {
        const jwtServiceSignSpy = jest
          .spyOn(jwtService, "sign")
          .mockImplementation(throwError);

        try {
          await authService.createDefaultJWT(id);
        } catch (err) {
          expect(err.message).toEqual(`Can not create token: ${errMessage}`);
        } finally {
          expect(jwtServiceSignSpy).toHaveBeenCalledWith({ id });
        }
      });
    });
  });

  describe("createJWT", () => {
    const fakeSecret = "someSecret";
    const fakeExpiresIn = "15s";

    describe("if successfully created", () => {
      it("should return the JWT", async () => {
        const fakeJWT = "eyJhbGciOiJdWIiO[...]";

        const jwtServiceSignSpy = jest
          .spyOn(jwtService, "sign")
          .mockReturnValue(fakeJWT);

        expect(
          await authService.createJWT(fakePayload, fakeSecret, fakeExpiresIn)
        ).toEqual(fakeJWT);
        expect(jwtServiceSignSpy).toHaveBeenCalledWith(fakePayload, {
          secret: fakeSecret,
          expiresIn: fakeExpiresIn,
        });
      });
    });
    describe("otherwise", () => {
      const errMessage = "Some error from @nestjs/jwt!";
      const throwError = () => {
        throw new Error(errMessage);
      };

      it("should throw an error", async () => {
        const jwtServiceSignSpy = jest
          .spyOn(jwtService, "sign")
          .mockImplementation(throwError);

        try {
          await authService.createJWT(fakePayload, fakeSecret, fakeExpiresIn);
        } catch (err) {
          expect(err.message).toEqual(`Can not create token: ${errMessage}`);
        } finally {
          expect(jwtServiceSignSpy).toHaveBeenCalledWith(fakePayload, {
            secret: fakeSecret,
            expiresIn: fakeExpiresIn,
          });
        }
      });
    });
  });

  describe("verifyToken", () => {
    const body = {
      token: "someToken",
      secret: "someSecret",
    };

    describe("if successfully verified", () => {
      it("should return decoded JWT", async () => {
        const jwtServiceSignSpy = jest
          .spyOn(jwtService, "verify")
          .mockReturnValue(fakePayload);

        expect(await authService.verifyToken(body.token, body.secret)).toEqual(
          fakePayload
        );
        expect(jwtServiceSignSpy).toHaveBeenCalledWith(body.token, {
          secret: body.secret,
        });
      });
    });
    describe("otherwise", () => {
      it("should throw an error", async () => {
        const jwtServiceSignSpy = jest
          .spyOn(jwtService, "verify")
          .mockReturnValue(fakePayload);

        try {
          await authService.verifyToken(body.token, body.secret);
        } catch (err) {
          expect(err.message).toEqual("Unathorized");
        } finally {
          expect(jwtServiceSignSpy).toHaveBeenCalledWith(body.token, {
            secret: body.secret,
          });
        }
      });
    });
  });
});
