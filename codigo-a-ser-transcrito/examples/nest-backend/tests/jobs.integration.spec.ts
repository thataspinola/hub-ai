import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule, JobsService, TokenVerifier } from '../src/app';
describe('Nest module integration: real service and in-memory repository', () => {
  let module: TestingModule, service: JobsService;
  beforeEach(async () => {
    module = await Test.createTestingModule({ imports: [AppModule] }).compile();
    service = module.get(JobsService);
  });
  afterEach(async () => { await module.close(); });
  it('resolves DI and retrieves the persisted business record', () => {
    service.create({ id: 'job-1', kind: 'sync' });
    expect(service.find('job-1')).toEqual({ id: 'job-1', kind: 'sync' });
  });
  it('duplicate creation does not replace the original', () => {
    service.create({ id: 'job-1', kind: 'sync' });
    expect(() => service.create({ id: 'job-1', kind: 'review' })).toThrow(ConflictException);
    expect(service.find('job-1').kind).toBe('sync');
  });
  it('default identity boundary denies tokens until configured', async () => {
    await expect(module.get(TokenVerifier).verify('fixture-token')).resolves.toBe(false);
  });
});

import { createApp } from '../src/bootstrap';
it('production bootstrap initializes the same HTTP globals and closes cleanly', async () => {
  const app = await createApp();
  try {
    const request = (await import('supertest')).default;
    await request(app.getHttpServer()).get('/api/jobs/missing').expect(401);
    await request(app.getHttpServer()).get('/jobs/missing').expect(404);
  } finally { await app.close(); }
});
