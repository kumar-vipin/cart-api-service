import { ICartItem } from '../../carts/models';

export type IOrder = {
  id?: string,
  userId: string;
  cartId: string;
  items: ICartItem[]
  payment: {
    type: string,
    address?: any,
    creditCard?: any,
  },
  delivery: {
    type: string,
    address: any,
  },
  comments: string,
  status: string;
  total: number;
}
