import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectDoc } from './schemas/object.schema';

@Injectable()
export class ObjectsService {
  constructor(
    @InjectModel(ObjectDoc.name) private objectModel: Model<ObjectDoc>,
  ) {}

  async create(data: { title: string; description: string; imageUrl: string }) {
    return this.objectModel.create(data);
  }

  async findAll() {
    return this.objectModel.find().sort({ createdAt: -1 });
  }

  async findOne(id: string) {
    return this.objectModel.findById(id);
  }

  async remove(id: string) {
    return this.objectModel.findByIdAndDelete(id);
  }
}
