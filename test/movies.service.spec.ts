import { Test, TestingModule } from '@nestjs/testing';
import { HttpClientService } from '../src/common/http-client.service';
import { MoviesService } from '../src/movies/movies.service';
import axios from 'axios';

jest.mock('axios');

describe('MoviesService', () => {
  let service: MoviesService;
  let httpClient: HttpClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService, HttpClientService]
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    httpClient = module.get<HttpClientService>(HttpClientService);
  });

  it('maps OMDb search response to movies list', async () => {
    const mockData = {
      data: {
        Search: [
          { imdbID: 'tt123', Title: 'Test Movie', Year: '2020', Poster: 'N/A' }
        ],
        totalResults: '1',
        Response: 'True'
      }
    };
    (httpClient.client.get as any) = jest.fn().mockResolvedValue(mockData);
    const res = await service.searchMovies('test', 1);
    expect(res.totalResults).toBe(1);
    expect(res.movies[0].imdbID).toBe('tt123');
  });
});
