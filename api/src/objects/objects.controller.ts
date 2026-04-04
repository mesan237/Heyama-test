import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ObjectsService } from './objects.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { S3Service } from './s3.service';

@Controller('objects')
export class ObjectsController {
  constructor(
    private readonly objectsService: ObjectsService,
    private readonly s3Service: S3Service,
  ) {}

  @Get()
  findAll() {
    return this.objectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.objectsService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const object = await this.objectsService.findOne(id);
    if (object) {
      await this.s3Service.deleteFile(object.imageUrl); // supprime de R2
    }
    return this.objectsService.remove(id); // supprime de MongoDB
  }

  @Post()
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { title: string; description: string },
  ) {
    const imageUrl = await this.s3Service.uploadFile(file);
    return this.objectsService.create({ ...body, imageUrl });
  }
}
