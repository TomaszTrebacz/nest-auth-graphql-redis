import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { RedisHandlerService } from "../redis-handler/redis-handler.service";

@Injectable()
export class AuthGqlRedisService {
  constructor(private redisHandlerService: RedisHandlerService) {}

  async validateJWT(payload: JwtPayload): Promise<boolean> {
    const userExists = await this.redisHandlerService.userExists(payload.id);

    if (userExists === false) {
      throw new UnauthorizedException(
        "Wrong JWT & User does not exist in database"
      );
    }

    return true;
  }
}
