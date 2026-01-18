import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  async addToCart(@Body() body: { userId: number; productId: number; quantity: number }) {
    return this.cartService.addToCart(body.userId, {
      productId: body.productId,
      quantity: body.quantity
    });
  }

  @Get('user/:userId')
  async getCart(@Param('userId') userId: string) {
    return this.cartService.getCart(+userId);
  }

  @Put(':id')
  async updateCartItem(
    @Param('id') id: string,
    @Body() body: { userId: number; quantity: number }
  ) {
    return this.cartService.updateCartItem(body.userId, +id, { quantity: body.quantity });
  }

  @Delete(':id')
  async removeFromCart(@Param('id') id: string, @Body() body: { userId: number }) {
    await this.cartService.removeFromCart(body.userId, +id);
    return { message: 'Item removed from cart' };
  }

  @Delete('user/:userId')
  async clearCart(@Param('userId') userId: string) {
    await this.cartService.clearCart(+userId);
    return { message: 'Cart cleared' };
  }
}