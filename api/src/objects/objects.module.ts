import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ObjectsController } from './objects.controller';
import { ObjectsService } from './objects.service';
import { ObjectDoc } from './schemas/object.schema';
import { objectSchema } from './schemas/object.schema';
import { S3Service } from './s3.service';
import { ObjectsGateway } from './objects.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ObjectDoc.name, schema: objectSchema }]),
  ],
  controllers: [ObjectsController],
  providers: [ObjectsService, S3Service, ObjectsGateway],
})
export class ObjectsModule {}
