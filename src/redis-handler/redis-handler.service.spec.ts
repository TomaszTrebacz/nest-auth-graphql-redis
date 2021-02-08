import { Test } from '@nestjs/testing';
import { RedisService } from 'nestjs-redis';
import { userRole } from '../enums';
import { RedisHandlerService } from './redis-handler.service';

const mockRedis = {
  hmset: jest.fn(),
  hmget: jest.fn(),
  exists: jest.fn(),
  hget: jest.fn(),
  hdel: jest.fn(),
  del: jest.fn(),
};

const mockRedisService = {
  getClient: jest.fn(() => mockRedis),
};

const fakeData = {
  userId: '08582cc9-ac61-45d5-b81b-0515dcdfbfff',
  key: 'randomKey',
  keys: ['role', 'confirmed'],
};

describe('RedisHandlerService', () => {
  let redisHandlerService: RedisHandlerService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RedisHandlerService,
        { provide: RedisService, useValue: mockRedisService },
      ],
    }).compile();

    redisHandlerService = module.get<RedisHandlerService>(RedisHandlerService);
  });

  it('should be defined', () => {
    expect(redisHandlerService).toBeDefined();
  });

  describe('setUser', () => {
    const userProperties = new Map<string, string>([['role', userRole.USER]]);

    describe('if data was saved successfully', () => {
      it('should return true', async () => {
        mockRedis.hmset = jest.fn().mockResolvedValue('OK');

        expect(
          await redisHandlerService.setUser(fakeData.userId, userProperties),
        ).toBeTruthy();
      });
    });

    describe('otherwise', () => {
      it('should return an error', async () => {
        mockRedis.hmset = jest.fn().mockResolvedValue(undefined);

        try {
          await redisHandlerService.setUser(fakeData.userId, userProperties);
        } catch (err) {
          expect(err.message).toEqual('Can not save data in redis database.');
        }
      });
    });
  });

  describe('getFields', () => {
    describe('if data was fetch successfully', () => {
      it('should return fields', async () => {
        const hmgetRes = ['admin', 'true'];

        const res = {
          role: 'admin',
          confirmed: 'true',
        };

        mockRedis.hmget = jest.fn().mockResolvedValue(hmgetRes);

        expect(
          await redisHandlerService.getFields(fakeData.userId, fakeData.keys),
        ).toEqual(res);
      });
    });
    describe('otherwise', () => {
      it('should return an error', async () => {
        const hmgetRes = ['admin', null];

        mockRedis.hmget = jest.fn().mockResolvedValue(hmgetRes);

        try {
          await redisHandlerService.getFields(fakeData.userId, fakeData.keys);
        } catch (err) {
          expect(err.message).toEqual(
            'Can not fetch data - property does not exist.',
          );
        }
      });
    });
  });

  describe('userExists', () => {
    describe('if user exists', () => {
      it('should return true', async () => {
        mockRedis.exists.mockResolvedValue(1);

        expect(
          await redisHandlerService.userExists(fakeData.userId),
        ).toBeTruthy();
      });
    });
    describe('otherwise', () => {
      it('should return false', async () => {
        mockRedis.exists.mockResolvedValue(0);

        expect(
          await redisHandlerService.userExists(fakeData.userId),
        ).toBeFalsy();
      });
    });
  });

  describe('getValue', () => {
    describe('if value was successfully fetch', () => {
      const value = 'randomValue';

      it('should return value', async () => {
        mockRedis.hget.mockResolvedValue(value);

        expect(
          await redisHandlerService.getValue(fakeData.userId, fakeData.key),
        );
      });
    });
    describe('otherwise', () => {
      it('should return an error', async () => {
        mockRedis.hget.mockResolvedValue(null);

        try {
          await redisHandlerService.getValue(fakeData.userId, fakeData.key);
        } catch (err) {
          expect(err.message).toEqual(
            `Can not fetch ${fakeData.key} property from user with id: ${
              fakeData.userId
            }`,
          );
        }
      });
    });
  });

  describe('deleteField', () => {
    describe('if field was successfully deleted', () => {
      it('should return true', async () => {
        mockRedis.hdel.mockResolvedValue(1);

        expect(
          await redisHandlerService.deleteField(fakeData.userId, fakeData.key),
        ).toBeTruthy();
      });
    });
    describe('otherwise', () => {
      it('should return an error', async () => {
        mockRedis.hdel.mockResolvedValue(0);

        try {
          await redisHandlerService.deleteField(fakeData.userId, fakeData.key);
        } catch (err) {
          expect(err.message).toEqual(
            `Can not delete ${fakeData.key} property from user with id: ${
              fakeData.userId
            }`,
          );
        }
      });
    });
  });

  describe('deleteUser', () => {
    describe('if user was successfully deleted', () => {
      it('should return true', async () => {
        mockRedis.del.mockResolvedValue(1);

        expect(
          await redisHandlerService.deleteUser(fakeData.userId),
        ).toBeTruthy();
      });
    });
    describe('otherwise', () => {
      it('should return an error', async () => {
        mockRedis.del.mockResolvedValue(0);

        try {
          await redisHandlerService.deleteUser(fakeData.userId);
        } catch (err) {
          expect(err.message).toEqual(
            `Can not delete user with id: ${fakeData.userId}`,
          );
        }
      });
    });
  });
});
