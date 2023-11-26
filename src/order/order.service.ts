import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Order } from './entities/order.entity';
import { IOrder } from './models';
import { Cart, CartItem, CartStatus } from '../carts/entities';
import { PartialType } from '@nestjs/mapped-types';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly entityManager: EntityManager,
  ) {
  }

  async findById(orderId: string): Promise<Order> {
    return await this.orderRepository.findOne({ where: { id: orderId } });
  }

  async create(orderData: Partial<IOrder>): Promise<Order> {

    const cart = await this.entityManager.findOne<Cart>(Cart, {
      where: { id: orderData.cartId },
      relations: ['items'],
    });
    console.log('checkout---', cart);

    const items = (cart?.items || []).map(item => {
      const orderItem = new CartItem();
      orderItem.count = item.count;
      orderItem.product = item.product;
      return orderItem;
    });

    const newOrder = new Order();
    newOrder.cartId = orderData.cartId;
    newOrder.userId = orderData.userId;
    newOrder.items = items;
    newOrder.items.forEach(item => (item.cart = cart));
    newOrder.total = orderData.total;
    newOrder.status = CartStatus.ORDERED;
    newOrder.comments = orderData.comments;
    newOrder.payment = {
      ...orderData.payment,
    };
    newOrder.delivery = {
      ...orderData.delivery,
    };

    const createdOrder = await this.entityManager.save(newOrder);
    cart.status = CartStatus.ORDERED;
    await this.entityManager.save(cart);

    return createdOrder;
  }

}
