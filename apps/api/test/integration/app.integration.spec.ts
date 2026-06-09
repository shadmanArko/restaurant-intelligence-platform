import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '@app/app.module.js';
import { DATABASE_POOL } from '@shared/infrastructure/database/database.tokens.js';
import { REDIS_CLIENT } from '@shared/infrastructure/redis/redis.tokens.js';

describe('App integration foundation', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.DATABASE_URL = 'postgresql://rip_user:rip_password@localhost:5432/rip_db';
    process.env.JWT_SECRET = 'test-secret-with-length';

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DATABASE_POOL)
      .useValue({
        query: jest.fn().mockResolvedValue({ rows: [{ '?column?': 1 }] }),
        end: jest.fn().mockResolvedValue(undefined),
      })
      .overrideProvider(REDIS_CLIENT)
      .useValue({
        ping: jest.fn().mockResolvedValue('PONG'),
        disconnect: jest.fn(),
      })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('exposes health checks', async () => {
    await request(app.getHttpServer()).get('/health').expect(200);
  });
});
