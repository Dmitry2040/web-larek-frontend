export type CategoryType = "софт-скилл" | "хард-скилл" | "кнопка" | "дополнительное" | "другое";
export type PaymentMethod = "CARD" | "CASH";

export interface IMain {
    basket: IBasket[];
    cardsList: ICard[];
    preview: string;
    order: IOrder | null;
  }

export interface ICard {
    id: string;
    description: string;
    image: string;
    title: string;
    category: CategoryType;
    price: number;
}

export interface IBasket {
    count: number;
    title: string;
    price: number;
    totalPrice: number;
}

export interface IOrder {
    payment: PaymentMethod;
    address: string;
    email: string;
    phone: string;
    items: string[];
  }

  