import { Test, TestingModule } from '@nestjs/testing';
import { ObjectsService } from './objects.service';
import { getModelToken } from '@nestjs/mongoose';
import { ObjectDoc } from './schemas/object.schema';

// Mock du modèle Mongoose
const mockObject = {
  _id: '54g4g4g4g4gg54gg4g4g4g4g4g4',
  title: 'Test objet',
  description: 'Description test',
  imageUrl: 'https://pub-xxx.r2.dev/test.jpg',
  createdAt: new Date(),
};

const mockObjectModel = {
  create: jest.fn().mockResolvedValue(mockObject),
  find: jest.fn().mockReturnValue({
    sort: jest.fn().mockResolvedValue([mockObject]),
  }),
  findById: jest.fn().mockResolvedValue(mockObject),
  findByIdAndDelete: jest.fn().mockResolvedValue(mockObject),
};

describe('ObjectsService', () => {
  let service: ObjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ObjectsService,
        {
          provide: getModelToken(ObjectDoc.name),
          useValue: mockObjectModel,   // ← on injecte le mock à la place de Mongoose
        },
      ],
    }).compile();

    service = module.get<ObjectsService>(ObjectsService);
  });

  afterEach(() => {
    jest.clearAllMocks();   // ← remet les mocks à zéro entre chaque test
  });

  // ─────────────────────────────────────────
  describe('create()', () => {
    it('devrait créer un objet et retourner le résultat', async () => {
      const result = await service.create({
        title: 'Test objet',
        description: 'Description test',
        imageUrl: 'https://pub-xxx.r2.dev/test.jpg',
      });

      expect(mockObjectModel.create).toHaveBeenCalledWith({
        title: 'Test objet',
        description: 'Description test',
        imageUrl: 'https://pub-xxx.r2.dev/test.jpg',
      });
      expect(result).toEqual(mockObject);
    });
  });

  // ─────────────────────────────────────────
  describe('findAll()', () => {
    it('devrait retourner la liste de tous les objets', async () => {
      const result = await service.findAll();

      expect(mockObjectModel.find).toHaveBeenCalled();
      expect(result).toEqual([mockObject]);
    });
  });

  // ─────────────────────────────────────────
  describe('findOne()', () => {
    it('devrait retourner un objet par son id', async () => {
      const result = await service.findOne('54g4g4g4g4gg54gg4g4g4g4g4g4');

      expect(mockObjectModel.findById).toHaveBeenCalledWith('54g4g4g4g4gg54gg4g4g4g4g4g4');
      expect(result).toEqual(mockObject);
    });
  });

  // ─────────────────────────────────────────
  describe('remove()', () => {
    it('devrait supprimer un objet par son id', async () => {
      const result = await service.remove('54g4g4g4g4gg54gg4g4g4g4g4g4');

      expect(mockObjectModel.findByIdAndDelete).toHaveBeenCalledWith('54g4g4g4g4gg54gg4g4g4g4g4g4');
      expect(result).toEqual(mockObject);
    });
  });
});
