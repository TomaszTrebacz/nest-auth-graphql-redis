import { Global, Module } from "@nestjs/common";
import { RedisHandlerService } from "../redis-handler/redis-handler.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RedisModule } from "nestjs-redis";
import { RedisHandlerModule } from "../redis-handler/redis-handler.module";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthGqlRedisService } from "../auth-gql-redis/auth-gql-redis.service";

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
  ],
  providers: [RedisHandlerService, AuthGqlRedisService],
  exports: [RedisHandlerService],
})
export class AuthGqlRedisModule {}
