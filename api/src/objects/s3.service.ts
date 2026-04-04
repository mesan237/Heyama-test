import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

@Injectable()
export class S3Service {
  private client: S3Client;
  private bucket: string;
  private publicUrl: string;

  constructor(private config: ConfigService) {
    this.bucket = this.config.get<string>('S3_BUCKET_NAME') || '';
    this.publicUrl = this.config.get<string>('S3_PUBLIC_URL') || '';

    this.client = new S3Client({
      endpoint: this.config.get<string>('S3_ENDPOINT') || '',
      region: 'auto',
      credentials: {
        accessKeyId: this.config.get<string>('S3_ACCESS_KEY') || '',
        secretAccessKey: this.config.get<string>('S3_SECRET_KEY') || '',
      },
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const key = `${Date.now()}-${file.originalname}`;

    await new Upload({
      client: this.client,
      params: {
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      },
    }).done();

    return `${this.publicUrl}/${key}`;
  }

  async deleteFile(imageUrl: string): Promise<void> {
    const key = imageUrl.split('/').pop();

    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }
}