import { ICard, IOrder} from "../../types/index";

export interface IApiModel {
    cdn: string;
    items: ICard;
    getProdutList: () => Promise<ICard[]>;
    postOrder: (order: IOrder) => Promise<ICard>;
  }