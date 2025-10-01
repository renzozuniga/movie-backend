import { Injectable, Logger } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import { MoviesService } from '../movies/movies.service';
import { Movie } from '../shared/movie.interface';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const FILE_PATH = path.join(DATA_DIR, 'favorites.json');

@Injectable()
export class FavoritesService {
  private logger = new Logger(FavoritesService.name);
  private favorites: Map<string, Movie> = new Map();

  constructor(private readonly moviesService: MoviesService) {
    this.loadFromDisk().catch((err) => {
      this.logger.debug('No favorites file found or error reading it, starting empty.');
    });
  }

  private async loadFromDisk() {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      const content = await fs.readFile(FILE_PATH, 'utf-8');
      const arr: Movie[] = JSON.parse(content);
      this.favorites = new Map(arr.map((m) => [m.imdbID, m]));
      this.logger.log(`Loaded ${this.favorites.size} favorites from disk`);
    } catch (err) {
      this.logger.debug('Creating empty favorites file');
      await this.saveToDisk();
    }
  }

  private async saveToDisk() {
    const arr = Array.from(this.favorites.values());
    await fs.mkdir(DATA_DIR, { recursive: true });
    const tmp = FILE_PATH + '.tmp';
    await fs.writeFile(tmp, JSON.stringify(arr, null, 2), 'utf-8');
    await fs.rename(tmp, FILE_PATH);
  }

  async getAll(): Promise<Movie[]> {
    return Array.from(this.favorites.values());
  }

  async addFavorite(imdbID: string): Promise<Movie | null> {
    if (this.favorites.has(imdbID)) {
      return this.favorites.get(imdbID) ?? null;
    }
    const movie = await this.moviesService.getMovieById(imdbID);
    if (!movie) return null;
    this.favorites.set(imdbID, movie);
    await this.saveToDisk();
    return movie;
  }

  removeFavorite(imdbID: string): boolean {
    const existed = this.favorites.delete(imdbID);
    if (existed) {
      this.saveToDisk().catch((err) => this.logger.error('Failed to persist favorites', err));
    }
    return existed;
  }
}
