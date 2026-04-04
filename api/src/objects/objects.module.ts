import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ObjectsController } from './objects.controller';
import { ObjectsService } from './objects.service';
import { ObjectDoc } from './schemas/object.schema';
import { objectSchema } from './schemas/object.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: ObjectDoc.name, schema: objectSchema }])],
  controllers: [ObjectsController],
  providers: [ObjectsService],
})
export class ObjectsModule {}
