import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty({ message: 'Field "$property" is required.' })
  name: string;

  @IsUrl({}, { message: 'Field "$property" must be a url.' })
  @IsNotEmpty({ message: 'Field "$property" is required.' })
  coverImgUrl: string;
}
