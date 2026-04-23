import { IsString, IsInt, Min } from 'class-validator';

export class AddToCartDto {
  @IsString()
  stickerId: string;

  @IsInt()
  @Min(1)
  quantity: number = 1;
}
