import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { AuthGqlRedisService } from "../auth-gql-redis/auth-gql-redis.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authGqlService: AuthGqlRedisService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ACCESS_JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    await this.authGqlService.validateJWT(payload);

    return payload;
  }
}
