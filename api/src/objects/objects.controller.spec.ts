import { Test, TestingModule } from '@nestjs/testing';
import { ObjectsController } from './objects.controller';
import { ObjectsService } from './objects.service';
import { S3Service } from './s3.service';
import { ObjectsGateway } from './objects.gateway';

describe('ObjectsController', () => {
  let controller: ObjectsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ObjectsController],
      providers: [
        {
          provide: ObjectsService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: S3Service,
          useValue: {
            deleteFile: jest.fn(),
          },
        },
        {
          provide: ObjectsGateway,
          useValue: {
            notifyDeletedObject: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ObjectsController>(ObjectsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
