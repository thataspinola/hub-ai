import {
  getFeatureFlagProject,
  listFeatureFlagProjects,
  saveFeatureFlagProject,
} from '@/lib/feature-flags/s3-storage';

const sendMock = jest.fn();

jest.mock('@aws-sdk/client-s3', () => {
  class MockCommand {
    input: unknown;

    constructor(input: unknown) {
      this.input = input;
    }
  }

  return {
    GetObjectCommand: MockCommand,
    ListObjectsV2Command: MockCommand,
    PutObjectCommand: MockCommand,
    S3Client: jest.fn().mockImplementation(() => ({
      send: sendMock,
    })),
  };
});

import {
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

describe('s3-storage', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = {
      ...originalEnv,
      S3_BUCKET: 'porto-seguro-pages-s3--prd',
      S3_PATH_PREFIX_HML: 'assets/feature-flags/{project}/flags.json',
      AWS_REGION: 'sa-east-1',
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('salva flags.json no path correto do projeto', async () => {
    sendMock.mockResolvedValueOnce({});

    await saveFeatureFlagProject({
      version: '1.0.0',
      name: 'consorcio-widget',
      flags: [],
    });

    expect(S3Client).toHaveBeenCalledWith({ region: 'sa-east-1' });
    expect(sendMock).toHaveBeenCalledWith(expect.any(PutObjectCommand));
    const command = sendMock.mock.calls[0][0] as PutObjectCommand;
    expect(command.input).toMatchObject({
      Bucket: 'porto-seguro-pages-s3--prd',
      Key: 'assets/feature-flags/consorcio-widget/flags.json',
      ContentType: 'application/json; charset=utf-8',
      CacheControl: 'max-age=60',
    });
    expect(command.input.Body).toContain('"name": "consorcio-widget"');
  });

  it('lê um projeto do S3', async () => {
    sendMock.mockResolvedValueOnce({
      Body: {
        transformToString: async () => JSON.stringify({
          version: '1.0.0',
          name: 'consorcio-widget',
          flags: [],
        }),
      },
    });

    const project = await getFeatureFlagProject('consorcio-widget');

    expect(sendMock).toHaveBeenCalledWith(expect.any(GetObjectCommand));
    expect(project.name).toBe('consorcio-widget');
  });

  it('retorna documento vazio quando o flags.json ainda não existe', async () => {
    const error = new Error('Not found');
    error.name = 'NoSuchKey';
    sendMock.mockRejectedValueOnce(error);

    const project = await getFeatureFlagProject('novo-widget');

    expect(project).toEqual({
      version: '1.0.0',
      name: 'novo-widget',
      flags: [],
    });
  });

  it('lista projetos a partir dos objetos flags.json', async () => {
    sendMock
      .mockResolvedValueOnce({
        Contents: [
          { Key: 'assets/feature-flags/consorcio-widget/flags.json' },
        ],
      })
      .mockResolvedValueOnce({
        Body: {
          transformToString: async () => JSON.stringify({
            version: '1.0.0',
            name: 'consorcio-widget',
            flags: [],
          }),
        },
      });

    const store = await listFeatureFlagProjects();

    expect(sendMock.mock.calls[0][0]).toBeInstanceOf(ListObjectsV2Command);
    expect(store.projects).toHaveLength(1);
    expect(store.projects[0].name).toBe('consorcio-widget');
  });

  it('retorna lista vazia quando o bucket ainda não tem estrutura por projeto', async () => {
    sendMock.mockResolvedValueOnce({
      Contents: [
        { Key: 'assets/feature-flags/' },
        { Key: 'assets/feature-flags/flags.json' },
      ],
    });

    const store = await listFeatureFlagProjects();

    expect(store).toEqual({ projects: [] });
  });
});
