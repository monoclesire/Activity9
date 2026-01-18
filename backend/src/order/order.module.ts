import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order, OrderItem } from './entities/order.entity';
import { Product } from '../products/entities/product.entity';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Product]),
    CartModule
  ],
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrderModule {}