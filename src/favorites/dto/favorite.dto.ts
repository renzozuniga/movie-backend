import { IsString, IsNotEmpty } from 'class-validator';

export class AddFavoriteDto {
  @IsString()
  @IsNotEmpty()
  imdbID!: string;
}
