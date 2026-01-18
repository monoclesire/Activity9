import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from './cart.entity';
import { Product } from '../products/entities/product.entity';
import { AddToCartDto, UpdateCartItemDto, CartItemResponseDto } from './dto/cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private cartRepository,
    @InjectRepository(Product)
    private productRepository,
  ) {}

  async addToCart(userId: number, addToCartDto: AddToCartDto): Promise<CartItemResponseDto> {
    const { productId, quantity } = addToCartDto;

    // Check if product exists and has enough stock
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.stock < quantity) {
      throw new BadRequestException('Insufficient stock available');
    }

    // Check if item already exists in cart
    let cartItem = await this.cartRepository.findOne({
      where: { userId, productId },
      relations: ['product']
    });

    if (cartItem) {
      // Update quantity if item exists
      const newQuantity = cartItem.quantity + quantity;
      
      if (product.stock < newQuantity) {
        throw new BadRequestException('Insufficient stock available');
      }

      cartItem.quantity = newQuantity;
      await this.cartRepository.save(cartItem);
    } else {
      // Create new cart item
      cartItem = this.cartRepository.create({
        userId,
        productId,
        quantity
      });
      await this.cartRepository.save(cartItem);
      
      const savedCartItem = await this.cartRepository.findOne({
        where: { id: cartItem.id },
        relations: ['product']
      });
      
      if (!savedCartItem) {
        throw new NotFoundException('Failed to create cart item');
      }
      
      cartItem = savedCartItem;
    }

    return this.mapToResponseDto(cartItem);
  }

  async getCart(userId: number): Promise<CartItemResponseDto[]> {
    const cartItems = await this.cartRepository.find({
      where: { userId },
      relations: ['product']
    });

    return cartItems.map(item => this.mapToResponseDto(item));
  }

  async updateCartItem(userId: number, cartItemId: number, updateDto: UpdateCartItemDto): Promise<CartItemResponseDto> {
    const cartItem = await this.cartRepository.findOne({
      where: { id: cartItemId, userId },
      relations: ['product']
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    if (cartItem.product.stock < updateDto.quantity) {
      throw new BadRequestException('Insufficient stock available');
    }

    cartItem.quantity = updateDto.quantity;
    await this.cartRepository.save(cartItem);

    return this.mapToResponseDto(cartItem);
  }

  async removeFromCart(userId: number, cartItemId: number): Promise<void> {
    const result = await this.cartRepository.delete({ id: cartItemId, userId });
    
    if (result.affected === 0) {
      throw new NotFoundException('Cart item not found');
    }
  }

  async clearCart(userId: number): Promise<void> {
    await this.cartRepository.delete({ userId });
  }

  async getCartItemsWithProducts(userId: number) {
    return this.cartRepository.find({
      where: { userId },
      relations: ['product']
    });
  }

  private mapToResponseDto(cartItem: CartItem): CartItemResponseDto {
    return {
      id: cartItem.id,
      productId: cartItem.product.id,
      name: cartItem.product.name,
      description: cartItem.product.description,
      price: Number(cartItem.product.price),
      quantity: cartItem.quantity,
      stock: cartItem.product.stock
    };
  }
}