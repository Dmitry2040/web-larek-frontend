import { ICard } from '../../types/index'

export interface IBasketModel {
  items: ICard[];
  getCount: () => number;
  getTotalPrice: () => number;
  addToBasket(data: ICard): void;
  deleteFromBasket(item: ICard): void;
  clearBasket(): void
}