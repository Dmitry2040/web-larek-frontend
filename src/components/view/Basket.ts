export interface IBasketView {
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
    
  export interface IBasketItem {
    index: number;
    name: string;
    price: number;
    buttonDelete: HTMLButtonElement
    render(): HTMLElement;
  }