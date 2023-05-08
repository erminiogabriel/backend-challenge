import { Test, TestingModule } from '@nestjs/testing';
import { PlacesController } from '../places.controller';
import { PlacesService } from '../places.service';
import { CreatePlaceDto } from '../dto/create-place.dto';
import { UpdatePlaceDto } from '../dto/update-place.dto';
import { Place } from '../entities/place.entity';
import { PlacesDto } from '../dto/places.dto';

describe('PlacesController', () => {
  let controller: PlacesController;
  let service: PlacesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlacesController],
      providers: [
        {
          provide: PlacesService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PlacesController>(PlacesController);
    service = module.get<PlacesService>(PlacesService);
  });

  describe('create', () => {
    it('should call service.create with the correct arguments and return the created place', async () => {
      const createPlaceDto: CreatePlaceDto = {
        country: 'Brazil',
        location: 'Rio de Janeiro',
        goal: '06/2023',
        flagUrl: 'https://example.com/brazil.png',
      };
      const createdPlace: Place = {
        id: 1,
        country: createPlaceDto.country,
        location: createPlaceDto.location,
        goal: new Date(),
        flagUrl: createPlaceDto.flagUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(service, 'create').mockResolvedValueOnce(createdPlace);

      const result = await controller.create(createPlaceDto);

      expect(service.create).toHaveBeenCalledWith(createPlaceDto);
      expect(result).toEqual(createdPlace);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll and return the list of places', async () => {
      const places: PlacesDto[] = [
        {
          id: '1',
          country: 'Brazil',
          location: 'Rio de Janeiro',
          goal: '06/2023',
          flagUrl: 'https://example.com/brazil.png',
          createdAt: '2023-05-07 22:12:08.131',
          updatedAt: '2023-05-07 22:12:08.131',
        },
      ];
      jest.spyOn(service, 'findAll').mockResolvedValueOnce(places);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(places);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with the correct id and return the place', async () => {
      const id = 1;
      const place: PlacesDto = {
        id: id.toString(),
        country: 'Brazil',
        location: 'Rio de Janeiro',
        goal: '06/2023',
        flagUrl: 'https://example.com/brazil.png',
        createdAt: '2023-05-07 22:12:08.131',
        updatedAt: '2023-05-07 22:12:08.131',
      };
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(place);

      const result = await controller.findOne(id);

      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual(place);
    });
  });

  describe('update', () => {
    it('should call service.update with the correct arguments', async () => {
      const id = 1;
      const updatePlaceDto: UpdatePlaceDto = {
        location: 'São Paulo',
        goal: '07/2023',
      };

      await controller.update(id, updatePlaceDto);

      expect(service.update).toHaveBeenCalledWith(id, updatePlaceDto);
    });
  });

  describe('delete', () => {
    it('should call service.delete with the correct id', async () => {
      const id = 1;
      await controller.delete(id);

      expect(service.delete).toHaveBeenCalledWith(id);
    });
  });
});
