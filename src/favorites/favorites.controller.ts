import { Controller, Get, Post, Delete, Param, Body, NotFoundException, ConflictException } from '@nestjs/common';
import { AddFavoriteDto } from './dto/favorite.dto';
import { FavoritesService } from './favorites.service';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  getAll() {
    return this.favoritesService.getAll();
  }

  @Post()
  async add(@Body() body: AddFavoriteDto) {
    const added = await this.favoritesService.addFavorite(body.imdbID);
    if (!added) {
      throw new NotFoundException('Movie not found in OMDb');
    }
    return added;
  }

  @Delete(':imdbID')
  remove(@Param('imdbID') imdbID: string) {
    const removed = this.favoritesService.removeFavorite(imdbID);
    if (!removed) {
      throw new NotFoundException('Favorite not found');
    }
    return { success: true };
  }
}
