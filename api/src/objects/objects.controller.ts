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
import { ObjectsGateway } from './objects.gateway';

@Controller('objects')
export class ObjectsController {
  constructor(
    private readonly objectsService: ObjectsService,
    private readonly s3Service: S3Service,
    private readonly gateway: ObjectsGateway,
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
    await this.objectsService.remove(id); // supprime de MongoDB
    this.gateway.notifyDeletedObject(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { title: string; description: string },
  ) {
    const imageUrl = await this.s3Service.uploadFile(file);
    const object = await this.objectsService.create({ ...body, imageUrl });
    this.gateway.notifyNewObject(object);
    return object;
  }
}
