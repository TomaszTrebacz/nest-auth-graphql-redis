import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { RedisHandlerService } from "../redis-handler/redis-handler.service";

@Injectable()
export class AuthGqlRedisService {
  constructor(
    private redisHandlerService: RedisHandlerService,
    private jwtService: JwtService
  ) {}

  async validateJWT(payload: JwtPayload): Promise<boolean> {
    const userExists = await this.redisHandlerService.userExists(payload.id);

    if (userExists === false) {
      throw new UnauthorizedException(
        "Wrong JWT & User does not exist in database"
      );
    }

    return true;
  }

  // secret & exp is setted in auth.module.ts in config env
  createDefaultJWT(payload) {
    return this.jwtService.sign(payload);
  }

  // used for custom tokens, like refresh or confirm token
  createJWT(payload, secret, expiresIn) {
    return this.jwtService.sign(payload, {
      secret: secret,
      expiresIn: expiresIn,
    });
  }

  verifyToken(token, secret) {
    return this.jwtService.verify(token, secret);
  }
}
