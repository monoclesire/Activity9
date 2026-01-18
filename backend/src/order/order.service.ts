import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Order, OrderItem, OrderStatus } from './entities/order.entity';
import { Product } from '../products/entities/product.entity';
import { CartService } from '../cart/cart.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository,
    @InjectRepository(OrderItem)
    private orderItemRepository,
    @InjectRepository(Product)
    private productRepository,
    private cartService: CartService,
    private dataSource: DataSource,
  ) {}

  async checkout(userId: number, userData: { fullName: string; email: string }): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Get cart items
      const cartItems = await this.cartService.getCartItemsWithProducts(userId);

      if (cartItems.length === 0) {
        throw new BadRequestException('Cart is empty');
      }

      // 2. Validate stock
      for (const cartItem of cartItems) {
        const product = await queryRunner.manager.findOne(Product, {
          where: { id: cartItem.productId }
        });

        if (!product) {
          throw new NotFoundException(`Product not found`);
        }

        const productStock = product['stock'] || 0;
        
        if (productStock < cartItem.quantity) {
          throw new BadRequestException(
            `Insufficient stock. Available: ${productStock}, Requested: ${cartItem.quantity}`
          );
        }
      }

      // 3. Generate order number
      const orderNumber = await this.generateOrderNumber();

      // 4. Calculate total
      const total = cartItems.reduce(
        (sum, item) => {
          const price = item.product?.price || 0;
          return sum + Number(price) * item.quantity;
        },
        0
      );

      // 5. Create order with COMPLETED status
      const order = queryRunner.manager.create(Order, {
        orderNumber,
        userId,
        customerName: userData.fullName,
        customerEmail: userData.email,
        total,
        status: OrderStatus.COMPLETED
      });

      const savedOrder = await queryRunner.manager.save(order);

      // 6. Create order items and reduce stock
      for (const cartItem of cartItems) {
        if (!cartItem.product) {
          throw new NotFoundException('Product information not found in cart');
        }

        // Create order item (snapshot product data)
        const orderItem = queryRunner.manager.create(OrderItem, {
          orderId: savedOrder.id,
          productId: cartItem.productId,
          productName: cartItem.product.name,
          price: cartItem.product.price,
          quantity: cartItem.quantity
        });

        await queryRunner.manager.save(orderItem);

        // Reduce product stock
        await queryRunner.manager.decrement(
          Product,
          { id: cartItem.productId },
          'stock',
          cartItem.quantity
        );
      }

      // 7. Clear cart
      await queryRunner.manager.delete('cart_items', { userId });

      await queryRunner.commitTransaction();

      // Return order with items
      return this.findOne(savedOrder.id);

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(userId: number): Promise<Order[]> {
    return this.orderRepository.find({
      where: { userId },
      relations: ['items'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items']
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateStatus(id: number, status: OrderStatus): Promise<Order> {
    const order = await this.findOne(id);
    order.status = status;
    return this.orderRepository.save(order);
  }

  private async generateOrderNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    // Count total orders to generate sequential number
    const count = await this.orderRepository.count();
    const sequence = String(count + 1).padStart(3, '0');
    
    return `ORD-${year}${month}${day}-${sequence}`;
  }
}