import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { Redis } from "ioredis";
import { RedisService } from "nestjs-redis";

@Injectable()
export class RedisHandlerService {
  client: Redis;

  constructor(private readonly redisService: RedisService) {
    this.client = this.getRedisClient();
  }

  getRedisClient(): Redis {
    return this.redisService.getClient();
  }

  /*
    comprehensive function for saving new user in database
    and create/update fields for purposes
    like reset password, refresh token etc.
  */
  async setUser(id: string, properties: Map<string, string>): Promise<boolean> {
    try {
      await this.client.hmset(id, properties);

      return true;
    } catch (err) {
      throw new UnprocessableEntityException(err.message);
    }
  }

  async getFields(id: string, keys: string[]) {
    const values = await this.client.hmget(id, keys);

    const fields = Object.fromEntries(keys.map((_, i) => [keys[i], values[i]]));
    return fields;
  }

  async userExists(id: string): Promise<boolean> {
    const res = await this.client.exists(id);

    return res === 1 ? true : false;
  }

  async getValue(id: string, key: string): Promise<string> {
    const value = await this.client.hget(id, key);

    if (!value) {
      throw new UnprocessableEntityException("There is no user with given Id!");
    }

    return value;
  }

  async deleteField(id: string, key: string): Promise<boolean> {
    const isRemoved = await this.client.hdel(id, key);

    if (isRemoved !== 1) {
      throw new UnprocessableEntityException("There is no user with given Id!");
    }

    return true;
  }

  async deleteUser(key: string): Promise<boolean> {
    if (!key) {
      throw new UnprocessableEntityException("Null id.");
    }

    await this.client.del(key);

    return true;
  }
}
