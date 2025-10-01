import { Module } from '@nestjs/common';
import { HttpClientService } from '../common/http-client.service';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';

@Module({
  controllers: [MoviesController],
  providers: [MoviesService, HttpClientService],
  exports: [MoviesService]
})
export class MoviesModule {}
