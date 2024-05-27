export interface ICardView {
    id: HTMLElement;
    description: HTMLElement;
    image: HTMLElement;
    title:  HTMLElement;
    category: HTMLElement; 
    price: HTMLElement;
  
    render(): HTMLElement;
  }