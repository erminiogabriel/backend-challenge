import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Place } from './entities/place.entity';
import { CreatePlaceDto } from './dto/create-place.dto';
import { PlacesDto } from './dto/places.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';

@Injectable()
export class PlacesService {
  constructor(
    @InjectRepository(Place)
    private readonly placesRepository: Repository<Place>,
  ) {}

  async create(place: CreatePlaceDto): Promise<Place> {
    const existingPlace = await this.placesRepository.findOne({
      where: {
        country: place.country,
        location: place.location,
      },
    });

    if (existingPlace) {
      throw new ConflictException(
        `Place with country '${place.country}' and location '${place.location}' already exists`,
      );
    }

    const goalRegex = /^(0?[1-9]|1[0-2])\/\d{4}$/;
    if (!goalRegex.test(place.goal)) {
      throw new BadRequestException(
        'Invalid format for goal, it should be MM/YYYY',
      );
    }

    const now = new Date();
    const [month, year] = place.goal.split('/');
    const defaultPlace = {
      createdAt: now,
      updatedAt: now,
      country: place.country,
      location: place.location,
      flagUrl: place.flagUrl,
      goal: new Date(parseInt(year), parseInt(month) - 1, 1),
    };
    return this.placesRepository.save(defaultPlace);
  }

  async findAll(): Promise<PlacesDto[]> {
    return this.placesRepository
      .createQueryBuilder('place')
      .select([
        'place.id',
        'place.country',
        'place.location',
        `to_char(place.goal, 'MM/YYYY') as "place_goal"`,
        'place.flagUrl',
        'place.createdAt',
        'place.updatedAt',
      ])
      .orderBy('place.goal', 'ASC')
      .getRawMany();
  }

  async findOne(id: number): Promise<PlacesDto> {
    const place = await this.placesRepository
      .createQueryBuilder('place')
      .select([
        'place.id',
        'place.country',
        'place.location',
        `to_char(place.goal, 'MM/YYYY') as "place_goal"`,
        'place.flagUrl',
        'place.createdAt',
        'place.updatedAt',
      ])
      .where('place.id = :id', { id })
      .getRawOne();
    if (!place) {
      throw new NotFoundException(`Place with id ${id} not found`);
    }

    return place;
  }

  async update(id: number, updatedPlace: UpdatePlaceDto): Promise<void> {
    const place = await this.placesRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!place) {
      throw new NotFoundException(`Place with id ${id} not found`);
    }

    if (updatedPlace.location && updatedPlace.location !== place.location) {
      const existingPlace = await this.placesRepository.findOne({
        where: {
          country: place.country,
          location: updatedPlace.location,
        },
      });

      if (existingPlace) {
        console.log(updatedPlace.location);
        throw new ConflictException(
          `Place with country '${existingPlace.country}' and location '${existingPlace.location}' already exists`,
        );
      }

      place.location = updatedPlace.location;
    }

    if (updatedPlace.goal) {
      const goalRegex = /^(0?[1-9]|1[0-2])\/\d{4}$/;
      if (!goalRegex.test(updatedPlace.goal)) {
        throw new BadRequestException(
          'Invalid format for goal, it should be MM/YYYY',
        );
      }

      const [month, year] = updatedPlace.goal.split('/');
      place.goal = new Date(parseInt(year), parseInt(month) - 1, 1);
    }

    place.updatedAt = new Date();
    await this.placesRepository.update(id, place);
  }

  async delete(id: number): Promise<void> {
    const place = await this.placesRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!place) {
      throw new NotFoundException(`Place with id ${id} not found`);
    }

    await this.placesRepository.delete(id);
  }
}
