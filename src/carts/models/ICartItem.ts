import { IProduct } from '../../products/models/IProduct';

export type ICartItem = {
  product: IProduct,
  count: number,
}
