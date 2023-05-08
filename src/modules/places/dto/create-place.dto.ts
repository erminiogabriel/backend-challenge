import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePlaceDto {
  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsNotEmpty()
  goal: string;

  @IsString()
  @IsNotEmpty()
  flagUrl: string;
}
