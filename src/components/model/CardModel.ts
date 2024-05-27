import { ICard } from "../../types";

export interface ICardModel {
  productCards: ICard[];
  selectedСards: ICard;
  preview(item: ICard): void;
}