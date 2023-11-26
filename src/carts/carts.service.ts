import { Injectable } from '@nestjs/common';
import { Cart, CartItem, CartStatus } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ICart, ICartUpdate } from './models';
import { Product } from '../products/entities';

@Injectable()
export class CartsService {

  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {
  }

  async findCartByUserId(userId: string): Promise<ICart> {
    return await this.cartRepository.findOne({
      where: { userId: userId, status: CartStatus.OPEN },
      relations: ['items', 'items.product'],
    });
  }

  async createUserCartById(userId: string) {
    const cart = new Cart();
    cart.userId = userId;
    cart.createdAt = new Date();
    cart.updatedAt = new Date();
    cart.status = CartStatus.OPEN;
    return this.cartRepository.save(cart);
  }

  async findOrCreateCartByUserId(userId: string): Promise<ICart> {
    const userCart = await this.findCartByUserId(userId);
    if (userCart) {
      return userCart;
    }
    return await this.createUserCartById(userId);
  }

  findAll() {
    return this.cartRepository.find();
  }

  findOne(id: string) {
    return this.cartRepository.findOneBy({ id });
  }

  async updateCartByUserId(userId: string, { items }: ICartUpdate): Promise<ICart> {
    const { id: cartId } = await this.findOrCreateCartByUserId(userId);

    await Promise.all(
      items.map(async item => {
        const cartItemDetails = await this.cartItemRepository.findOne({
          where: { cartId: cartId, productId: item.productId },
        });

        if (cartItemDetails) {
          if (item.count > 0) {
            cartItemDetails.count = item.count;
            await this.cartItemRepository.save(cartItemDetails);
          } else {
            await this.cartItemRepository.remove(cartItemDetails);
          }
        } else {
          const product = await this.productRepository.findOne({
            where: { id: item.productId },
          });
          console.log('Else', product);
          if (product) {
            const cartItem = new CartItem();
            cartItem.productId = product.id;
            cartItem.cartId = cartId;
            cartItem.cart = { id: cartId } as Cart;
            cartItem.product = product;
            cartItem.count = item.count;
            console.log('cartItem', cartItem);
            await this.cartItemRepository.save(cartItem);
          }
        }
      }),
    );

    const updatedItems = await this.cartItemRepository.find({
      where: { cartId: cartId },
      relations: ['product'],
    });

    return { id: cartId, items: updatedItems };
  }

  async removeCartByUserId(userId): Promise<void> {
    const userCart = await this.cartRepository.findOne({
      where: { userId: userId },
    });

    await this.cartItemRepository.delete({ cart: userCart });
    await this.cartRepository.remove(userCart);
  }
}
