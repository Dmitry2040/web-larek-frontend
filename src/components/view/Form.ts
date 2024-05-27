export interface IFormOrder {
    formOrder: HTMLFormElement;
    inputAdress: HTMLInputElement;
    paymentMethod: HTMLElement;
    buttonSubmit: HTMLButtonElement;
    formErrors: HTMLElement;
    render(): HTMLElement;
  }
  
export interface IFormContacts {
    formContacts: HTMLFormElement;
    inputEmail: HTMLInputElement;
    inputPhone: HTMLInputElement;
    buttonSubmit: HTMLButtonElement;
    formErrors: HTMLElement;
    render(): HTMLElement;
  }