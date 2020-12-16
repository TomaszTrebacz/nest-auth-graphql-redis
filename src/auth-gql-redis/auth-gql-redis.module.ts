import { Module } from "@nestjs/common";
import { RedisHandlerService } from "../redis-handler/redis-handler.service";
import { ConfigService } from "@nestjs/config";
import { RedisModule } from "nestjs-redis";
import { RedisHandlerModule } from "../redis-handler/redis-handler.module";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthGqlRedisService } from "./auth-gql-redis.service";
import { JwtStrategy } from "../strategies/jwt.strategy";
import { TokenModule } from "src/token/token.module";
import { TokenService } from "src/token/token.service";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      imports: [ConfigService],
      useFactory: (config: ConfigService) => config.get("jwt"),
      inject: [ConfigService],
    }),
    RedisModule.forRootAsync({
      imports: [ConfigService],
      useFactory: (config: ConfigService) => config.get("redis"),
      inject: [ConfigService],
    }),
    RedisHandlerModule,
    TokenModule,
  ],
  providers: [
    RedisHandlerService,
    TokenService,
    AuthGqlRedisService,
    JwtStrategy,
  ],
  exports: [
    RedisHandlerService,
    TokenService,
    AuthGqlRedisService,
    JwtStrategy,
  ],
})
export class AuthGqlRedisModule {}
