import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { RedisHandlerService } from '../redis-handler/redis-handler.service';

@Injectable()
export class AuthGqlRedisService {
  constructor(
    private redisHandlerService: RedisHandlerService,
    private jwtService: JwtService,
  ) {}

  // check if user exists in database
  async validateJWT(payload: JwtPayload): Promise<boolean> {
    const userExists = await this.redisHandlerService.userExists(payload.id);

    if (userExists === false) {
      throw new UnauthorizedException(
        'Wrong JWT & User does not exist in database',
      );
    }

    return true;
  }

  // secret & exp is setted in auth.module.ts in config env
  // default jwt is used as access token, so function only accepts id as param
  async createDefaultJWT(id: string): Promise<string> {
    const payload = { id };
    try {
      return await this.jwtService.sign(payload);
    } catch (err) {
      throw new Error(`Can not create token: ${err.message}`);
    }
  }

  // used for custom tokens, like refresh or confirm token
  async createJWT(
    payload: any,
    secret: string,
    expiresIn: string,
  ): Promise<string> {
    try {
      return await this.jwtService.sign(payload, {
        secret,
        expiresIn,
      });
    } catch (err) {
      throw new Error(`Can not create token: ${err.message}`);
    }
  }

  async verifyToken(token, secret): Promise<JwtPayload> {
    try {
      return await this.jwtService.verify(token, { secret });
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }
}
