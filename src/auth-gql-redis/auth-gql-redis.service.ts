import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtPayload } from "src/interfaces/jwt-payload.interface";
import { RedisHandlerService } from "src/redis-handler/redis-handler.service";

@Injectable()
export class AuthGqlRedisService {
  constructor(private redis: RedisHandlerService) {}

  async validateJWT(payload: JwtPayload): Promise<boolean> {
    const userExists = await this.redis.userExists(payload.id);

    if (userExists === false) {
      throw new UnauthorizedException(
        "Wrong JWT & User does not exist in database"
      );
    }

    return true;
  }
}
