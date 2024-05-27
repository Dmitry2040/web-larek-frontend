Ссылка на репозиторий: https://github.com/Dmitry2040/web-larek-frontend.git

# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
## Данные и типы данных используемые в приложении

Тип для категорий товаров
```
type CategoryType = "софт-скилл" | "хард-скилл" | "кнопка" | "дополнительное" | "другое";
```

Тип для методов оплаты товаров
```
type PaymentMethod = "CARD" | "CASH";
```

Главная страница
```
interface IMain {
    basket: IBasket[];
    cardsList: ICard[];
    preview: string;
    order: IOrder | null;
  }
```

Карточка товара
```
interface ICard {
    id: string;
    description: string;
    image: string;
    title: string;
    category: CategoryType;
    price: number;
  }
```

Корзина товаров
```
interface IBasket {
    count: number;
    title: string;
    price: number;
    totalPrice: number;
  }
```

Данные заказа
```
interface IOrder {
    payment: PaymentMethod;
    address: string;
    email: string;
    phone: string;
    items: string[];
  }
```

API-модель запроса на сервер
```
interface IApiModel {
    cdn: string;
    items: ICard;
    getProdutList: () => Promise<ICard[]>;
    postOrder: (order: IOrder) => Promise<ICard>;
  }
```

Модель корзины товаров
```
interface IBasketModel {
    items: ICard[];
    getCount: () => number;
    getTotalPrice: () => number;
    addToBasket(data: ICard): void;
    deleteFromBasket(item: ICard): void;
    clearBasket(): void
}
```

Модель карточки товара
```
interface ICardModel {
    productCards: ICard[];
    selectedСards: ICard;
    preview(item: ICard): void;
}
```

Модель формы
```
interface IFormModel {
    paymentMethod: string;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
    setOrderAddress(field: string, value: string): void
    validateOrder(): boolean;
    setOrderContacts(field: string, value: string): void
    validateContacts(): boolean;
    getOrderProducts(): IOrder;
    }
```

Интерфейс отображения карточки товара
```
interface ICardView {
    id: HTMLElement;
    description: HTMLElement;
    image: HTMLElement;
    title:  HTMLElement;
    category: HTMLElement; 
    price: HTMLElement;
  
    render(): HTMLElement;
  }
```

Интерфейс отображения корзины товаров и товаров в корзине
```
interface IBasketView {
    closeButton: HTMLButtonElement;
    title: HTMLTitleElement;
    productsList: HTMLElement;
    submitButton: HTMLButtonElement;
    totalPrice: HTMLSpanElement;
    counterAtPage: HTMLElement;
    busketButtonAtPage: HTMLButtonElement;
    renderCounterAtPage(value: number): HTMLElement;
    renderTotalPrice(totaPrice: number): HTMLElement;
    render():HTMLElement;
  }

  interface IBasketItemView {
  index: number;
  name: string;
  price: number;
  buttonDelete: HTMLButtonElement
  render(): HTMLElement;
}
```

Интерфейс отображения форм для заполнения данных
```
interface IFormOrder {
    formOrder: HTMLFormElement;
    inputAdress: HTMLInputElement;
    paymentMethod: HTMLElement;
    buttonSubmit: HTMLButtonElement;
    formErrors: HTMLElement;
    render(): HTMLElement;
  }
  
interface IFormContacts {
    formContacts: HTMLFormElement;
    inputEmail: HTMLInputElement;
    inputPhone: HTMLInputElement;
    buttonSubmit: HTMLButtonElement;
    formErrors: HTMLElement;
    render(): HTMLElement;
  }
```

Интерфейс отображения модальных окон и окна успешного заказа
```
interface IModal {
    openModal(): void;
    closeModal(): void;
    render(): HTMLElement;
  }
  
interface ISuccess {
    successImage: HTMLImageElement;
    decription: HTMLElement;
    totalPrice: HTMLElement;
    buttonToMainPage: HTMLButtonElement;
    render(): HTMLElement;
  }
```

## Архитектура приложения

Код приложения WEB-ларёк разделен на:
- слой отображения (все что отвечает за вывод информации пользователю);
- слой данных (вся логика приложения без интерфейса);
- presenter (связывает данные и отображение);

### Базовый код

#### Класс API
Класс API предоставляет базовую функциональность для работы с API.

##### Свойства:
- readonly baseUrl: string - неизменяемое свойство, URL основного API;
- protected options: RequestInit - защищенное свойство, дополнительные параметры для HTTP-запросов;
##### Конструктор:
- baseUrl: string - URL основного API; 
- options: RequestInit = {} - дополнительные параметры для HTTP-запросов;
##### Методы:
- protected handleResponse(response: Response): Promise<object> - защищеный метод, обрабатывает полученный ответ от сервера. Если ответ положительный (response.ok), он возвращает содержимое ответа в виде JSON. В противном случае, он возвращает содержимое ошибки из JSON-ответа;
- get(uri: string) - отправляет запрос с данными и возвращает ответ сервера в виде промиса с объектом;
- post(uri: string, data: object, method: ApiPostMethods = 'POST') - принимает объект с данными, обрабатывает и отправляет их как параметр при вызове метода;

#### Класс EventEmitter
Брокер событий используется в presenter для обработки событий и в слоях приложения для генерации событий.

##### Свойства:
- _events: Map - хранит карту событий и их подписчиков;
##### Конструктор:
- constructor() - создает _events, представляющую собой карту событий;
##### Методы:
- on() - устанавливает обработчик для указанного события;
- off() - удаляет обработчик для указанного события;
- emit() - инициирует событие с указанными данными;
- onAll() - устанавливает обработчик для всех событий;
- offAll() - удаляет все обработчики событий;
- trigger() - создает функцию-триггер, которая инициирует указанное событие при вызове;

### Слой данных

## класс ApiModel 
Имплементирует интерфейс IApiModel
```
interface IApiModel {
    cdn: string;
    items: ICard;
    getProdutList: () => Promise<ICard[]>;
    postOrder: (order: IOrder) => Promise<ICard>;
  }
```
методы:
- getProductList() - получает список товаров
- postOrder() - отправляет данные на сервер


## класс BasketModel
Имлементирует интерфейс IBasketModel

```
interface IBasketModel {
  items: ICard[];
  getCount: () => number;
  getTotalPrice: () => number;
  addToBasket(data: ICard): void;
  deleteFromBasket(item: ICard): void;
  clearBasket(): void
}
```
методы:
- getCount() - возвращает количество товаров в корзине
- getTotalPrice() - возвращает общую стоимость товаров
- addToBasket() - добавляет выбранный товар в корзину
- deleteFromBasket() - удаляет вбранный товар из корзины
- clearBasket() - очищает козину


## класс FormModel
Имплементирует интерфейс IFormModel

```
interface IFormModel {
  paymentMethod: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
  setOrderAddress(field: string, value: string): void
  validateOrder(): boolean;
  setOrderContacts(field: string, value: string): void
  validateContacts(): boolean;
  getOrderProducts(): IOrder;
}
```

методы:
- setOrderAddress() - устанавливает адрес пользователя
- validateOrder() - валидация полей формы и выбора метода оплаты
- setOrderContacts() - устанавливает данные в полях e-mail и номера телефона
- validateContacts() - валидация полей ввода e-mail и номера телефона
- getOrderProducts() - возврашает объект с данными пользователя и выбранныим товарами

## Класс CardModel 
Имплементирует интерфейс ICardModel 

```
interface ICardModel {
  productCards: ICard[];
  selectedСards: ICard;
  preview(item: ICard): void;
}
```

метод:
- setPreview() - устанавливает данные товара для предпросмотра

### Слой отображения
Позволет отображать элементы и окна страницы

## Класс Basket 
Имплементирует интерфейс IBasketView

```
interface IBasketView {
    closeButton: HTMLButtonElement;
    title: HTMLTitleElement;
    productsList: HTMLElement;
    submitButton: HTMLButtonElement;
    totalPrice: HTMLSpanElement;
    counterAtPage: HTMLElement;
    busketButtonAtPage: HTMLButtonElement;
    renderCounterAtPage(value: number): HTMLElement;
    renderTotalPrice(totaPrice: number): HTMLElement;
    render():HTMLElement;
  }
    
```

методы: 
- renderCounterAtPage() - отрисовывает число добавленных товаров в корзину на главной странице
- renderTotalPrice() - отрисовывает общую стоимость товаров в корзине
- render() - возвращает элемент корзины

## Класс BasektItem 
имплементирует интерфейс IBasketItemView

```
interface IBasketItem {
    index: number;
    name: string;
    price: number;
    deleteButton: HTMLButtonElement
    render(): HTMLElement;
  }
```

методы: 
- deleteItem() - удаляет товар из корзины
- render() - возвращает элемент товара в корзине

## Класс Card 
Имплементирует интерфейс ICardView

```
interface ICardView {
    id: HTMLElement;
    description: HTMLElement;
    image: HTMLElement;
    title:  HTMLElement;
    category: HTMLElement; 
    price: HTMLElement;
  
    render(): HTMLElement;
  }
```

методы:

render() - возвращает элемент карточки товара

## Класс Modal 
Имплементирует интерфейс IModal

```
interface IModal {
    openModal(): void;
    closeModal(): void;
    render(): HTMLElement;
  }
```

методы:

- openModal() - открывает модальное окно
- closeModal() - закрывает модальное окно
- render() - возвращае HTML элемент модального окна

## Класс Success
Имплементирует интерфейс ISuccess

```
interface ISuccess {
    successImage: HTMLImageElement;
    decription: HTMLElement;
    totalPrice: HTMLElement;
    buttonToMainPage: HTMLButtonElement;
    render(): HTMLElement;
  }
```

метод:
- render() - возвращает HTML элемент модального окна успешной покупки твоара

## Класс FormOrder
Имплементирует интерфейс IFormOrder 

```
interface IFormOrder {
    formOrder: HTMLFormElement;
    inputAdress: HTMLInputElement;
    paymentMethod: HTMLElement;
    buttonSubmit: HTMLButtonElement;
    formErrors: HTMLElement;
    render(): HTMLElement;
  }
```

метод:
- render() - возвращает HTML элемент формы заказа с полем ввода адреса и выбором способа оплаты

## Класс FormContacts
Имплементирует интерфейс IFormContacts

```
interface IFormContacts {
    formContacts: HTMLFormElement;
    inputEmail: HTMLInputElement;
    inputPhone: HTMLInputElement;
    buttonSubmit: HTMLButtonElement;
    formErrors: HTMLElement;
    render(): HTMLElement;
  }
```

метод:
- render() - возвращает HTML элемент формы заказа с полями ввода электронной почты и адрема


