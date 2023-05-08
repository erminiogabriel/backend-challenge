import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class PlacesDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsDateString()
  @IsNotEmpty()
  goal: string;

  @IsString()
  @IsNotEmpty()
  flagUrl: string;

  @IsString()
  @IsNotEmpty()
  createdAt: string;

  @IsString()
  @IsNotEmpty()
  updatedAt: string;
}
