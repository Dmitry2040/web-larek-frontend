import { Component } from "./base/Components";
import { ensureElement, createElement } from "./../utils/utils";
import { EventEmitter } from "./base/Events";
import { EventTypes } from "../types";

interface IBasketView {
    items: HTMLElement[];
    total: number;
}

export class Basket extends Component<IBasketView> {
    protected _basketList: HTMLElement;
    protected _totalPrice: HTMLElement;
    protected _basketButton: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this._basketList = ensureElement<HTMLElement>('.basket__list', this.container);
        this._totalPrice = this.container.querySelector('.basket__price');
        this._basketButton = this.container.querySelector('.basket__button');

        if (this._basketButton) {
            this._basketButton.addEventListener('click', () => {
                events.emit(EventTypes.ORDER_OPEN);
            });
        }

        this.items = [];
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this._basketList.replaceChildren(...items);
            this.setDisabled(this._basketButton, false);
        } else {
            const emptyMessage = createElement<HTMLParagraphElement>('p');
            this.setText(emptyMessage, 'Корзина пуста');
            this._basketList.replaceChildren(emptyMessage);
            this.setDisabled(this._basketButton, true);
        }
    }

    set total(total: number) {
        this.setText(this._totalPrice, `${total.toString()} синапсов`);
    }
}