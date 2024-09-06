import { EventTypes, FormErrors, ICardItem, IAppStateData, IOrder } from "../types";
import { Model } from "./base/Model";

export type CatalogChangeEvent = {
  catalog: ICardItem[]
};

export interface IOrderForm {
  payment: string;
  address: string;
  email: string;
  phone: string;
}

export class AppData extends Model<IAppStateData> {
  basket: ICardItem[] = [];
  catalog: ICardItem[];
  order: IOrder = {
      payment: '',
      address: '',
      email: '',
      phone: '',
      total: 0,
      items: [],
  };
  preview: string | null;
  formErrors: FormErrors = {};

  // Добавить товар в корзину
  addToBasket(card: ICardItem) {
    if (!this.basket.some(item => item.id === card.id)) {
      this.basket.push(card);
      this.emitChanges(EventTypes.BASKET_CHANGED, this.basket);
    }
  }

  // Удалить товар из корзины
  removeFromBasket(card: ICardItem) {
    this.basket = this.basket.filter((item) => item !== card);
    this.emitChanges(EventTypes.BASKET_CHANGED, this.basket);
  }

  // Очистить корзину
  clearBasket() {
    this.basket = [];
    this.emitChanges(EventTypes.BASKET_CHANGED, this.basket);
  }

  // Общая сумма товаров в корзине
  getTotalPrice() {
    return this.basket.reduce((total, item) => total + item.price, 0);
  }

  // Каталог товаров
  setCatalog(cards: ICardItem[]) {
      this.catalog = cards;
      this.emitChanges(EventTypes.ITEMS_CHANGED, { catalog: this.catalog });
  }

  // Предпросмотр 
  setPreview(card: ICardItem) {
      this.preview = card.id;
      this.emitChanges(EventTypes.PREVIEW_CHANGED, card);
  }

  // Установка поля заказа
  setOrderField(field: keyof IOrderForm, value: string ) { 
    this.order[field] = value; 
    if (this.validateOrder()) { 
        this.events.emit(EventTypes.ORDER_READY, this.order); 
    } 
  } 

  // Установка поля контактов
  setContactField(field: keyof IOrderForm, value: string ) { 
    this.order[field] = value; 
    if (this.validateContact()) { 
        this.events.emit(EventTypes.CONTACTS_READY, this.order); 
    } 
  } 

  // Валидация полей заказа
  validateOrder() { 
      const errors: typeof this.formErrors = {}; 
      if (!this.order.payment) { 
          errors.payment = 'Необходимо выбрать способ оплаты'; 
      } 
      if (!this.order.address) { 
          errors.address = 'Необходимо указать адрес'; 
      }      
      this.formErrors = errors; 
      this.events.emit(EventTypes.FORM_ERRORS_CHANGE, this.formErrors); 
      return Object.keys(errors).length === 0; 
  } 

  // Валидация полей контактов
  validateContact() { 
    const errors: typeof this.formErrors = {}; 
    if (!this.order.email) { 
        errors.email = 'Необходимо указать email'; 
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(this.order.email)) {
        errors.email = 'email должен быть в формате example123@example.example';
    } 
    if (!this.order.phone) { 
        errors.phone = 'Необходимо указать телефон'; 
    } else if (!/^\+?[0-9]{7,14}$/.test(this.order.phone)) {
        errors.phone = 'Номер телефона может начинаться с + и состоять толко из цифр';
    } 
    this.formErrors = errors; 
    this.events.emit(EventTypes.FORM_ERRORS_CHANGE, this.formErrors); 
    return Object.keys(errors).length === 0; 
  } 

  // Очистить форму заказа
  resetOrderForm() {
		this.order = {
			payment: '',
			address: '',
			email: '',
			phone: '',
			total: 0,
			items: [],
		};
	}

  // Данные заказа
  orderData() {
    this.order.items = [];
    this.basket.forEach((item) => {
      this.order.items.push(item.id);
    });
    this.order.total = this.getTotalPrice();
  }
}