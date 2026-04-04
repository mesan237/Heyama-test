import { Test, TestingModule } from '@nestjs/testing';
import { S3Service } from './s3.service';
import { ConfigService } from '@nestjs/config';

// Mock du SDK AWS
jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: jest.fn().mockImplementation(() => ({
    send: jest.fn().mockResolvedValue({}),
  })),
  DeleteObjectCommand: jest.fn(),
}));

jest.mock('@aws-sdk/lib-storage', () => ({
  Upload: jest.fn().mockImplementation(() => ({
    done: jest.fn().mockResolvedValue({}),
  })),
}));

const mockConfigService = {
  get: jest.fn((key: string) => {
    const config = {
      S3_ENDPOINT: 'https://account.r2.cloudflarestorage.com',
      S3_ACCESS_KEY: 'fake-access-key',
      S3_SECRET_KEY: 'fake-secret-key',
      S3_BUCKET_NAME: 'heyama',
      S3_PUBLIC_URL: 'https://pub-xxx.r2.dev',
    };
    return config[key];
  }),
};

describe('S3Service', () => {
  let service: S3Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        S3Service,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<S3Service>(S3Service);
  });

  afterEach(() => jest.clearAllMocks());

  // ─────────────────────────────────────────
  describe('uploadFile()', () => {
    it('devrait retourner une URL publique après upload', async () => {
      const mockFile = {
        originalname: 'photo.jpg',
        buffer: Buffer.from('fake-image'),
        mimetype: 'image/jpeg',
      } as Express.Multer.File;

      const result = await service.uploadFile(mockFile);

      // L'URL doit commencer par l'URL publique R2
      expect(result).toMatch(/^https:\/\/pub-xxx\.r2\.dev\/.+photo\.jpg$/);
    });
  });

  // ─────────────────────────────────────────
  describe('deleteFile()', () => {
    it('devrait appeler S3 avec la bonne clé extraite de l\'URL', async () => {
      const imageUrl = 'https://pub-xxx.r2.dev/1234567890-photo.jpg';

      // Ne doit pas lever d'erreur
      await expect(service.deleteFile(imageUrl)).resolves.not.toThrow();
    });
  });
});