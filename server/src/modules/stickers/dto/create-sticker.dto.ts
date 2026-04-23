import { IsString, IsNumber, IsUrl, IsInt, Min } from 'class-validator';

export class CreateStickerDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsUrl()
  imageUrl: string;

  @IsString()
  category: string;

  @IsInt()
  @Min(0)
  stock: number;
}
