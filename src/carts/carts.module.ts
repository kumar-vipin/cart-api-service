import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart, CartItem } from './entities';
import { Product } from '../products/entities';
import { Order } from '../order/entities/order.entity';
import { OrderService } from '../order/order.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem, Product, Order])],
  controllers: [CartsController],
  providers: [CartsService, OrderService],
})
export class CartsModule {}
