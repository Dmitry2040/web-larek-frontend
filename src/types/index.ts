// Приложение
export interface IAppStateData {
  basket: IBasket[];
  cardsList: ICardItem[];
  preview: string | null;
  order: IOrder | null;
}

// Товар
export interface ICardItem {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
  inBasket: boolean;
}

// Данные заказа
export interface IOrder {
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

// Корзина
export interface IBasket {
  quantity: number;
  title: string;
  price: number;
  totalPrice: number;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

// Типы событий
export enum EventTypes {
  ITEMS_CHANGED = 'items:changed',
  CARD_SELECT = 'card:select',
  PREVIEW_CHANGED = 'preview:changed',
  PRODUCT_DELETE = 'product:delete',
  BASKET_OPEN = 'basket:open',
  BASKET_ADD = 'basket:add',
  BASKET_CHANGED = 'basket:changed',
  FORM_ERRORS_CHANGE = 'formErrors:change',
  ORDER_OPEN = 'order:open',
  ORDER_READY = 'order:ready',
  ORDER_SUBMIT = 'order:submit',
  CONTACTS_READY = 'contacts:ready',
  CONTACTS_SUBMIT = 'contacts:submit',
  MODAL_OPEN = 'modal:open',
  MODAL_CLOSE = 'modal:close',
}