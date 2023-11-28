import { ICartItemUpdate } from './ICartItemUpdate';

export type ICartUpdate = {
  id: string,
  items: ICartItemUpdate[],
}
