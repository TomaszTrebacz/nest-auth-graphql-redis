import { Global, Module } from "@nestjs/common";
import { RedisHandlerService } from "../redis-handler/redis-handler.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RedisModule } from "nestjs-redis";
import { RedisHandlerModule } from "../redis-handler/redis-handler.module";

@Module({
  imports: [
    RedisModule.forRootAsync({
      imports: [ConfigService],
      useFactory: (config: ConfigService) => config.get("redis"),
      inject: [ConfigService],
    }),
    RedisHandlerModule,
  ],
  providers: [RedisHandlerService],
  exports: [RedisHandlerService],
})
export class AuthGqlRedisModule {}
