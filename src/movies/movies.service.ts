import { Injectable, InternalServerErrorException, BadGatewayException } from '@nestjs/common';
import { HttpClientService } from '../common/http-client.service';
import { Movie } from '../shared/movie.interface';

@Injectable()
export class MoviesService {
  constructor(private readonly http: HttpClientService) {}

  async searchMovies(query: string, page = 1): Promise<{ page: number; totalResults: number; movies: Movie[] }> {
    try {
      const params = {
        s: query,
        page
      };
      const res = await this.http.client.get('', { params });
      const data = res.data;
      if (data.Error) {
        return { page, totalResults: 0, movies: [] };
      }
      const totalResults = parseInt(data.totalResults ?? '0', 10);
      const movies: Movie[] = (data.Search || []).map((m: any) => ({
        imdbID: m.imdbID,
        Title: m.Title,
        Year: m.Year,
        Poster: m.Poster || 'N/A'
      }));
      return { page, totalResults, movies };
    } catch (err) {
      throw new BadGatewayException('Failed to fetch from OMDb');
    }
  }

  async getMovieById(imdbID: string): Promise<Movie | null> {
    try {
      const res = await this.http.client.get('', { params: { i: imdbID, plot: 'short' } });
      const data = res.data;
      if (!data || data.Response === 'False') return null;
      const movie: Movie = {
        imdbID: data.imdbID,
        Title: data.Title,
        Year: data.Year,
        Poster: data.Poster || 'N/A'
      };
      return movie;
    } catch (err) {
      throw new BadGatewayException('Failed to fetch from OMDb');
    }
  }
}
