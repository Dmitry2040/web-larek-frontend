import { EventTypes } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Components";
import { IEvents } from "../base/Events";

interface IModalData {
    content: HTMLElement;
}

export class Modal extends Component<IModalData> {
    protected _closeButton: HTMLButtonElement;
    protected _content: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this._content = ensureElement<HTMLElement>('.modal__content', container);

        this._closeButton.addEventListener('click', this.closeModal.bind(this));
        this.container.addEventListener('click', this.closeModal.bind(this));
        this._content.addEventListener('click', (event) => event.stopPropagation());
    }

    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    openModal() {
        this.toggleClass(this.container, 'modal_active', true);
        this.events.emit(EventTypes.MODAL_OPEN);
    }

    closeModal() {
        this.toggleClass(this.container, 'modal_active', false);
        this.content = null;
        this.events.emit(EventTypes.MODAL_CLOSE);
    }

    render(data: IModalData): HTMLElement {
        super.render(data);
        this.openModal();
        return this.container;
    }
}