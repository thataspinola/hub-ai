import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JobsRepository, JobsService } from '../src/app';
describe('JobsService unit: isolated persistence', () => {
  let module: TestingModule, service: JobsService;
  const repository = { find: jest.fn(), save: jest.fn() };
  beforeEach(async () => {
    module = await Test.createTestingModule({ providers: [JobsService, JobsRepository] })
      .overrideProvider(JobsRepository).useValue(repository).compile();
    service = module.get(JobsService);
  });
  afterEach(async () => { await module.close(); });
  it('saves and returns the allowed public fields', () => {
    repository.find.mockReturnValue(undefined);
    const job = service.create({ id: 'job-1', kind: 'review' });
    expect(job).toEqual({ id: 'job-1', kind: 'review' });
    expect(repository.save).toHaveBeenCalledWith(job);
  });
  it('rejects duplicates before persistence', () => {
    repository.find.mockReturnValue({ id: 'job-1', kind: 'review' });
    expect(() => service.create({ id: 'job-1', kind: 'review' })).toThrow(ConflictException);
    expect(repository.save).not.toHaveBeenCalled();
  });
  it('fails explicitly for an unknown job', () => {
    repository.find.mockReturnValue(undefined);
    expect(() => service.find('missing')).toThrow(NotFoundException);
  });
});
