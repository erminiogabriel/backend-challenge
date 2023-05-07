import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Place } from './entities/place.entity';

@Injectable()
export class PlacesService {
  constructor(
    @InjectRepository(Place)
    private readonly placesRepository: Repository<Place>,
  ) {}

  async create(place: Place): Promise<Place> {
    const now = new Date();
    const defaultPlace = {
      createdAt: now,
      updatedAt: now,
      ...place,
    };
    return this.placesRepository.save(defaultPlace);
  }

  async findAll(): Promise<Place[]> {
    return this.placesRepository.find({
      order: { goal: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Place> {
    return this.placesRepository.findOne({
      where: {
        id,
      },
    });
  }

  async update(id: number, updatedPlace: Place): Promise<void> {
    await this.placesRepository.update(id, updatedPlace);
  }

  async delete(id: number): Promise<void> {
    await this.placesRepository.delete(id);
  }
}
