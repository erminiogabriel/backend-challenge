import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { Place } from './entities/place.entity';
import { PlacesService } from './places.service';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Post()
  async create(@Body() place: Place): Promise<Place> {
    return await this.placesService.create(place);
  }

  @Get()
  async findAll(): Promise<Place[]> {
    return await this.placesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Place> {
    return await this.placesService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() place: Place): Promise<void> {
    await this.placesService.update(id, place);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    await this.placesService.delete(id);
  }
}
