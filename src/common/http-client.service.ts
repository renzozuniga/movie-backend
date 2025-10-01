import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class HttpClientService {
  public readonly client: AxiosInstance;

  constructor() {
    const baseURL = process.env.OMDB_BASE_URL || 'http://www.omdbapi.com/';
    this.client = axios.create({
      baseURL,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        apikey: process.env.OMDB_API_KEY,
      }
    });
  }
}
