import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlacesModule } from './modules/places/places.module';
import 'dotenv/config';
import { Place } from './modules/places/entities/place.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Place],
      synchronize: false,
    }),
    PlacesModule,
  ],
})
export class AppModule {}
