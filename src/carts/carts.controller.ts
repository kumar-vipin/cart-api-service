import {
  Controller, Get, Param, Req, HttpStatus, Put, Body, Delete, UseGuards, Post,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { AppRequest, getUserIdFromRequest } from '../shared';
import { calculateCartTotal } from './models-rules';
import { ICartItemUpdate } from './models';
import { BasicAuthGuard } from '../auth';
import { OrderService } from '../order/order.service';

const validateBody = (items: ICartItemUpdate[]) => {
  return items?.every(({ count, productId }) => {
    const isValidCartItem =
      Number.isFinite(count) && typeof productId === 'string';

    return isValidCartItem;
  });
};

@Controller('carts')
export class CartsController {
  constructor(
    private readonly cartsService: CartsService,
    private readonly orderService: OrderService,
  ) {
  }

  @UseGuards(BasicAuthGuard)
  @Get()
  async findUserCart(@Req() req: AppRequest) {
    const cart = await this.cartsService.findOrCreateCartByUserId(getUserIdFromRequest(req));
    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { cart, total: calculateCartTotal(cart) },
    };
  }

  @UseGuards(BasicAuthGuard)
  @Put()
  async updateUserCart(@Req() req: AppRequest, @Body() body) {
    const isItemsValid = validateBody(body.items);

    if (isItemsValid) {
      const cart = await this.cartsService.updateCartByUserId(
        getUserIdFromRequest(req),
        body,
      );

      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
        data: {
          cart,
          total: calculateCartTotal(cart),
        },
      };
    } else {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid items passed.',
      };
    }
  }

  @UseGuards(BasicAuthGuard)
  @Post('checkout')
  async checkout(@Req() req: AppRequest, @Body() body) {
    const userId = getUserIdFromRequest(req);
    const cart = await this.cartsService.findCartByUserId(userId);

    const {
      payment = { type: 'payment type' },
      delivery = { type: 'delivery type', address: 'address' },
      comments = 'Comment',
    } = body;

    if (!cart?.items?.length) {
      const statusCode = HttpStatus.BAD_REQUEST;
      req.statusCode = statusCode

      return {
        statusCode,
        message: 'Cart is empty',
      }
    }

    const { id: cartId } = cart;
    const total = calculateCartTotal(cart);
    const order = await this.orderService.create({
      userId, cartId, total, payment, delivery, comments,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { order }
    }
  }

  @UseGuards(BasicAuthGuard)
  @Delete()
  async clearUserCart(@Req() req: AppRequest) {
    await this.cartsService.removeCartByUserId(getUserIdFromRequest(req));

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
    }
  }

  @UseGuards(BasicAuthGuard)
  @Get()
  async findAll() {
    const carts = await this.cartsService.findAll();
    if (carts.length > 0) {
      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
        data: carts,
      };
    }
    return {
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Carts not found!',
    };
  }

  @UseGuards(BasicAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const cart = await this.cartsService.findOne(id);
    if (cart) {
      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
        data: cart,
      };
    }
    return {
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Cart not found!',
    };
  }
}
