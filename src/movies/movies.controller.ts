import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { SearchMoviesDto } from './dto/search-movies.dto';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  async search(@Query() query: SearchMoviesDto) {
    if (!query.query) {
      throw new BadRequestException('query parameter is required');
    }
    return this.moviesService.searchMovies(query.query, query.page ?? 1);
  }
}
