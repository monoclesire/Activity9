import { IsInt, IsPositive, Min } from 'class-validator';

export class AddToCartDto {
  @IsInt()
  @IsPositive()
  productId: number;

  @IsInt()
  @Min(1)
  quantity: number = 1;
}

export class UpdateCartItemDto {
  @IsInt()
  @Min(1)
  quantity: number;
}

export class CartItemResponseDto {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  stock: number;
  productId: number;
}