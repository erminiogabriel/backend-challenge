import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePlaceDto {
  @IsString()
  @IsNotEmpty()
  location?: string;

  @IsString()
  @IsNotEmpty()
  goal?: string;
}
