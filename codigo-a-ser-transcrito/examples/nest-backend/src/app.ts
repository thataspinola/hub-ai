import 'reflect-metadata';
import {
  Body, CanActivate, ConflictException, Controller, ExecutionContext, Get,
  INestApplication, Injectable, Module, NotFoundException, Param, Post,
  UnauthorizedException, UseGuards, ValidationPipe,
} from '@nestjs/common';
import { IsIn, IsString, Matches } from 'class-validator';

export class CreateJobDto {
  @IsString()
  @Matches(/^[a-z0-9-]{1,40}$/)
  id!: string;

  @IsIn(['sync', 'review'])
  kind!: 'sync' | 'review';
}
export interface Job { id: string; kind: 'sync' | 'review'; }
@Injectable()
export class JobsRepository {
  private readonly jobs = new Map<string, Job>();
  find(id: string): Job | undefined { return this.jobs.get(id); }
  save(job: Job): void { this.jobs.set(job.id, { ...job }); }
}
@Injectable()
export class JobsService {
  constructor(private readonly repository: JobsRepository) {}
  create(input: CreateJobDto): Job {
    if (this.repository.find(input.id)) throw new ConflictException('Job already exists');
    const job: Job = { id: input.id, kind: input.kind };
    this.repository.save(job);
    return job;
  }
  find(id: string): Job {
    const job = this.repository.find(id);
    if (!job) throw new NotFoundException('Job not found');
    return job;
  }
}
// Replace this boundary with the project's real identity adapter. Default denies all.
@Injectable()
export class TokenVerifier {
  async verify(_token: string): Promise<boolean> { return false; }
}
@Injectable()
export class AccessGuard implements CanActivate {
  constructor(private readonly verifier: TokenVerifier) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{ headers: { authorization?: string } }>();
    const match = request.headers.authorization?.match(/^Bearer (\S+)$/);
    if (!match) throw new UnauthorizedException();
    let valid = false;
    try { valid = await this.verifier.verify(match[1]); } catch { /* Fail closed; no transport secrets. */ }
    if (!valid) throw new UnauthorizedException();
    return true;
  }
}
@Controller('jobs')
@UseGuards(AccessGuard)
export class JobsController {
  constructor(private readonly jobs: JobsService) {}
  @Post()
  create(@Body() input: CreateJobDto): Job { return this.jobs.create(input); }
  @Get(':id')
  find(@Param('id') id: string): Job { return this.jobs.find(id); }
}
@Module({ controllers: [JobsController], providers: [JobsService, JobsRepository, TokenVerifier, AccessGuard] })
export class AppModule {}
// Called by both bootstrap and HTTP tests: compile() alone does not apply these settings.
export function configureApp(app: INestApplication): void {
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }));
}
