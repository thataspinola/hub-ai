import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule, configureApp, JobsRepository, TokenVerifier } from '../src/app';
describe('Nest HTTP E2E local: actual routes, guard, DTO pipe and persistence', () => {
  let app: INestApplication, repository: JobsRepository;
  const verifier = { verify: jest.fn(async (token: string) => token === 'fixture-token') };
  beforeEach(async () => {
    verifier.verify.mockReset().mockImplementation(async token => token === 'fixture-token');
    const module = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(TokenVerifier).useValue(verifier).compile();
    app = module.createNestApplication({ logger: false });
    configureApp(app);
    await app.init();
    repository = module.get(JobsRepository);
  });
  afterEach(async () => { await app.close(); });
  const input = { id: 'job-1', kind: 'review' };
  function post(body: object = input, auth = 'Bearer fixture-token') {
    return request(app.getHttpServer()).post('/api/jobs').set('Authorization', auth).send(body);
  }
  it('POST then GET preserves the public contract and business effect', async () => {
    const created = await post().expect(201);
    expect(created.body).toEqual(input);
    const fetched = await request(app.getHttpServer()).get('/api/jobs/job-1').set('Authorization', 'Bearer fixture-token').expect(200);
    expect(fetched.body).toEqual(input);
  });
  it.each([
    { id: '', kind: 'review' }, { id: 'job-1', kind: 'unknown' },
    { id: 'job-1', kind: 'review', internalSecret: 'synthetic' }, { kind: 'review' },
  ])('invalid DTO %j returns 400 without persistence', async body => {
    const save = jest.spyOn(repository, 'save');
    await post(body).expect(400);
    expect(save).not.toHaveBeenCalled();
  });
  it('no credential returns 401 without effects', async () => {
    const save = jest.spyOn(repository, 'save');
    await request(app.getHttpServer()).post('/api/jobs').send(input).expect(401);
    expect(save).not.toHaveBeenCalled(); expect(verifier.verify).not.toHaveBeenCalled();
  });
  it('invalid token returns 401 without effects', async () => {
    const save = jest.spyOn(repository, 'save'); await post(input, 'Bearer invalid-fixture').expect(401);
    expect(save).not.toHaveBeenCalled();
  });
  it('identity outage fails closed without exposing transport details', async () => {
    verifier.verify.mockRejectedValueOnce(new Error('synthetic-private-transport-detail'));
    const save = jest.spyOn(repository, 'save'); const result = await post().expect(401);
    expect(JSON.stringify(result.body)).not.toContain('synthetic-private-transport-detail'); expect(save).not.toHaveBeenCalled();
  });
  it('duplicate returns 409 and retains original state', async () => {
    await post().expect(201); await post({ id: 'job-1', kind: 'sync' }).expect(409);
    expect(repository.find('job-1')).toEqual(input);
  });
  it('unknown record returns 404', async () => {
    await request(app.getHttpServer()).get('/api/jobs/missing').set('Authorization', 'Bearer fixture-token').expect(404);
  });
  it('global prefix is applied just as in bootstrap', async () => {
    await request(app.getHttpServer()).post('/jobs').send(input).expect(404);
    expect(repository.find('job-1')).toBeUndefined();
  });
});
