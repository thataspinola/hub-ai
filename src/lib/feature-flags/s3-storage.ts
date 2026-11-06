import {
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import {
  normalizeFeatureFlagDocument,
  type FeatureFlagDocument,
  type FeatureFlagProjectStore,
  SEED_PROJECT_STORE,
} from './crud-storage';

const DEFAULT_FLAGS_KEY_TEMPLATE = 'assets/feature-flags/{project}/flags.json';
const S3_CACHE_CONTROL = 'max-age=60';

function getBucket(): string | undefined {
  return process.env.S3_BUCKET || process.env.FEATURE_FLAGS_S3_BUCKET;
}

function getKeyTemplate(): string {
  return process.env.S3_PATH_PREFIX_HML || process.env.FEATURE_FLAGS_S3_KEY_TEMPLATE || DEFAULT_FLAGS_KEY_TEMPLATE;
}

function getPrefix(): string {
  const template = getKeyTemplate();
  const markerIndex = template.indexOf('{project}');
  return markerIndex >= 0 ? template.slice(0, markerIndex) : 'assets/feature-flags/';
}

function getKey(projectName: string): string {
  return getKeyTemplate().replace('{project}', projectName);
}

function getConfiguredProjects(): string[] {
  return (process.env.FEATURE_FLAGS_PROJECTS ?? '')
    .split(',')
    .map(project => project.trim())
    .filter(Boolean);
}

function getS3Client(): S3Client {
  return new S3Client({
    region: process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'us-east-1',
  });
}

function isS3Configured(): boolean {
  return Boolean(getBucket());
}

function isMissingS3Object(error: unknown): boolean {
  return Boolean(
    error &&
    typeof error === 'object' &&
    'name' in error &&
    (error.name === 'NoSuchKey' || error.name === 'NotFound'),
  );
}

async function bodyToString(body: unknown): Promise<string> {
  if (!body) return '';

  if (typeof body === 'string') return body;

  if (typeof body === 'object' && 'transformToString' in body && typeof body.transformToString === 'function') {
    return body.transformToString();
  }

  if (body instanceof Uint8Array) {
    return new TextDecoder().decode(body);
  }

  throw new Error('Unsupported S3 body type');
}

async function readProject(projectName: string): Promise<FeatureFlagDocument> {
  const bucket = getBucket();
  if (!bucket) {
    const fallback = SEED_PROJECT_STORE.projects.find(project => project.name === projectName);
    return fallback ?? { version: '1.0.0', name: projectName, flags: [] };
  }

  try {
    const response = await getS3Client().send(new GetObjectCommand({
      Bucket: bucket,
      Key: getKey(projectName),
    }));

    const raw = await bodyToString(response.Body);
    return normalizeFeatureFlagDocument(JSON.parse(raw));
  } catch (error) {
    if (isMissingS3Object(error)) {
      return { version: '1.0.0', name: projectName, flags: [] };
    }

    throw error;
  }
}

export async function listFeatureFlagProjects(): Promise<FeatureFlagProjectStore> {
  if (!isS3Configured()) return SEED_PROJECT_STORE;

  const configuredProjects = getConfiguredProjects();
  if (configuredProjects.length > 0) {
    const projects = await Promise.all(configuredProjects.map(readProject));
    return { projects };
  }

  const bucket = getBucket();
  if (!bucket) return SEED_PROJECT_STORE;

  const response = await getS3Client().send(new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: getPrefix(),
  }));

  const projectNames = (response.Contents ?? [])
    .map(object => object.Key)
    .filter((key): key is string => Boolean(key))
    .map(key => key.slice(getPrefix().length).match(/^(.+)\/flags\.json$/)?.[1])
    .filter((projectName): projectName is string => Boolean(projectName));

  if (projectNames.length === 0) return { projects: [] };

  const projects = await Promise.all(projectNames.map(readProject));
  return { projects };
}

export async function getFeatureFlagProject(projectName: string): Promise<FeatureFlagDocument> {
  return readProject(projectName);
}

export async function saveFeatureFlagProject(document: FeatureFlagDocument): Promise<FeatureFlagDocument> {
  const normalizedDocument = normalizeFeatureFlagDocument(document);
  const bucket = getBucket();

  if (!bucket) return normalizedDocument;

  await getS3Client().send(new PutObjectCommand({
    Bucket: bucket,
    Key: getKey(normalizedDocument.name),
    Body: JSON.stringify(normalizedDocument, null, 2),
    ContentType: 'application/json; charset=utf-8',
    CacheControl: S3_CACHE_CONTROL,
  }));

  return normalizedDocument;
}

export function getPublicFeatureFlagUrl(projectName: string): string {
  const baseUrl = process.env.FEATURE_FLAGS_PUBLIC_BASE_URL || 'https://www.portoseguro.com.br';
  return `${baseUrl.replace(/\/$/, '')}/${getKey(projectName)}`;
}
