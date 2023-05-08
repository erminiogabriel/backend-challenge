import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlacesService } from '../places.service';
import { Place } from '../entities/place.entity';
import { CreatePlaceDto } from '../dto/create-place.dto';
import { PlacesDto } from '../dto/places.dto';
import { UpdatePlaceDto } from '../dto/update-place.dto';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

const createPlaceDto: CreatePlaceDto = {
  country: 'Argentina',
  location: 'Buenos Aires',
  flagUrl: 'https://example.com/brazil.png',
  goal: '10/2023',
};

const places: PlacesDto[] = [
  {
    id: '1',
    country: 'Country 1',
    location: 'Location 1',
    goal: '01/2022',
    flagUrl: 'https://example.com/brazil.png',
    createdAt: '2023-05-07 22:12:08.131',
    updatedAt: '2023-05-07 22:12:08.131',
  },
  {
    id: '2',
    country: 'Country 2',
    location: 'Location 2',
    goal: '02/2022',
    flagUrl: 'https://example.com/brazil.png',
    createdAt: '2023-05-07 22:12:08.131',
    updatedAt: '2023-05-07 22:12:08.131',
  },
];

const placeDto: PlacesDto = {
  id: '1',
  country: 'Country 1',
  location: 'Location 1',
  goal: '01/2022',
  flagUrl: 'https://example.com/brazil.png',
  createdAt: '2023-05-07 22:12:08.131',
  updatedAt: '2023-05-07 22:12:08.131',
};

const place: Place = {
  id: 1,
  country: 'Country 1',
  location: 'Location 1',
  goal: new Date(),
  flagUrl: 'https://example.com/brazil.png',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('PlacesService', () => {
  let placesService: PlacesService;
  let placesRepository: Repository<Place>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlacesService,
        {
          provide: getRepositoryToken(Place),
          useClass: Repository,
        },
      ],
    }).compile();

    placesService = module.get<PlacesService>(PlacesService);
    placesRepository = module.get<Repository<Place>>(getRepositoryToken(Place));
  });

  describe('create', () => {
    it('should create a new place', async () => {
      jest.spyOn(placesRepository, 'findOne').mockResolvedValueOnce(undefined);
      jest.spyOn(placesRepository, 'save').mockResolvedValueOnce({
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...createPlaceDto,
        goal: new Date(2023, 9, 1),
      });

      const result = await placesService.create(createPlaceDto);

      expect(result.id).toEqual(1);
      expect(result.country).toEqual(createPlaceDto.country);
      expect(result.location).toEqual(createPlaceDto.location);
      expect(result.flagUrl).toEqual(createPlaceDto.flagUrl);
      expect(result.goal).toEqual(new Date(2023, 9, 1));
    });

    it('should throw a ConflictException if the place already exists', async () => {
      jest.spyOn(placesRepository, 'findOne').mockResolvedValueOnce({
        id: 1,
        country: createPlaceDto.country,
        location: createPlaceDto.location,
        flagUrl: createPlaceDto.flagUrl,
        goal: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(placesService.create(createPlaceDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw a BadRequestException if the goal format is invalid', async () => {
      createPlaceDto.goal = '2023/10';
      jest.spyOn(placesRepository, 'findOne').mockResolvedValueOnce(undefined);
      await expect(placesService.create(createPlaceDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of places', async () => {
      jest.spyOn(placesRepository, 'createQueryBuilder').mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValueOnce(places),
      } as any);

      const result = await placesService.findAll();
      expect(result).toEqual(places);
    });
  });

  describe('findOne', () => {
    it('should return a place with the given ID', async () => {
      jest.spyOn(placesRepository, 'createQueryBuilder').mockReturnValue({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue(placeDto),
      } as any);

      const result = await placesService.findOne(1);

      expect(result).toEqual(placeDto);
    });

    it('should throw a NotFoundException if the place is not found', async () => {
      jest.spyOn(placesRepository, 'createQueryBuilder').mockReturnValue({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue(undefined),
      } as any);

      await expect(placesService.findOne(1)).rejects.toThrowError(
        new NotFoundException(`Place with id ${placeDto.id} not found`),
      );
    });
  });

  describe('update', () => {
    it('should update a place', async () => {
      jest
        .spyOn(placesRepository, 'findOne')
        .mockResolvedValueOnce(placeDto as any);

      const updatePlaceDto = {
        location: 'Location 3',
        goal: '06/2023',
      } as UpdatePlaceDto;

      jest
        .spyOn(placesRepository, 'findOne')
        .mockResolvedValueOnce(null as any);

      jest.spyOn(placesRepository, 'update').mockResolvedValueOnce(null as any);

      await expect(
        placesService.update(1, updatePlaceDto),
      ).resolves.not.toThrow();

      expect(placesRepository.findOne).toHaveBeenCalledTimes(2);
      expect(placesRepository.update).toHaveBeenCalledTimes(1);
      expect(placesRepository.update).toHaveBeenCalledWith(1, {
        ...placeDto,
        location: updatePlaceDto.location,
        goal: new Date(2023, 5, 1),
        updatedAt: expect.any(Date),
      });
    });

    it('should throw NotFoundException if the place is not found', async () => {
      jest
        .spyOn(placesRepository, 'findOne')
        .mockResolvedValueOnce(null as any);

      const updatePlaceDto = {
        location: 'Location 3',
        goal: '06/2023',
      } as UpdatePlaceDto;

      await expect(
        placesService.update(1, updatePlaceDto),
      ).rejects.toThrowError(
        new NotFoundException(`Place with id 1 not found`),
      );
    });

    it('should throw ConflictException if another place already has the same country and location', async () => {
      jest
        .spyOn(placesRepository, 'findOne')
        .mockResolvedValueOnce(place as any);

      const existingPlace: Place = {
        id: 2,
        country: 'Country 1',
        location: 'Location 3',
        goal: new Date(),
        flagUrl: 'Flag URL 1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(placesRepository, 'findOne')
        .mockResolvedValueOnce(existingPlace as any);

      const updatePlaceDto = {
        location: 'Location 3',
        goal: '06/2023',
      } as UpdatePlaceDto;

      await expect(
        placesService.update(1, updatePlaceDto),
      ).rejects.toThrowError(
        new ConflictException(
          `Place with country '${existingPlace.country}' and location '${existingPlace.location}' already exists`,
        ),
      );
    });
  });

  describe('delete', () => {
    it('should delete a place by id', async () => {
      jest.spyOn(placesRepository, 'findOne').mockResolvedValueOnce(place);
      jest.spyOn(placesRepository, 'delete').mockResolvedValueOnce(undefined);

      await placesService.delete(place.id);

      expect(placesRepository.findOne).toHaveBeenCalledWith({
        where: { id: place.id },
      });
      expect(placesRepository.delete).toHaveBeenCalledWith(place.id);
    });

    it('should throw a NotFoundException if the place is not found', async () => {
      const placeId = 1;

      jest.spyOn(placesRepository, 'findOne').mockResolvedValueOnce(undefined);

      await expect(placesService.delete(placeId)).rejects.toThrowError(
        new NotFoundException(`Place with id ${placeId} not found`),
      );

      expect(placesRepository.findOne).toHaveBeenCalledWith({
        where: { id: placeId },
      });
    });
  });
});
