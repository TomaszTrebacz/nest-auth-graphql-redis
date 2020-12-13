import { Test, TestingModule } from '@nestjs/testing';
import { AuthGqlRedisService } from './auth-gql-redis.service';

describe('AuthGqlRedisService', () => {
  let service: AuthGqlRedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthGqlRedisService],
    }).compile();

    service = module.get<AuthGqlRedisService>(AuthGqlRedisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
